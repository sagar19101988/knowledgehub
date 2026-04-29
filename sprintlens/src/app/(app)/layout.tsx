import { ReactNode } from "react"
import Sidebar from "@/components/layout/Sidebar"

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#fafafa] dark:bg-[#0a0a0a] selection:bg-primary/30">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Subtle background mesh for content area */}
        <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
        
        {/* Topbar */}
        <header className="h-20 border-b border-foreground/5 flex items-center px-8 bg-background/50 backdrop-blur-xl relative z-10 supports-[backdrop-filter]:bg-background/20">
          <div className="flex-1">
             <div className="h-10 w-full max-w-md bg-foreground/[0.03] rounded-full border border-foreground/[0.05] flex items-center px-4">
                <span className="text-sm text-muted-foreground mr-2">⌘K</span>
                <span className="text-sm text-foreground/40">Search anything...</span>
             </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                 <div className="text-sm font-bold group-hover:text-primary transition-colors">Workspace Admin</div>
                 <div className="text-xs text-muted-foreground">Premium Plan</div>
              </div>
              <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center p-0.5 shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                 <div className="h-full w-full bg-background rounded-full flex items-center justify-center border-2 border-transparent">
                   <span className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-primary to-blue-600">AD</span>
                 </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
          <div className="p-8 max-w-7xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
