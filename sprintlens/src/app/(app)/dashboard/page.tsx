"use client"

import { useState, useEffect } from "react"
import { useSettingsStore } from "@/store/useSettingsStore"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bot, AlertTriangle, UserCheck, Layers, GitPullRequest, Zap, ChevronRight, Activity, Clock } from "lucide-react"

export default function DashboardPage() {
  const { azdoConfig } = useSettingsStore()
  const [sprintsData, setSprintsData] = useState<any>(null)
  const [targetSprint, setTargetSprint] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [hasHydrated, setHasHydrated] = useState(false)

  const activeStats = sprintsData?.sprints?.[0] || null

  const loadStats = async (overrideSprint?: string) => {
      setLoading(true)
      if (!azdoConfig?.pat) {
         setLoading(false)
         return
      }
      try {
        const payload = { azdoConfig, targetSprint: overrideSprint ?? targetSprint }
        const res = await fetch('/api/azdo/dashboard', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(payload)
        })
        if (res.ok) {
           const data = await res.json()
           setSprintsData(data)
           if (data.defaultSprintId && data.defaultSprintId !== 'empty') {
               if(!targetSprint) setTargetSprint(data.defaultSprintId)
           }
        }
      } catch (e) {
         console.error(e)
      } finally {
         setLoading(false)
      }
  }

  useEffect(() => { setHasHydrated(true) }, [])
  useEffect(() => { if (hasHydrated) loadStats() }, [hasHydrated, azdoConfig])

  if (!hasHydrated) return null

  // Derived groups for tree UI
  const pbis = activeStats?.tickets?.filter((t: any) => t.isPBI) || []
  const tasks = activeStats?.tickets?.filter((t: any) => !t.isPBI) || []
  
  const spilledOrRemovedPBIs = pbis.filter((p: any) => p.category === 'removed' || p.category === 'spilled')

  return (
    <div className="container mx-auto p-4 max-w-7xl space-y-8">
      
      {/* Configuration Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-card border rounded-xl p-6 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sprint Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time Azure DevOps telemetry and insights.</p>
        </div>
        <div className="flex items-center gap-3">
          {(!loading && sprintsData?.availableSprints) && (
             <select 
                className="p-2 border rounded-md min-w-[250px] bg-background text-sm"
                value={targetSprint}
                onChange={(e) => { setTargetSprint(e.target.value); loadStats(e.target.value); }}
             >
                <option value="">Select Sprint...</option>
                {sprintsData.availableSprints.map((path: string) => (
                   <option key={path} value={path}>{path.split('\\').pop()}</option>
                ))}
             </select>
          )}
          {loading && <div className="text-sm text-blue-500 font-medium flex items-center gap-2"><Activity className="w-4 h-4 animate-pulse"/> Syncing...</div>}
        </div>
      </div>

      {!loading && activeStats && activeStats.id !== 'empty' && (
        <>
          {/* Top Level PBI Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
             <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total PBIs</CardTitle></CardHeader>
                <CardContent><div className="text-3xl font-bold">{activeStats.pbiDone + activeStats.pbiInProgress + activeStats.pbiNotStarted + activeStats.pbiRemoved + activeStats.pbiSpilled}</div></CardContent>
             </Card>
             <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Done</CardTitle></CardHeader>
                <CardContent><div className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">{activeStats.pbiDone}</div></CardContent>
             </Card>
             <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle></CardHeader>
                <CardContent><div className="text-3xl font-bold text-blue-600 dark:text-blue-500">{activeStats.pbiInProgress}</div></CardContent>
             </Card>
             <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Removed</CardTitle></CardHeader>
                <CardContent><div className="text-3xl font-bold text-orange-500">{activeStats.pbiRemoved}</div></CardContent>
             </Card>
             <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Spilled</CardTitle></CardHeader>
                <CardContent><div className="text-3xl font-bold text-red-500">{activeStats.pbiSpilled}</div></CardContent>
             </Card>
          </div>

          {/* AI Insight Regional Block */}
          {spilledOrRemovedPBIs.length > 0 && (
             <Card className="border-l-4 border-l-red-500 bg-red-500/5 dark:bg-red-500/10">
                <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Bot className="w-5 h-5 text-red-500" />
                      AI Insight: Spilled & Removed Work Items
                   </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   {spilledOrRemovedPBIs.map((pbi: any) => (
                      <div key={pbi.id} className="text-sm space-y-1 pb-3 border-b border-red-500/10 last:border-0 last:pb-0">
                         <div className="font-semibold text-foreground flex items-center gap-2">
                            <span className="text-muted-foreground text-xs font-mono">#{pbi.id}</span> 
                            {pbi.title} 
                            <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">{pbi.category}</span>
                         </div>
                         <div className="text-muted-foreground pl-10 flex gap-2 items-start mt-2">
                            <span className="shrink-0 mt-0.5 text-red-400"><AlertTriangle className="w-3.5 h-3.5" /></span>
                            <span className="leading-relaxed">
                               {pbi.spillReason || "Native history string extraction found no semantic narrative for why this scope was altered during the active iteration timeframe."}
                            </span>
                         </div>
                      </div>
                   ))}
                </CardContent>
             </Card>
          )}

          {/* Middle Section: PBI Execution Hierarchy vs Resource Load */}
          <div className="grid lg:grid-cols-2 gap-6">
             {/* Left Panel: PBI & Tasks */}
             <Card className="h-[600px] flex flex-col">
                <CardHeader>
                   <CardTitle className="text-lg flex items-center gap-2"><Layers className="w-5 h-5 text-blue-500"/> Execution Hierarchy</CardTitle>
                   <CardDescription>Current sprint PBIs and associated downstream tasks.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto pr-2 pb-2">
                   <div className="space-y-4">
                      {pbis.map((pbi: any) => {
                         const childTasks = tasks.filter((t: any) => t.parentId === pbi.id);
                         return (
                            <div key={pbi.id} className="border rounded-lg p-3 bg-background">
                                <div className="font-medium text-sm flex items-center gap-2">
                                   <span className="text-xs text-muted-foreground font-mono w-12 border-r">#{pbi.id}</span>
                                   <span className="truncate flex-1" title={pbi.title}>{pbi.title}</span>
                                   <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${pbi.category === 'done' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-secondary text-secondary-foreground'}`}>{pbi.state}</span>
                                </div>
                                
                                {childTasks.length > 0 && (
                                   <div className="mt-3 pl-4 space-y-2 border-l-2 border-muted ml-2">
                                      {childTasks.map((t: any) => (
                                         <div key={t.id} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs bg-muted/30 p-2 rounded gap-2">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                               <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0"/>
                                               <span className="truncate">{t.title}</span>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                               <span className="text-muted-foreground flex items-center gap-1 w-24 truncate" title={t.assignedTo}><UserCheck className="w-3 h-3"/> {t.assignedTo.split('<')[0]}</span>
                                               <span className={`w-16 text-right font-mono ${t.category === 'done' ? 'text-green-500' : 'text-orange-500'}`}>{t.state}</span>
                                            </div>
                                         </div>
                                      ))}
                                   </div>
                                )}
                            </div>
                         )
                      })}
                      {pbis.length === 0 && <div className="text-center text-muted-foreground py-10">No PBIs found.</div>}
                   </div>
                </CardContent>
             </Card>

             {/* Right Panel: Resource Capacity */}
             <Card className="h-[600px] flex flex-col">
                <CardHeader>
                   <CardTitle className="text-lg flex items-center gap-2"><Clock className="w-5 h-5 text-emerald-500"/> Team Capacity</CardTitle>
                   <CardDescription>Resource estimated vs completed work hours.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 min-h-[300px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activeStats.resourceBreakdown || []} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                         <XAxis dataKey="name" fontSize={11} angle={-45} textAnchor="end" tick={{ fill: 'hsl(var(--foreground))' }} tickLine={false} axisLine={false} />
                         <YAxis fontSize={11} tick={{ fill: 'hsl(var(--foreground))' }} tickLine={false} axisLine={false} />
                         <Tooltip cursor={{ fill: 'hsl(var(--muted)/0.5)' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                         <Legend wrapperStyle={{ paddingTop: '20px' }} />
                         <Bar name="Estimated Hours" dataKey="estimated" fill="hsl(var(--muted-foreground)/0.4)" radius={[4, 4, 0, 0]} />
                         <Bar name="Completed Hours" dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                   </ResponsiveContainer>
                </CardContent>
             </Card>
          </div>

          {/* Extended Analytics Sections */}
          <div className="grid md:grid-cols-3 gap-6">
             
             {/* Task Overrun Card */}
             <Card className="border-t-4 border-t-amber-500">
                <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-semibold flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500"/> Task Effort Overrun</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="flex flex-col gap-1">
                      <span className="text-4xl font-bold font-mono text-amber-500">{activeStats.overrunTasks || 0}</span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Tasks exceeded original estimate</span>
                   </div>
                   <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                      Total variance: <span className="font-bold text-foreground">
                         {Math.abs(activeStats.totalCompletedHours - activeStats.totalEstimatedHours).toFixed(1)}h
                      </span> {(activeStats.totalCompletedHours > activeStats.totalEstimatedHours) ? 'over budget' : 'under budget'}
                   </div>
                </CardContent>
             </Card>

             {/* Productivity Burn Down Quick Stat (Simulated summary as requested) */}
             <Card className="border-t-4 border-t-emerald-500">
                <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-semibold flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-500"/> Aggregate Burn Volume</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="flex flex-col gap-1">
                      <span className="text-4xl font-bold font-mono text-emerald-600">{activeStats.totalCompletedHours || 0}<span className="text-xl text-muted-foreground ml-1">hrs</span></span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Gross organic logged effort</span>
                   </div>
                   <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                      Against a total sprint capacity of <span className="font-bold text-foreground">{activeStats.totalEstimatedHours || 0}h</span>.
                   </div>
                </CardContent>
             </Card>

             {/* AI Tags Insight */}
             <Card className="border-t-4 border-t-blue-500">
                <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-semibold flex items-center gap-2"><Bot className="w-4 h-4 text-blue-500"/> AI & Pipeline Integrations</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="flex flex-col gap-1">
                      <span className="text-4xl font-bold font-mono text-blue-500">{activeStats.aiAnalytics?.total || 0}</span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Synthetic Touch Tasks</span>
                   </div>
                   <div className="mt-4 pt-4 border-t text-sm space-y-2">
                      <div className="flex justify-between items-center text-muted-foreground">
                         <span className="flex items-center gap-1"><GitPullRequest className="w-3 h-3"/> Active PR Locks</span>
                         <span className="font-bold text-foreground">{activeStats.prAnalytics?.statusCounts?.active || 0}</span>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                         <span>AI Tag Distribution</span>
                         <span className="font-bold text-foreground">{Object.keys(activeStats.aiAnalytics?.tagCategories || {}).length} unique vectors</span>
                      </div>
                   </div>
                </CardContent>
             </Card>
          </div>

        </>
      )}

      {/* Empty State Edge Case */}
      {!loading && activeStats?.id === 'empty' && (
         <div className="border border-dashed rounded-xl p-12 text-center text-muted-foreground bg-muted/10">
            No valid analytics payload retrieved. Please verify your Azure DevOps connection path.
         </div>
      )}
    </div>
  )
}
