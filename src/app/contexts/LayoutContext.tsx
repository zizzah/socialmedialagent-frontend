"use client"

import { usePathname } from 'next/navigation'
import React, { createContext, useContext, useState, ReactNode } from 'react'

interface LayoutState {
  title: string
  description: string
  showHeader: boolean
  headerContent?: ReactNode
  sidebarContent?: ReactNode
  theme: 'light' | 'dark' | 'auto'
  agent: string
}

interface LayoutContextType {
  layoutState: LayoutState
  updateLayout: (updates: Partial<LayoutState>) => void
}

// Agent configurations
const agentConfigs = {
  post_generation_agent: {
    title: "DeepMind × Gemini",
    description: "Powered by Google's most advanced AI models for generating LinkedIn and X posts"
  },
  stack_analysis_agent: {
    title: "DeepMind × Gemini",
    description: "Powered by Google's most advanced AI models for analyzing GitHub repositories"
  },
  copywriter_agent: {
    title: "DeepMind × Gemini",
    description: "Powered by Google's most advanced AI models for creating high-converting copy"
  }
}

const defaultLayoutState: LayoutState = {
  title: "DeepMind × Gemini",
  description: "Powered by Google's most advanced AI models for generating LinkedIn and X posts",
  showHeader: true,
  theme: 'light',
  agent: "post_generation_agent"
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  console.log('Current pathname:', pathname)
  
  // Determine agent based on pathname
  const getAgentFromPath = (path: string): string => {
    if (path === '/post-generator') return 'post_generation_agent'
    if (path === '/github-analyzer' || path === '/stack-analyzer') return 'stack_analysis_agent'
    if (path === '/copywriter') return 'copywriter_agent'
    return 'post_generation_agent' // default
  }
  
  const currentAgent = getAgentFromPath(pathname)
  const agentConfig = agentConfigs[currentAgent as keyof typeof agentConfigs]
  
  const [layoutState, setLayoutState] = useState<LayoutState>({
    ...defaultLayoutState,
    agent: currentAgent,
    title: agentConfig.title,
    description: agentConfig.description
  })
  
  console.log('Layout state:', layoutState)
  
  const updateLayout = (updates: Partial<LayoutState>) => {
    setLayoutState(prev => ({ ...prev, ...updates }))
  }

  return (
    <LayoutContext.Provider value={{ layoutState, updateLayout }}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}

// Helper hook to get current agent info
export function useCurrentAgent() {
  const { layoutState } = useLayout()
  
  const agentInfo = {
    post_generation_agent: {
      name: 'Post Generator',
      icon: '📱',
      color: 'blue',
      route: '/post-generator'
    },
    stack_analysis_agent: {
      name: 'GitHub Analyzer',
      icon: '🔧',
      color: 'purple',
      route: '/github-analyzer'
    },
    copywriter_agent: {
      name: 'Expert Copywriter',
      icon: '✍️',
      color: 'green',
      route: '/copywriter'
    }
  }
  
  return agentInfo[layoutState.agent as keyof typeof agentInfo] || agentInfo.post_generation_agent
}