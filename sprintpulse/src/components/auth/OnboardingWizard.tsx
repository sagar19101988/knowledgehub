import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Shield, Key, Network, FolderKanban, Users, ChevronRight, Check, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { AzdoService } from '../../services/azdo.service';
import type { AzdoProject, AzdoTeam } from '../../services/azdo.service';

export default function OnboardingWizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [pat, setPat] = useState('');
  const [orgUrl, setOrgUrl] = useState('');
  
  // Data lists
  const [projects, setProjects] = useState<AzdoProject[]>([]);
  const [teams, setTeams] = useState<AzdoTeam[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  
  // Search states
  const [projectSearch, setProjectSearch] = useState('');
  const [teamSearch, setTeamSearch] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { setCredentials, setProjectAndTeam } = useAuthStore();
  const navigate = useNavigate();

  const handleTestConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    
    try {
      const azdo = new AzdoService(orgUrl, pat);
      const fetchedProjects = await azdo.getProjects();
      setProjects(fetchedProjects);
      
      // Connection succeeded, proceed to step 2
      setCredentials(pat, orgUrl);
      setStep(2);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid URL or PAT. Please check your credentials and token scopes.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = async (projectId: string) => {
    setSelectedProjectId(projectId);
    setLoading(true);
    setErrorMsg(null);

    try {
      const azdo = new AzdoService(orgUrl, pat);
      const fetchedTeams = await azdo.getTeams(projectId);
      setTeams(fetchedTeams);
      setStep(3);
    } catch (err: any) {
       setErrorMsg('Failed to fetch teams for this project.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTeam = (teamId: string) => {
    const project = projects.find(p => p.id === selectedProjectId)?.name || selectedProjectId;
    const team = teams.find(t => t.id === teamId)?.name || teamId;
    
    setProjectAndTeam(project, team);
    navigate('/');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gray-900 overflow-hidden text-gray-200">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-gray-900 to-black pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-6 gap-2">
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${step >= num ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-500'}`}>
                {step > num ? <Check size={14} /> : num}
              </div>
              {num < 3 && <div className={`w-10 h-0.5 ${step > num ? 'bg-indigo-600' : 'bg-gray-800'}`} />}
            </React.Fragment>
          ))}
        </div>

        <motion.div 
          className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
          layout
        >
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-8">
                <div className="inline-flex p-3 rounded-full bg-indigo-500/20 text-indigo-400 mb-4 ring-1 ring-indigo-500/50">
                  <Shield size={32} />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Sprint Pulse Onboarding</h1>
                <p className="text-sm text-gray-400 mt-2">Connect to your Azure DevOps organization securely.</p>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-xs leading-relaxed text-red-400">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleTestConnection} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Organization URL</label>
                  <div className="relative">
                    <Network size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="url"
                      required
                      value={orgUrl}
                      onChange={(e) => setOrgUrl(e.target.value)}
                      placeholder="https://dev.azure.com/myorg"
                      className="w-full bg-gray-950/50 border border-gray-700/50 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Personal Access Token</label>
                  <div className="relative">
                    <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="password"
                      required
                      value={pat}
                      onChange={(e) => setPat(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxx..."
                      className="w-full bg-gray-950/50 border border-gray-700/50 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2">Needs scopes: Work Items (Read), Git (Read), Build (Read).</p>
                </div>

                <button
                  type="submit"
                  disabled={!pat || !orgUrl || loading}
                  className="w-full relative flex justify-center items-center py-3 px-4 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all overflow-hidden"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Testing Connection...
                    </span>
                  ) : (
                    'Connect & Authenticate'
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-full bg-blue-500/20 text-blue-400 mb-4 ring-1 ring-blue-500/50">
                  <FolderKanban size={32} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Select Project</h2>
                <p className="text-sm text-gray-400 mt-2">Discovered {projects.length} accessible projects in your instance.</p>
              </div>

              {errorMsg && <p className="text-sm text-red-400 mb-4">{errorMsg}</p>}

              <div className="mb-4 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="w-full bg-gray-950/50 border border-gray-700/50 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {projects
                  .filter(project => project.name.toLowerCase().includes(projectSearch.toLowerCase().trim()))
                  .map(project => (
                  <button
                    key={project.id}
                    onClick={() => handleSelectProject(project.id)}
                    disabled={loading}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-700/50 bg-gray-800/30 hover:bg-gray-800 hover:border-indigo-500/50 transition-all group"
                  >
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-semibold text-white tracking-tight">{project.name}</span>
                      {project.description && (
                        <span className="text-xs text-gray-500 text-left line-clamp-1">{project.description}</span>
                      )}
                    </div>
                    <ChevronRight size={18} className="text-gray-600 group-hover:text-indigo-400" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 mb-4 ring-1 ring-emerald-500/50">
                  <Users size={32} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Select Team</h2>
                <p className="text-sm text-gray-400 mt-2">Which delivery team are we analyzing?</p>
              </div>

              <div className="mb-4 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search teams..."
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  className="w-full bg-gray-950/50 border border-gray-700/50 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {teams
                  .filter(team => team.name.toLowerCase().includes(teamSearch.toLowerCase().trim()))
                  .map(team => (
                  <button
                    key={team.id}
                    onClick={() => handleSelectTeam(team.id)}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-700/50 bg-gray-800/30 hover:bg-gray-800 hover:border-emerald-500/50 transition-all group"
                  >
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-semibold text-white tracking-tight">{team.name}</span>
                      {team.description && (
                        <span className="text-xs text-gray-500 text-left line-clamp-1">{team.description}</span>
                      )}
                    </div>
                    <ChevronRight size={18} className="text-gray-600 group-hover:text-emerald-400" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
