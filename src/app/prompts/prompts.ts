// Initial prompts for each agent
export const initialPrompt = 'Hi! I am a Langgraph x Gemini powered AI agent capable of performing web search and generating LinkedIn and X (Twitter) posts.\n\n Click on the suggestions to get started.'

export const initialPrompt1 = 'Hi! I am a Langgraph x Gemini powered AI agent capable of performing analysis of Public GitHub Repositories.\n\n Click on the suggestions to get started.'

export const initialPrompt2 = 'Hi! I am an Elite Master Copywriter powered by Langgraph x Gemini. I create high-converting sales copy, landing pages, ad copy, and marketing content using proven persuasion frameworks and market research.\n\n Click on the suggestions to get started.'

// Suggestion prompts for each agent
export const suggestionPrompt = 'Generate suggestions that revolve around the creation/generation of LinkedIn and X (Twitter) posts on any specific topics.'

export const suggestionPrompt1 = `Generate suggestions that revolve around the analyzation of Public GitHub Repositories. Only provide suggestions from these public URLs:
[
  "https://github.com/freeCodeCamp/freeCodeCamp",
  "https://github.com/EbookFoundation/free-programming-books",
  "https://github.com/jwasham/coding-interview-university",
  "https://github.com/kamranahmedse/developer-roadmap",
  "https://github.com/public-apis/public-apis",
  "https://github.com/donnemartin/system-design-primer",
  "https://github.com/facebook/react",
  "https://github.com/tensorflow/tensorflow",
  "https://github.com/trekhleb/javascript-algorithms",
  "https://github.com/twbs/bootstrap",
  "https://github.com/vinta/awesome-python",
  "https://github.com/ohmyzsh/ohmyzsh",
  "https://github.com/tldr-pages/tldr",
  "https://github.com/ytdl-org/youtube-dl",
  "https://github.com/taigaio/taiga-back"
]`

export const suggestionPrompt2 = `Generate suggestions for copywriting projects. Focus on these categories:

**Sales & Landing Pages:**
- Write sales copy for a SaaS product landing page
- Create conversion-focused copy for an online course
- Generate product launch landing page copy

**Ad Copy:**
- Write Facebook ad copy for e-commerce store
- Create Google Ads copy for B2B service
- Generate LinkedIn sponsored content for enterprise software

**Email Marketing:**
- Write email sequence for product launch
- Create welcome email series for new subscribers
- Generate cart abandonment email copy

**Website Copy:**
- Write compelling About page copy
- Create homepage hero section copy
- Generate service page descriptions

**E-commerce:**
- Write product descriptions for fashion brand
- Create Amazon listing copy optimization
- Generate Shopify store product copy

Provide 4-5 diverse, specific copywriting project suggestions from the categories above.`

// Agent configurations
export const agentConfig = {
  postGenerator: {
    name: 'post_generation_agent',
    displayName: 'Post Generator',
    icon: '📱',
    initialPrompt: initialPrompt,
    suggestionPrompt: suggestionPrompt,
    description: 'Generate engaging social media posts for LinkedIn and Twitter/X'
  },
  githubAnalyzer: {
    name: 'stack_analysis_agent',
    displayName: 'GitHub Analyzer',
    icon: '🔧',
    initialPrompt: initialPrompt1,
    suggestionPrompt: suggestionPrompt1,
    description: 'Analyze public GitHub repositories for tech stack and architecture'
  },
  copywriter: {
    name: 'copywriter_agent',
    displayName: 'Expert Copywriter',
    icon: '✍️',
    initialPrompt: initialPrompt2,
    suggestionPrompt: suggestionPrompt2,
    description: 'Create high-converting copy for sales, ads, and marketing'
  }
}

// Helper function to get agent config by name
export const getAgentConfig = (agentName: string) => {
  return Object.values(agentConfig).find(agent => agent.name === agentName)
}

// All agents list
export const allAgents = Object.values(agentConfig)

// Agent selection options for UI
export const agentOptions = allAgents.map(agent => ({
  value: agent.name,
  label: `${agent.icon} ${agent.displayName}`,
  description: agent.description
}))

// Example usage prompts for documentation
export const examplePrompts = {
  postGenerator: [
    'Create a LinkedIn post about AI automation trends',
    'Generate a Twitter thread about sustainable technology',
    'Write a social media post about productivity tools',
    'Create engaging content about remote work tips'
  ],
  githubAnalyzer: [
    'Analyze https://github.com/facebook/react',
    'What tech stack does https://github.com/tensorflow/tensorflow use?',
    'Review the architecture of https://github.com/vercel/next.js',
    'Analyze code quality of https://github.com/microsoft/vscode'
  ],
  copywriter: [
    'Write sales copy for a project management SaaS',
    'Create Facebook ad copy for an online fitness program',
    'Generate landing page copy for a web design agency',
    'Write email sequence for a digital product launch',
    'Create product descriptions for eco-friendly clothing',
    'Write homepage hero section for AI startup',
    'Generate Google Ads copy for accounting software'
  ]
}

// Copywriter-specific frameworks (for UI hints/tooltips)
export const copywritingFrameworks = [
  {
    name: 'AIDA',
    description: 'Attention → Interest → Desire → Action',
    useCase: 'Sales pages, ads, email marketing'
  },
  {
    name: 'PAS',
    description: 'Problem → Agitate → Solution',
    useCase: 'Pain-point driven copy, B2B sales'
  },
  {
    name: 'FAB',
    description: 'Features → Advantages → Benefits',
    useCase: 'Product descriptions, service pages'
  },
  {
    name: 'BAB',
    description: 'Before → After → Bridge',
    useCase: 'Transformation stories, coaching'
  },
  {
    name: '4Ps',
    description: 'Picture → Promise → Proof → Push',
    useCase: 'Landing pages, webinar registration'
  }
]

// Copywriter capabilities for info display
export const copywriterCapabilities = {
  specializations: [
    'Sales Pages & Landing Pages',
    'Ad Copy (Google, Facebook, LinkedIn, TikTok)',
    'Email Marketing Sequences',
    'Website Copy (Homepage, About, Services)',
    'Product Descriptions',
    'Video Sales Letters (VSL)',
    'Blog Posts & Articles',
    'Social Media Ad Copy',
    'Case Studies & Testimonials'
  ],
  process: [
    '🔍 Market Research & Competitor Analysis',
    '🎯 Strategic Framework Development',
    '✍️ High-Converting Copy Creation',
    '🔄 A/B Test Variation Generation'
  ],
  features: [
    'Persuasion Psychology Integration',
    'Emotional Trigger Optimization',
    'SEO-Friendly Copy',
    'Multiple Headline Variations',
    'CTA Optimization',
    'Objection Handling',
    'Social Proof Integration'
  ]
}

// Type definitions for TypeScript
export type AgentType = 'post_generation_agent' | 'stack_analysis_agent' | 'copywriter_agent'

export interface AgentConfiguration {
  name: string
  displayName: string
  icon: string
  initialPrompt: string
  suggestionPrompt: string
  description: string
}

export interface CopywritingFramework {
  name: string
  description: string
  useCase: string
}