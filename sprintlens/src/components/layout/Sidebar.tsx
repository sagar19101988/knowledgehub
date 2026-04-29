"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, LayoutDashboard, Search, Bot, FileText, Settings, Key, Zap } from "lucide-react"
import { motion } from "framer-motion"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/analyzer/sprint/current", icon: Search, label: "Deep Analyzer" },
  { href: "/agent", icon: Bot, label: "AI Agent" },
  { href: "/reports", icon: FileText, label: "Reports" },
]

const bottomNavItems = [
  { href: "/connect", icon: Key, label: "AzDO & LLM Setup" },
  { href: "/settings/connections", icon: Settings, label: "Settings" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[280px] border-r border-white/10 bg-background/40 backdrop-blur-3xl hidden md:flex flex-col relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] opacity-40" />
      </div>

      <div className="p-8 flex items-center space-x-3">
        <div className="bg-gradient-to-tr from-primary to-blue-500 p-2 rounded-xl shadow-lg shadow-primary/20">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <span className="font-extrabold text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          SprintLens
        </span>
      </div>
      
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className="relative flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group overflow-hidden"
            >
               {isActive && (
                 <motion.div
                   layoutId="activeTab"
                   className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-2xl dark:bg-primary/20"
                   initial={false}
                   transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                 />
               )}
               <div className={`relative z-10 flex items-center space-x-3 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                 <item.icon className="h-5 w-5" />
                 <span>{item.label}</span>
               </div>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 mx-4 mb-4 rounded-3xl bg-gradient-to-br from-primary/10 to-blue-500/10 border border-white/5 space-y-1">
        {bottomNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                isActive ? 'bg-background/80 text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
      
      {/* Premium upgrade card */}
      <div className="mx-8 mb-8 mt-auto rounded-2xl bg-gradient-to-tr from-foreground to-foreground/80 p-5 text-background shadow-xl">
         <div className="flex items-center space-x-2 font-bold mb-2">
            <Zap className="h-5 w-5 text-yellow-500" fill="currentColor" />
            <span>Enterprise</span>
         </div>
         <p className="text-xs opacity-80 mb-4 leading-relaxed">
            You are connected to unified gateway with unlimited limits.
         </p>
      </div>
    </aside>
  )
}
