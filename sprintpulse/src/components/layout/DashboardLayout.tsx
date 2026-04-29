import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useSprintStore } from '../../store/sprintStore';
import { useAuthStore } from '../../store/authStore';
import { LogOut, LayoutDashboard, Brain, Activity, Settings, CodeSquare } from 'lucide-react';
import LLMSettingsDrawer from '../settings/LLMSettingsDrawer';
import { useLLMStore } from '../../store/llmStore';
import AgentPanel from '../chat/AgentPanel';

export default function DashboardLayout() {
  const disconnect = useAuthStore(s => s.disconnect);
  const navigate = useNavigate();
  const location = useLocation();
  const toggleSettingsDrawer = useLLMStore(s => s.toggleDrawer);

  const { orgUrl, pat, project, team } = useAuthStore();
  const { iterations, initializeIterations } = useSprintStore();

  useEffect(() => {
    if (orgUrl && pat && project && team && iterations.length === 0) {
      initializeIterations(orgUrl, pat, project, team);
    }
  }, [orgUrl, pat, project, team, initializeIterations, iterations.length]);

  const handleLogout = () => {
    disconnect();
    navigate('/connect');
  };

  const navItems = [
    { label: 'Dashboard',       icon: <LayoutDashboard size={20} />, path: '/',          exact: true  },
    { label: 'Dev Intelligence', icon: <CodeSquare size={20} />,      path: '/developer', exact: false },
    { label: 'Agent Details',    icon: <Brain size={20} />,           path: '/agent',     exact: false },
  ];

  const isActive = (path: string, exact: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const pageTitles: Record<string, string> = {
    '/':          'Sprint Overview',
    '/developer': 'Developer Intelligence',
    '/agent':     'Agent Details',
  };

  const currentTitle = Object.entries(pageTitles).reverse().find(([path]) => location.pathname.startsWith(path))?.[1] ?? 'Sprint Pulse';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-16 lg:w-64 flex-shrink-0 bg-gray-900 text-white flex flex-col justify-between border-r border-gray-800 transition-all duration-300">
        <div>
          <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-800">
            <Activity className="text-indigo-400" size={28} />
            <span className="hidden lg:block ml-3 font-bold text-lg tracking-tight">Sprint Pulse</span>
          </div>

          <nav className="mt-8 flex flex-col gap-2 px-3">
            {navItems.map(item => {
              const active = isActive(item.path, item.exact);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors cursor-pointer ${
                    active
                      ? 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span className="hidden lg:block text-sm font-medium">{item.label}</span>
                  {active && <span className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                </button>
              );
            })}

            {/* Settings — triggers drawer, no route */}
            <button
              onClick={toggleSettingsDrawer}
              className="flex items-center gap-3 w-full p-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Settings size={20} />
              <span className="hidden lg:block text-sm font-medium">Settings</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="hidden lg:block text-sm font-medium">Disconnect</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header — dynamically reflects current page */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-8 shadow-sm z-10 shrink-0">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{currentTitle}</h2>
        </header>

        {/* Scrollable Workspace */}
        <div className="flex-1 overflow-auto p-8 relative dark:text-gray-200">
          <Outlet />
        </div>
      </main>

      {/* Global AI Settings Drawer */}
      <LLMSettingsDrawer />

      {/* Global AI Chat Panel */}
      <AgentPanel />
    </div>
  );
}
