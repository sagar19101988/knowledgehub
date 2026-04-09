import React from 'react';
import { Settings, BookOpen, ClipboardList, FlaskConical, Code2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { currentPage, setCurrentPage } = useAppStore();

  const navItems = [
    { id: 'integrations', icon: Settings, label: 'Integrations' },
    { id: 'stories', icon: BookOpen, label: 'Stories' },
    { id: 'plans', icon: ClipboardList, label: 'Test Plans' },
    { id: 'cases', icon: FlaskConical, label: 'Test Cases' },
    { id: 'code', icon: Code2, label: 'Code Generator' },
  ] as const;

  return (
    <div className="flex h-screen w-full bg-dark-900 border-r border-dark-700">
      {/* Sidebar */}
      <div className="w-16 md:w-64 flex flex-col bg-dark-800 border-r border-dark-700 z-10 transition-all duration-300">
        <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-dark-700 text-primary font-sans font-bold text-xl tracking-wider shadow-sm">
          <span className="hidden md:inline">TEST ORCHESTRATOR</span>
          <span className="inline md:hidden text-2xl">TO</span>
        </div>
        
        <nav className="flex-1 py-4 flex flex-col gap-2 px-2 md:px-4">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200 ${
                currentPage === item.id 
                  ? 'bg-dark-600 text-primary shadow-[inset_2px_0_0_0_#00D4FF]' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700'
              }`}
            >
              <item.icon size={20} className={currentPage === item.id ? 'text-primary drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]' : ''} />
              <span className="hidden md:block font-medium tracking-wide text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Block */}
        <div className="p-4 border-t border-dark-600 bg-dark-900/30">
          <div className="flex items-center gap-3 px-1 py-2 rounded-lg">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0 shadow-[0_0_10px_rgba(0,212,255,0.3)] border border-dark-500">
              {useAppStore.getState().user ? useAppStore.getState().user?.name[0].toUpperCase() : 'G'}
            </div>
            <div className="overflow-hidden hidden md:block">
              <p className="text-sm font-bold text-gray-200 truncate">
                {useAppStore.getState().user ? useAppStore.getState().user?.name : 'Guest User'}
              </p>
              <p className="text-[10px] text-gray-500 font-mono truncate tracking-widest uppercase">
                {useAppStore.getState().user ? 'SECURE SESSION' : 'LOCAL SESSION'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => useAppStore.getState().logout()}
            className="w-full mt-2 flex items-center justify-center md:justify-start gap-2.5 px-3 py-2 text-gray-500 hover:text-red-400 hover:bg-red-900/10 border border-transparent hover:border-red-900/30 rounded-lg transition-all text-xs font-bold uppercase tracking-widest"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-dark-900">
        <div className="scanline-bg"></div>
        {children}
      </div>
    </div>
  );
}
