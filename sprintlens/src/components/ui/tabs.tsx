"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface TabsProps {
  defaultValue: string
  className?: string
  children: React.ReactNode
  onValueChange?: (value: string) => void
}

const TabsContext = React.createContext<{
  value: string
  setValue: (value: string) => void
} | null>(null)

export function Tabs({ defaultValue, className, children, onValueChange }: TabsProps) {
  const [value, setValue] = React.useState(defaultValue)

  const handleValueChange = (newValue: string) => {
    setValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ value, setValue: handleValueChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-xl bg-muted/20 p-1 text-muted-foreground backdrop-blur-md border border-white/5 shadow-2xl",
        className
      )}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const context = React.useContext(TabsContext)
  if (!context) return null

  const isActive = context.value === value

  return (
    <button
      onClick={() => context.setValue(value)}
      className={cn(
        "relative px-6 py-2 text-sm font-bold transition-colors outline-none whitespace-nowrap",
        isActive ? "text-foreground" : "hover:text-foreground/80",
        className
      )}
    >
      {isActive && (
        <motion.div
          layoutId="tab-active"
          className="absolute inset-0 bg-white/10 rounded-lg shadow-sm border border-white/10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  )
}

export function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const context = React.useContext(TabsContext)
  if (!context) return null

  return (
    <AnimatePresence mode="wait">
      {context.value === value && (
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 10, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.99 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className={cn("mt-6", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
