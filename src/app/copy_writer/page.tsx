"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CopilotChat, useCopilotChatSuggestions } from "@copilotkit/react-ui"
import "@copilotkit/react-ui/styles.css";
import { TextMessage, Role } from "@copilotkit/runtime-client-gql";
import {
  PenTool,
  Sparkles,
  FileText,
  DollarSign,
  TrendingUp,
  Send,
  Mail,
  ShoppingCart,
  Megaphone,
  Brain,
  Zap,
  Star,
  ChevronDown,
  Check,
  Copy,
  Download,
  Target,
  Menu,
  X as CloseIcon,
} from "lucide-react"
import { useCoAgent, useCoAgentStateRender, useCopilotAction, useCopilotChat } from "@copilotkit/react-core"
import { ToolLogs } from "@/components/ui/tool-logs"
import { Button } from "@/components/ui/button"
import { initialPrompt2, suggestionPrompt2 } from "../prompts/prompts"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useLayout } from "../contexts/LayoutContext"
import { Card } from "@/components/ui/card"


const agents = [
  {
    id: "post_generation_agent",
    name: "Post Generator",
    description: "Generate posts for Linkedin and X with Gemini and Google web search",
    icon: Sparkles,
    gradient: "from-blue-500 to-purple-600",
    active: false,
  },
  {
    id: "stack_analysis_agent",
    name: "Stack Analyst",
    description: "Analyze the stack of a Project and generate insights from it",
    icon: FileText,
    gradient: "from-green-500 to-teal-600",
    active: false,
  },
  {
    id: "copywriter_agent",
    name: "Expert Copywriter",
    description: "Create high-converting copy with AI-powered market research",
    icon: PenTool,
    gradient: "from-orange-500 to-pink-600",
    active: true,
  }
]

const quickActions = [
  { label: "Sales Page Copy", icon: DollarSign, color: "text-green-600", prompt: "Write sales copy for a SaaS project management tool" },
  { label: "Facebook Ad Copy", icon: Megaphone, color: "text-blue-600", prompt: "Create Facebook ad copy for an online fitness program" },
  { label: "Email Sequence", icon: Mail, color: "text-purple-600", prompt: "Write a 3-email welcome sequence for a digital course" },
  { label: "Product Description", icon: ShoppingCart, color: "text-orange-600", prompt: "Generate product descriptions for eco-friendly clothing brand" },
]

interface CopyInterface {
  primary: {
    headlines: string[]
    body: string
    cta: string
    rationale: string
  }
  variations: {
    emotional: string
    logical: string
  }
}

// Copy Preview Component
const CopyPreview = ({ copy }: { copy: CopyInterface }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Primary Copy */}
      <Card className="p-4 lg:p-6 bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <h3 className="text-base lg:text-lg font-bold text-gray-900">Primary Copy</h3>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard(
              `${copy.primary.headlines.join('\n\n')}\n\n${copy.primary.body}\n\n${copy.primary.cta}`,
              'primary'
            )}
            className="rounded-lg text-xs lg:text-sm"
          >
            <Copy className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
            {copiedSection === 'primary' ? 'Copied!' : 'Copy'}
          </Button>
        </div>

        {/* Headlines */}
        <div className="mb-4 lg:mb-6">
          <h4 className="text-xs lg:text-sm font-semibold text-gray-700 mb-2 lg:mb-3 flex items-center gap-2">
            <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 text-orange-500" />
            Headline Options
          </h4>
          <div className="space-y-2">
            {copy.primary.headlines.map((headline, idx) => (
              <div
                key={idx}
                className="p-2 lg:p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200/50"
              >
                <p className="text-sm lg:text-base font-semibold text-gray-900">{headline}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Body Copy */}
        <div className="mb-4 lg:mb-6">
          <h4 className="text-xs lg:text-sm font-semibold text-gray-700 mb-2 lg:mb-3 flex items-center gap-2">
            <FileText className="w-3 h-3 lg:w-4 lg:h-4 text-orange-500" />
            Body Copy
          </h4>
          <div className="p-3 lg:p-4 bg-white rounded-lg border border-gray-200 whitespace-pre-wrap">
            <p className="text-sm lg:text-base text-gray-800 leading-relaxed">{copy.primary.body}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mb-4 lg:mb-6">
          <h4 className="text-xs lg:text-sm font-semibold text-gray-700 mb-2 lg:mb-3 flex items-center gap-2">
            <Zap className="w-3 h-3 lg:w-4 lg:h-4 text-orange-500" />
            Call-to-Action
          </h4>
          <div className="p-3 lg:p-4 bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg">
            <p className="text-sm lg:text-base text-white font-semibold text-center">{copy.primary.cta}</p>
          </div>
        </div>

        {/* Rationale */}
        {copy.primary.rationale && (
          <div className="p-3 lg:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-xs lg:text-sm font-semibold text-blue-900 mb-2">Strategic Rationale</h4>
            <p className="text-xs lg:text-sm text-blue-800">{copy.primary.rationale}</p>
          </div>
        )}
      </Card>

      {/* Variations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
        {/* Emotional Variation */}
        <Card className="p-4 lg:p-6 bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg rounded-2xl">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <h3 className="text-sm lg:text-lg font-bold text-gray-900">Variation A - Emotional</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(copy.variations.emotional, 'emotional')}
              className="rounded-lg"
            >
              <Copy className="w-3 h-3 lg:w-4 lg:h-4" />
            </Button>
          </div>
          <div className="p-3 lg:p-4 bg-pink-50 rounded-lg border border-pink-200 whitespace-pre-wrap">
            <p className="text-xs lg:text-sm text-gray-800 leading-relaxed">{copy.variations.emotional}</p>
          </div>
        </Card>

        {/* Logical Variation */}
        <Card className="p-4 lg:p-6 bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg rounded-2xl">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <h3 className="text-sm lg:text-lg font-bold text-gray-900">Variation B - Logical</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(copy.variations.logical, 'logical')}
              className="rounded-lg"
            >
              <Copy className="w-3 h-3 lg:w-4 lg:h-4" />
            </Button>
          </div>
          <div className="p-3 lg:p-4 bg-blue-50 rounded-lg border border-blue-200 whitespace-pre-wrap">
            <p className="text-xs lg:text-sm text-gray-800 leading-relaxed">{copy.variations.logical}</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Compact Copy Display for Chat
const CopyCompact = ({ copy }: { copy: CopyInterface }) => {
  return (
    <div className="space-y-3">
      <Card className="p-4 bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200/50 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <PenTool className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-semibold text-orange-900">Copy Generated</span>
        </div>
        <p className="text-xs text-gray-700 line-clamp-2">{copy.primary.headlines[0]}</p>
      </Card>
    </div>
  )
}


export default function CopywriterPage() {
  const router = useRouter()
  const { updateLayout } = useLayout()
  const [selectedAgent, setSelectedAgent] = useState(agents[2]) // Copywriter agent
  const [showCopy, setShowCopy] = useState(false)
  const [generatedCopy, setGeneratedCopy] = useState<CopyInterface>({
    primary: { headlines: [], body: "", cta: "", rationale: "" },
    variations: { emotional: "", logical: "" }
  })
  const [isAgentActive, setIsAgentActive] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  const { setState, running } = useCoAgent({
    name: "copywriter_agent",
    initialState: {
      tool_logs: []
    }
  })

  const { appendMessage } = useCopilotChat()

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.dropdown-container')) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  useCoAgentStateRender({
    name: "copywriter_agent",
    render: (state) => {
      return <ToolLogs logs={state?.state?.tool_logs || []} />
    }
  })

  useCopilotAction({
    name: "generate_copy",
    description: "Render generated copywriting content",
    parameters: [
      {
        name: "primary",
        type: "object",
        description: "The primary copy version",
        attributes: [
          {
            name: "headlines",
            type: "string[]",
            description: "Array of headline options (3-5)"
          },
          {
            name: "body",
            type: "string",
            description: "The main body copy"
          },
          {
            name: "cta",
            type: "string",
            description: "Call-to-action text"
          },
          {
            name: "rationale",
            type: "string",
            description: "Strategic rationale for the copy"
          }
        ]
      },
      {
        name: "variations",
        type: "object",
        description: "A/B test variations",
        attributes: [
          {
            name: "emotional",
            type: "string",
            description: "Emotional/story-driven variation"
          },
          {
            name: "logical",
            type: "string",
            description: "Data/logic-driven variation"
          }
        ]
      }
    ],
    render: ({ args }) => {
      return <CopyCompact copy={args as CopyInterface} />
    },
    handler: (args) => {
      console.log("Generated copy:", args)
      setShowCopy(true)
      setGeneratedCopy(args as CopyInterface)
      setState((prevState) => ({
        ...prevState,
        tool_logs: []
      }))
    }
  })

  useCopilotChatSuggestions({
    instructions: suggestionPrompt2,
  })

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-pink-50 overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white/90 backdrop-blur-xl rounded-lg shadow-lg flex items-center justify-center border border-gray-200/50"
      >
        {isSidebarOpen ? <CloseIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "flex flex-col min-h-screen w-80 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl transition-transform duration-300 ease-in-out",
        "fixed lg:relative z-40 lg:z-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Header */}
        <div className="h-auto lg:h-40 p-4 border-b border-gray-100/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="w-2 h-2 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                Open Gemini Canvas
              </h1>
              <p className="text-xs lg:text-sm text-gray-600">Expert Copywriting AI</p>
            </div>
          </div>

          {/* Enhanced Agent Selector */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">Active Agent</label>
            <div className="relative dropdown-container">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full p-3 lg:p-4 pr-8 border border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-sm text-sm transition-all duration-300 shadow-sm hover:shadow-md hover:bg-white/70 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 bg-gradient-to-r ${selectedAgent.gradient} rounded-lg flex items-center justify-center shadow-sm`}>
                    <selectedAgent.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">{selectedAgent.name}</span>
                </div>
                <ChevronDown 
                  className={cn(
                    "w-4 h-4 text-gray-500 transition-transform duration-300",
                    isDropdownOpen && "rotate-180"
                  )} 
                />
              </button>
              
              {/* Dropdown Menu */}
              <div className={cn(
                "absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-xl z-50 transition-all duration-300 transform origin-top",
                isDropdownOpen 
                  ? "opacity-100 scale-100 translate-y-0" 
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              )}>
                <div className="p-1">
                  {agents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => {
                        if (selectedAgent.id !== agent.id) {
                          updateLayout({ agent: agent.id })
                          if (agent.id === "post_generation_agent") {
                            router.push(`/post-generator`)
                          } else if (agent.id === "stack_analysis_agent") {
                            router.push(`/stack-analyzer`)
                          } else {
                            router.push(`/copy_writer`)
                          }
                        }
                        setIsDropdownOpen(false)
                        setIsSidebarOpen(false)
                      }}
                      className="w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center gap-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 hover:shadow-sm group"
                    >
                      <div className={`w-6 h-6 bg-gradient-to-r ${agent.gradient} rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                        <agent.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 group-hover:text-orange-700 transition-colors duration-200">{agent.name}</span>
                          {selectedAgent.id === agent.id && (
                            <Check className="w-4 h-4 text-orange-600" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600 transition-colors duration-200">{agent.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {/* Chat Input */}
          <CopilotChat 
            className="h-full p-2" 
            labels={{
              initial: initialPrompt2
            }}
            Input={({ onSend, inProgress }) => {
              useEffect(() => {
                setIsAgentActive(inProgress)
              }, [inProgress])
              
              const [input, setInput] = useState("")
              
              return (
                <div className="space-y-3">
                  <form className="flex flex-col gap-3">
                    <Textarea
                      value={input}
                      onKeyDown={(e) => {
                        if (e.key.toLowerCase() === 'enter' && !e.shiftKey && !inProgress) {
                          e.preventDefault()
                          if (input.trim()) {
                            appendMessage(new TextMessage({
                              role: Role.User,
                              content: input
                            }))
                            setInput("")
                            setIsSidebarOpen(false)
                          }
                        }
                      }}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Describe your copywriting project..."
                      className="min-h-[80px] resize-none rounded-xl border-muted-foreground/20 p-3"
                    />
                    <Button 
                      disabled={inProgress || !input.trim()}
                      onClick={(e) => {
                        e.preventDefault()
                        if (input.trim()) {
                          onSend(input)
                          setInput("")
                          setIsSidebarOpen(false)
                        }
                      }} 
                      className="self-end rounded-xl px-5 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white hover:shadow-lg transition-shadow"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Generate Copy
                    </Button>
                  </form>
                </div>
              )
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 p-4 lg:p-6 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 lg:gap-4 ml-12 lg:ml-0">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-gray-900 via-orange-800 to-pink-800 bg-clip-text text-transparent">
                  Copywriting Canvas
                </h2>
                <p className="text-xs lg:text-sm text-gray-600">Powered by Gemini AI & Market Research</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isAgentActive && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm text-xs lg:text-sm hidden sm:flex">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  Researching
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {showCopy ? (
            <CopyPreview copy={generatedCopy} />
          ) : (
            <div className="text-center py-8 lg:py-16 px-4">
              <div className="relative mb-6 lg:mb-8">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                  <PenTool className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 via-orange-800 to-pink-800 bg-clip-text text-transparent mb-2 lg:mb-3">
                Ready to Create Compelling Copy
              </h3>
              <p className="text-sm lg:text-base text-gray-600 mb-6 lg:mb-8 max-w-md mx-auto leading-relaxed">
                Harness AI-powered market research and proven persuasion frameworks to create high-converting copy.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 max-w-lg mx-auto">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    disabled={running}
                    className="h-auto p-4 lg:p-6 flex flex-col items-center gap-2 lg:gap-3 bg-white/50 backdrop-blur-sm border-gray-200/50 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 rounded-xl transition-all duration-300 group"
                    onClick={() => {
                      appendMessage(new TextMessage({
                        role: Role.User,
                        content: action.prompt
                      }))
                      setIsSidebarOpen(false)
                    }}
                  >
                    <action.icon
                      className={`w-5 h-5 lg:w-6 lg:h-6 ${action.color} group-hover:scale-110 transition-transform duration-200`}
                    />
                    <span className="text-xs lg:text-sm font-medium text-center">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}