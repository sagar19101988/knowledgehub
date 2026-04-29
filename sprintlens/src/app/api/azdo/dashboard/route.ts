import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    let { azdoConfig, targetSprint } = await req.json();

    if (!azdoConfig?.orgUrl || !azdoConfig?.pat) {
      return NextResponse.json({ error: 'AzDO Credentials missing' }, { status: 400 });
    }

    const cleanUrl = azdoConfig.orgUrl.trim().replace(/\/+$/, '');
    const authHeader = `Basic ${Buffer.from(`:${azdoConfig.pat.trim()}`).toString('base64')}`;

    let filterString = "";
    if (azdoConfig.team && azdoConfig.team.trim() !== '') {
       filterString = `[System.AreaPath] UNDER '${azdoConfig.team.trim()}' AND `;
    }

    // Natively fetch up to 2000 items for ultimate accuracy
    let wiqlQueryString = `SELECT [System.Id] FROM WorkItems ORDER BY [System.ChangedDate] DESC`;
    if (filterString !== '') {
        wiqlQueryString = `SELECT [System.Id] FROM WorkItems WHERE ${filterString.replace(' AND ', '')} ORDER BY [System.ChangedDate] DESC`;
    }

    const wiqlResp = await fetch(`${cleanUrl}/_apis/wit/wiql?$top=2000&api-version=6.0`, {
       method: 'POST',
       headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' },
       body: JSON.stringify({ query: wiqlQueryString }),
       cache: 'no-store'
    });

    if (!wiqlResp.ok) {
       return NextResponse.json({
          sprints: [{ id: 'empty', name: 'No Tickets Found', health: 100, completedPct: 0, totalItems: 0, completed: 0, active: 0, blocked: 0, distribution: { stories: 0, bugs: 0, tasks: 0 } }], defaultSprintId: 'empty'
       });
    }

    const data = await wiqlResp.json();
    const idArray = (data.workItems || data.results || []).map((w: any) => w.id);
    
    if (idArray.length === 0) {
       return NextResponse.json({
          sprints: [{ id: 'empty', name: 'No Tickets Found', health: 100, completedPct: 0, totalItems: 0, completed: 0, active: 0, blocked: 0, distribution: { stories: 0, bugs: 0, tasks: 0 } }], defaultSprintId: 'empty'
       });
    }

    // Batch fetch details to bypass 414 URI Too Long (Azure max is 200 per request)
    let allItems: any[] = [];
    const chunkSize = 200;
    for (let i = 0; i < idArray.length; i += chunkSize) {
        const chunk = idArray.slice(i, i + chunkSize).join(',');
        const detailResp = await fetch(`${cleanUrl}/_apis/wit/workitems?ids=${chunk}&$expand=relations&api-version=6.0`, {
            headers: { 'Authorization': authHeader }
        });
        if (detailResp.ok) {
            const detailData = await detailResp.json();
            allItems.push(...(detailData.value || []));
        }
    }

    const allDiscoveredPaths = [...new Set(allItems.map(i => i.fields['System.IterationPath'] || '').filter(Boolean))];

    // Intelligence Filter: Resolve vague inputs like "Sprint 2" to the precise active path
    if (targetSprint && targetSprint.trim() !== '') {
        const userSprint = targetSprint.toLowerCase().trim();
        const isExactPath = userSprint.includes('\\');

        // Extract all unique true paths that mathematically match the user's string
        const matchingPaths = [...new Set(allItems.map(i => i.fields['System.IterationPath'] || ''))]
            .filter(path => {
                const p = path.toLowerCase();
                if (isExactPath) return p.includes(userSprint);
                
                // If they just typed "Sprint 2", demand an EXACT match on the final folder node
                // This eliminates "Sprint 2" matching "Sprint 20" or "Sprint 28"
                const pathNodes = p.split('\\');
                return pathNodes[pathNodes.length - 1] === userSprint;
            });

        if (matchingPaths.length > 0) {
            // Because our WIQL query strictly orders by [System.ChangedDate] DESC, the very first
            // path in the matchingPaths array is organically the most newly updated mathematical timeframe!
            // This safely forces Azure to grab FY2026-2027/Quarter1/Sprint2 and violently reject FY2025/Quarter1/Sprint2!
            const trueActivePath = matchingPaths[0];
            
            allItems = allItems.filter(item => 
                (item.fields['System.IterationPath'] || '').toLowerCase() === trueActivePath.toLowerCase()
            );
            
            // Set the targetSprint internally to the gorgeous full directory structure so it displays accurately on the UI
            targetSprint = trueActivePath;
        } else {
            allItems = []; // No match found in the payload
        }
    }
    
    if (allItems.length === 0) {
       return NextResponse.json({
          sprints: [{ id: 'empty', name: 'No Tickets Found', health: 100, completedPct: 0, totalItems: 0, completed: 0, active: 0, blocked: 0, distribution: { stories: 0, bugs: 0, tasks: 0 } }], defaultSprintId: 'empty',
          availableSprints: typeof allDiscoveredPaths !== 'undefined' ? allDiscoveredPaths : []
       });
    }

    let pbiCount = 0, pbiDone = 0, pbiRemoved = 0, pbiSpilled = 0, pbiInProgress = 0, pbiNotStarted = 0;
    let taskCount = 0, taskDone = 0, taskRemoved = 0;
    let blocked = 0;
    let totalEstimatedHours = 0, totalCompletedHours = 0;
    let overrunTasks = 0;
    let aiAssistedTasks = 0;
    let aiDoneCount = 0;
    let aiHoursTotal = 0;
    let stdTaskCount = 0;
    let stdDoneCount = 0;
    let stdHoursTotal = 0;
    const aiTagCategories: Record<string, number> = {};
    const aiByEngineer: Record<string, number> = {};
    let prAttachedTasks = 0;
    let prBlockedTasks = 0;
    // Collect PR URLs from relations for Phase 2 batch fetch
    const prRelationUrls: string[] = [];
    let stats = { stories: 0, bugs: 0, tasks: 0 };
    const ticketList: any[] = [];
    const resourceStats: Record<string, { estimated: number, completed: number, taskCount: number, taskDone: number, activities: { dev: number, qa: number, automation: number } }> = {};
    const activityStats: Record<string, { estimated: number, completed: number }> = {};
    const capacityStats = {
        Dev: { estimated: 0, completed: 0 },
        Testing: { estimated: 0, completed: 0 },
        Automation: { estimated: 0, completed: 0 }
    };

    allItems.forEach((item: any) => {
        const state = (item.fields['System.State'] || '').toLowerCase();
        const type = (item.fields['System.WorkItemType'] || '').toLowerCase();

        const isDone = ['done', 'closed', 'resolved'].includes(state);
        const isRemoved = ['removed', 'cut', 'obsolete'].includes(state);
        const isNotStarted = ['new', 'to do', 'approved', 'proposed', 'ready for development'].includes(state);
        const isInProgress = !isDone && !isRemoved && !isNotStarted;
        const isActive = isInProgress || isNotStarted;

        let category = 'in-progress';
        if (isDone) category = 'done';
        else if (isRemoved) category = 'removed';
        else if (isNotStarted) category = 'not-started';

        const isPBI = type.includes('product backlog item') || type.includes('story') || type.includes('bug');
        
        // Smart Tag & Artifact Parsing for CI/CD bottlenecks & AI tracking
        // Azure DevOps stores tags as a semicolon-delimited string e.g. "AI_Code; Bug_Fix; Performance"
        // We split by semicolon and check each individual tag for the substring 'ai' (case-insensitive)
        // This correctly catches: AI, AI_Code, AI_Assisted, AI-Generated, GenAI, etc.
        const rawTagsString = String(item.fields['System.Tags'] || '');
        const tagList = rawTagsString.split(';').map((t: string) => t.trim().toLowerCase());
        const rawTitle = String(item.fields['System.Title'] || '').toLowerCase();
        
        // STRICT AI tag matching: only tags that explicitly START with "AI_" prefix
        // or are exactly "AI" qualify. This enforces the naming convention AI_Code, AI_Test, etc.
        // ✅ "AI_Code"    → starts with 'ai_'  → MATCH
        // ✅ "AI_Test"    → starts with 'ai_'  → MATCH
        // ✅ "AI"         → exactly 'ai'       → MATCH
        // ❌ "SONAR_FAILING"  → no             → NO MATCH
        // ❌ "EROS_AUTOMATION_FAILURE_INVESTIGATION" → no → NO MATCH
        const matchedAITag = tagList.find((tag: string) => tag === 'ai' || tag.startsWith('ai_'));
        const isAIAssisted = !!matchedAITag;

        // Declare hours fields here so they are available to both AI tracking AND the main body below
        const originalEst = Number(item.fields['Microsoft.VSTS.Scheduling.OriginalEstimate'] || item.fields['Microsoft.VSTS.Scheduling.StoryPoints'] || 0);
        const actualWork = Number(item.fields['Microsoft.VSTS.Scheduling.CompletedWork'] || item.fields['Microsoft.VSTS.Scheduling.ActualWork'] || 0);

        if (isAIAssisted && !isRemoved) {
            aiAssistedTasks++;
            if (isDone) aiDoneCount++;
            aiHoursTotal += originalEst || 0;
            // Count by tag category (e.g. ai_code, ai_test, ai_review)
            const cat = matchedAITag || 'ai';
            aiTagCategories[cat] = (aiTagCategories[cat] || 0) + 1;
            // Count by engineer
            const eng = String(item.fields['System.AssignedTo']?.displayName || item.fields['System.AssignedTo'] || 'Unassigned');
            aiByEngineer[eng] = (aiByEngineer[eng] || 0) + 1;
        } else if (!isRemoved) {
            stdTaskCount++;
            if (isDone) stdDoneCount++;
            stdHoursTotal += originalEst || 0;
        }
        
        let prCount = 0;
        let hasPR = false;
        if (item.relations) {
            item.relations.forEach((rel: any) => {
                const url = rel.url ? rel.url : '';
                const urlLower = url.toLowerCase();
                const name = rel.attributes && rel.attributes.name ? rel.attributes.name.toLowerCase() : '';
                if (urlLower.includes('pullrequest') || name.includes('pull request')) {
                    hasPR = true;
                    prCount++;
                    // Collect unique PR URLs for Phase 2 batch fetch
                    if (url && !prRelationUrls.includes(url)) prRelationUrls.push(url);
                }
            });
        }
        
        if (hasPR && !isRemoved) {
             prAttachedTasks++;
             // If a ticket is NOT done, but it has a PR physically attached to it, it is mechanically bottlenecked on Code Review!
             if (!isDone) prBlockedTasks++;
        }

        let spillReason = null;
        if (isPBI && (isRemoved || (!isDone && !isRemoved))) {
            const desc = String(item.fields['System.Description'] || '');
            const hist = String(item.fields['System.History'] || '');
            const combinedText = (hist + ' ' + desc).replace(/<[^>]*>?/gm, ' ');
            
            const match = combinedText.match(/([^.?!]*?(?:spill|block|remov|carry|scope|capacit)[^.?!]*)[.?!]/i);
            if (match && match[1] && match[1].trim().length > 10) {
                 spillReason = match[1].trim();
                 if (spillReason.length > 150) spillReason = spillReason.substring(0, 147) + '...';
            } else {
                 if (isRemoved) spillReason = "Removed from iteration scope without explicit narrative logged.";
            }
        }

        let parentId = item.fields['System.Parent'] || null;
        if (!parentId && item.relations) {
            const parentRel = item.relations.find((r: any) => r.rel === 'System.LinkTypes.Hierarchy-Reverse');
            if (parentRel && parentRel.url) {
                const parts = parentRel.url.split('/');
                parentId = parseInt(parts[parts.length - 1], 10);
            }
        }

        const assignObj = item.fields['System.AssignedTo'];
        const assignedTo = assignObj?.displayName || (typeof assignObj === 'string' ? assignObj : 'Unassigned');
        
        // (originalEst and actualWork are declared above, near the AI tracking block)
        
        let isOverrun = false;
        if (!isRemoved && actualWork > originalEst && originalEst > 0) {
            overrunTasks++;
            isOverrun = true;
        }

        const activityRaw = item.fields['Microsoft.VSTS.Common.Activity'];
        const activityType = activityRaw || item.fields['System.WorkItemType'] || 'General';

        if (!isRemoved) {
            if (originalEst > 0 || actualWork > 0) {
                if (!activityStats[activityType]) {
                    activityStats[activityType] = { estimated: 0, completed: 0 };
                }
                activityStats[activityType].estimated += originalEst;
                activityStats[activityType].completed += actualWork;
                
                // Smart Heuristic Capacity Sorting
                const t = (item.fields['System.Title'] || '').toLowerCase();
                const act = activityType.toLowerCase();
                
                if (act.includes('auto') || t.includes('auto')) {
                    capacityStats.Automation.estimated += originalEst;
                    capacityStats.Automation.completed += actualWork;
                } else if (act.includes('test') || t.includes('test') || t.includes('qa')) {
                    capacityStats.Testing.estimated += originalEst;
                    capacityStats.Testing.completed += actualWork;
                } else if (act.includes('dev') || type.includes('dev') || t.includes('dev') || t.includes('code')) {
                    capacityStats.Dev.estimated += originalEst;
                    capacityStats.Dev.completed += actualWork;
                } else {
                    // If completely uncategorized, distribute equally or drop into Dev pool for general estimation
                    capacityStats.Dev.estimated += originalEst;
                    capacityStats.Dev.completed += actualWork;
                }
            }

            // Only group resource states for actionable execution (Tasks/Bugs), ignoring root empty epics
            if (type.includes('task') || type.includes('bug')) {
                 if (!resourceStats[assignedTo]) {
                     resourceStats[assignedTo] = { estimated: 0, completed: 0, taskCount: 0, taskDone: 0, activities: { dev: 0, qa: 0, automation: 0 } };
                 }
                 resourceStats[assignedTo].taskCount++;
                 if (isDone) resourceStats[assignedTo].taskDone++;
                 
                 const t = (item.fields['System.Title'] || '').toLowerCase();
                 const act = activityType.toLowerCase();
                 if (act.includes('auto') || t.includes('auto')) resourceStats[assignedTo].activities.automation++;
                 else if (act.includes('test') || t.includes('test') || t.includes('qa')) resourceStats[assignedTo].activities.qa++;
                 else resourceStats[assignedTo].activities.dev++;
                 
                 if (originalEst > 0 || actualWork > 0) {
                     totalEstimatedHours += originalEst;
                     totalCompletedHours += actualWork;
                     resourceStats[assignedTo].estimated += originalEst;
                     resourceStats[assignedTo].completed += actualWork;
                 }
            } else {
                 // For purely standalone items like isolated PBIs that have hours directly tracked
                 if (originalEst > 0 || actualWork > 0) {
                     totalEstimatedHours += originalEst;
                     totalCompletedHours += actualWork;
                     if (!resourceStats[assignedTo]) {
                         resourceStats[assignedTo] = { estimated: 0, completed: 0, taskCount: 0, taskDone: 0, activities: { dev: 0, qa: 0, automation: 0 } };
                     }
                     resourceStats[assignedTo].estimated += originalEst;
                     resourceStats[assignedTo].completed += actualWork;
                     resourceStats[assignedTo].taskCount++;
                     if (isDone) resourceStats[assignedTo].taskDone++;
                 }
            }
        }

        ticketList.push({
            id: item.id,
            title: item.fields['System.Title'] || 'Untitled',
            type: item.fields['System.WorkItemType'] || 'Item',
            state: item.fields['System.State'] || 'Unknown',
            category,
            isPBI,
            parentId: parentId || null,
            overrun: isOverrun,
            spillReason,
            originalEst,
            actualWork,
            assignedTo,
            activityType,
            createdDate: item.fields['System.CreatedDate'] || null,
            closedDate: item.fields['Microsoft.VSTS.Common.ClosedDate'] || item.fields['System.StateChangeDate'] || null,
            isAIAssisted,
            hasPR,
            prCount,
            tags: rawTagsString,
            aiTag: matchedAITag || null
        });

        if (state === 'blocked' || state === 'impediment') blocked++;

        if (type.includes('product backlog item') || type.includes('story') || type.includes('bug')) {
            pbiCount++;
            if (isDone) pbiDone++;
            else if (isRemoved) pbiRemoved++;
            else if (isNotStarted) pbiNotStarted++;
            else pbiInProgress++;
            
            // Heuristic to detect spilled PBIs explicitly by tags or comments
            if (!isDone && !!spillReason && spillReason.toLowerCase().includes('spill')) pbiSpilled++;
        } else if (type.includes('task')) {
            taskCount++;
            if (isDone) taskDone++;
            else if (isRemoved) taskRemoved++;
        }
    });

    // Attempt to strictly override capacity heuristics with the explicit Iteration Teams Capacity API
    if (azdoConfig.project && azdoConfig.team && targetSprint) {
        try {
            const itResp = await fetch(`${cleanUrl}/${encodeURIComponent(azdoConfig.project)}/${encodeURIComponent(azdoConfig.team)}/_apis/work/teamsettings/iterations?api-version=6.0`, {
                headers: { 'Authorization': authHeader }, cache: 'no-store'
            });
            if (itResp.ok) {
                const itData = await itResp.json();
                const configIteration = itData.value.find((i:any) => i.path === targetSprint);
                
                if (configIteration && configIteration.attributes && configIteration.attributes.startDate && configIteration.attributes.finishDate) {
                    const capResp = await fetch(`${cleanUrl}/${encodeURIComponent(azdoConfig.project)}/${encodeURIComponent(azdoConfig.team)}/_apis/work/teamsettings/iterations/${configIteration.id}/capacities?api-version=6.0`, {
                        headers: { 'Authorization': authHeader }, cache: 'no-store'
                    });
                    
                    if (capResp.ok) {
                        const capData = await capResp.json();
                        const start = new Date(configIteration.attributes.startDate);
                        const end = new Date(configIteration.attributes.finishDate);
                        
                        let sprintDays = 0;
                        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                            if (d.getDay() !== 0 && d.getDay() !== 6) sprintDays++;
                        }
                        
                        // We safely retrieved the physical true AzDO capacity. Wipe out the heuristic guess!
                        capacityStats.Dev.estimated = 0;
                        capacityStats.Testing.estimated = 0;
                        capacityStats.Automation.estimated = 0;
                        
                        capData.value.forEach((worker: any) => {
                            let memberDaysOff = 0;
                            if (worker.daysOff) {
                                worker.daysOff.forEach((doff:any) => {
                                    let ds = new Date(doff.start);
                                    let de = new Date(doff.end);
                                    for (let d = new Date(ds); d <= de; d.setDate(d.getDate() + 1)) {
                                        if (d >= start && d <= end && d.getDay() !== 0 && d.getDay() !== 6) memberDaysOff++;
                                    }
                                });
                            }
                            const workingDays = Math.max(0, sprintDays - memberDaysOff);
                            
                            if (worker.activities) {
                                worker.activities.forEach((act:any) => {
                                    const n = act.name.toLowerCase();
                                    const capValue = act.capacityPerDay * workingDays;
                                    
                                    if (n.includes('auto')) capacityStats.Automation.estimated += capValue;
                                    else if (n.includes('test') || n.includes('qa')) capacityStats.Testing.estimated += capValue;
                                    else capacityStats.Dev.estimated += capValue;
                                });
                            }
                        });
                    }
                }
            }
        } catch (e) {
            console.warn('Strict AzDO Capacity API fetch aborted. Relying on heuristic ticket-level estimates fallback.');
        }
    }

    // ── PHASE 2: PR Batch Fetch ────────────────────────────────────────────────
    // Extract numeric PR IDs from relation URLs and fetch real PR metadata in parallel
    interface PRDetail {
        prId: number; title: string; status: string; createdBy: string;
        creationDate: string | null; completionDate: string | null;
        ageDays: number; cycleDays: number | null;
        reviewers: { displayName: string; vote: number }[];
        isDraft: boolean;
    }
    const prDetails: PRDetail[] = [];
    let prAvgCycleDays: number | null = null;
    let prAvgAgeDays: number | null = null;
    const prReviewerLoad: Record<string, number> = {};
    const prStatusCounts = { active: 0, completed: 0, abandoned: 0 };

    if (prRelationUrls.length > 0 && azdoConfig.project) {
        try {
            const fetchedPRIds = new Set<number>();
            const prFetches = prRelationUrls.map(async (url) => {
                // URL pattern: .../_apis/git/repositories/{repoId}/pullRequests/{prId}
                const match = url.match(/pullrequests?\/(\d+)/i);
                if (!match) return;
                const prId = parseInt(match[1], 10);
                if (fetchedPRIds.has(prId)) return;
                fetchedPRIds.add(prId);

                try {
                    // Try canonical PR URL first, fallback to project-scoped query
                    let prApiUrl = url.includes('_apis') ? url : `${cleanUrl}/${encodeURIComponent(azdoConfig.project)}/_apis/git/pullrequests/${prId}?api-version=6.0`;
                    if (!prApiUrl.includes('api-version')) prApiUrl += '?api-version=6.0';

                    const prResp = await fetch(prApiUrl, { headers: { 'Authorization': authHeader }, cache: 'no-store' });
                    if (!prResp.ok) return;
                    const pr = await prResp.json();

                    const creationDate = pr.creationDate || null;
                    const completionDate = pr.closedDate || pr.completionQueueTime || null;
                    const now = new Date();
                    const created = creationDate ? new Date(creationDate) : null;
                    const closed = completionDate ? new Date(completionDate) : null;
                    const ageDays = created ? Math.floor((now.getTime() - created.getTime()) / 86400000) : 0;
                    const cycleDays = (created && closed) ? Math.floor((closed.getTime() - created.getTime()) / 86400000) : null;

                    const statusRaw = (pr.status || '').toLowerCase();
                    if (statusRaw === 'active') prStatusCounts.active++;
                    else if (statusRaw === 'completed') prStatusCounts.completed++;
                    else if (statusRaw === 'abandoned') prStatusCounts.abandoned++;

                    // Reviewer leaderboard (only count non-author reviewers with a vote)
                    const reviewers = (pr.reviewers || []).map((r: any) => ({
                        displayName: r.displayName || 'Unknown',
                        vote: r.vote || 0
                    }));
                    reviewers.forEach((r: any) => {
                        if (r.displayName !== pr.createdBy?.displayName) {
                            prReviewerLoad[r.displayName] = (prReviewerLoad[r.displayName] || 0) + 1;
                        }
                    });

                    prDetails.push({
                        prId, title: pr.title || `PR #${prId}`,
                        status: pr.status || 'unknown',
                        createdBy: pr.createdBy?.displayName || 'Unknown',
                        creationDate, completionDate, ageDays, cycleDays,
                        reviewers, isDraft: !!pr.isDraft
                    });
                } catch { /* skip individual PR fetch failures silently */ }
            });
            await Promise.all(prFetches);

            if (prDetails.length > 0) {
                const withCycle = prDetails.filter(p => p.cycleDays !== null);
                if (withCycle.length > 0) prAvgCycleDays = Math.round(withCycle.reduce((s, p) => s + (p.cycleDays || 0), 0) / withCycle.length);
                prAvgAgeDays = Math.round(prDetails.reduce((s, p) => s + p.ageDays, 0) / prDetails.length);
            }
        } catch (e) {
            console.warn('PR batch fetch aborted:', e);
        }
    }
    // ── END PHASE 2 ────────────────────────────────────────────────────────────

    const exactSprintPayload = {
        id: targetSprint || 'Global Overview',
        name: targetSprint ? targetSprint.split('\\').pop() : 'Global Overview',
        pbiCount, pbiDone, pbiRemoved, pbiSpilled, pbiInProgress, pbiNotStarted,
        taskCount, taskDone, taskRemoved,
        blocked,
        overrunTasks,
        aiAssistedTasks,
        prAttachedTasks,
        prBlockedTasks,
        // Phase 1: Rich AI analytics breakdown
        aiAnalytics: {
            total: aiAssistedTasks,
            done: aiDoneCount,
            completionRate: aiAssistedTasks > 0 ? Math.round((aiDoneCount / aiAssistedTasks) * 100) : 0,
            stdCompletionRate: stdTaskCount > 0 ? Math.round((stdDoneCount / stdTaskCount) * 100) : 0,
            avgHoursPerAITask: aiAssistedTasks > 0 ? Math.round((aiHoursTotal / aiAssistedTasks) * 10) / 10 : 0,
            avgHoursPerStdTask: stdTaskCount > 0 ? Math.round((stdHoursTotal / stdTaskCount) * 10) / 10 : 0,
            adoptionRate: (aiAssistedTasks + stdTaskCount) > 0 ? Math.round((aiAssistedTasks / (aiAssistedTasks + stdTaskCount)) * 100) : 0,
            tagCategories: Object.entries(aiTagCategories).map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count),
            byEngineer: Object.entries(aiByEngineer).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
        },
        // Phase 2: Real PR pipeline analytics from Git API
        prAnalytics: {
            total: prDetails.length,
            statusCounts: prStatusCounts,
            avgAgeDays: prAvgAgeDays,
            avgCycleDays: prAvgCycleDays,
            reviewerLeaderboard: Object.entries(prReviewerLoad).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8),
            details: prDetails.sort((a, b) => b.ageDays - a.ageDays), // oldest first
        },
        distribution: stats,
        tickets: ticketList,
        totalEstimatedHours,
        totalCompletedHours,
        resourceBreakdown: Object.keys(resourceStats).map(name => ({
             name: name.split(' ')[0], // First name for compact areas
             fullName: name,           // Full name for rich graphs
             estimated: resourceStats[name].estimated,
             completed: resourceStats[name].completed,
             taskCount: resourceStats[name].taskCount,
             taskDone: resourceStats[name].taskDone,
             activities: resourceStats[name].activities
        })).sort((a,b) => b.taskCount - a.taskCount), // Sort by task count to find the heaviest hitter
        activityBreakdown: Object.keys(activityStats).map(name => ({
             name,
             estimated: activityStats[name].estimated,
             completed: activityStats[name].completed
        })).sort((a,b) => Math.max(b.estimated, b.completed) - Math.max(a.estimated, a.completed)),
        capacityBreakdown: Object.keys(capacityStats).map((name) => ({
             name,
             // @ts-ignore
             estimated: capacityStats[name].estimated,
             // @ts-ignore
             completed: capacityStats[name].completed
        }))
    };

    return NextResponse.json({
        sprints: [exactSprintPayload],
        defaultSprintId: exactSprintPayload.id,
        availableSprints: allDiscoveredPaths
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
