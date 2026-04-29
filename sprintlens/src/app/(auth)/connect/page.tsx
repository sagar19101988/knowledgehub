"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Key, Server, CheckCircle2, ChevronRight, ChevronLeft, Loader2, Activity } from "lucide-react"
import { useLLMStore } from "@/store/useLLMStore"
import { useSettingsStore } from "@/store/useSettingsStore"

export default function ConnectPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Local state for forms
  const [orgUrl, setOrgUrl] = useState("")
  const [pat, setPat] = useState("")
  const [teamArea, setTeamArea] = useState("")

  
  const [groqKey, setGroqKey] = useState("")
  const [openaiKey, setOpenaiKey] = useState("")
  const [anthropicKey, setAnthropicKey] = useState("")

  const { addConfig, setActiveModel } = useLLMStore()
  const { setAzdoConfig } = useSettingsStore()

  const handleNext = () => {
    setLoading(true)
    
    // Save AzDO config on passing step 1
    if (step === 1) {
      if (orgUrl && pat) {
        setAzdoConfig({ orgUrl, pat, team: teamArea })
      }
    }
    
    // Save LLM configs on passing step 2
    if (step === 2) {
      if (groqKey) {
          addConfig({ providerId: 'groq', apiKey: groqKey })
          setActiveModel('groq', 'llama-3.3-70b-versatile')
      }
      if (openaiKey) {
          addConfig({ providerId: 'openai', apiKey: openaiKey })
          if (!groqKey) setActiveModel('openai', 'gpt-4o')
      }
      if (anthropicKey) {
          addConfig({ providerId: 'anthropic', apiKey: anthropicKey })
          if (!groqKey && !openaiKey) setActiveModel('anthropic', 'claude-3-5-sonnet-latest')
      }
    }

    setTimeout(() => {
      setLoading(false)
      setStep(step + 1)
    }, 800)
  }

  const handleBack = () => setStep(step - 1)

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/20">
      <div className="w-full max-w-md p-4">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-primary bg-primary/10' : 'border-muted'}`}>
              <Server className="h-4 w-4" />
            </div>
            <span className="text-xs mt-2 font-medium">AzDO</span>
          </div>
          <div className={`h-1 flex-1 mx-4 rounded ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-primary bg-primary/10' : 'border-muted'}`}>
              <Key className="h-4 w-4" />
            </div>
            <span className="text-xs mt-2 font-medium">LLM Access</span>
          </div>
          <div className={`h-1 flex-1 mx-4 rounded ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-primary bg-primary/10' : 'border-muted'}`}>
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <span className="text-xs mt-2 font-medium">Ready</span>
          </div>
        </div>

        {step === 1 && (
          <Card className="border-t-4 border-t-primary shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Connect Azure DevOps</CardTitle>
              <CardDescription>
                Provide your organization details and Personal Access Token (PAT).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgUrl">Organization URL</Label>
                <Input id="orgUrl" placeholder="https://dev.azure.com/yourorg" value={orgUrl} onChange={e => setOrgUrl(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pat">Personal Access Token</Label>
                <Input id="pat" type="password" placeholder="Enter your PAT" value={pat} onChange={e => setPat(e.target.value)} />
                <p className="text-xs text-muted-foreground">
                  Requires 'Work Items: Read' and 'Project and Team: Read' scopes.
                </p>
              </div>
              <div className="space-y-2 pt-2 border-t border-muted/50">
                <Label htmlFor="teamFocus">Project / Team Path Lock (Optional)</Label>
                <Input id="teamFocus" placeholder="e.g. MyProject, or MyProject\BackendTeam" value={teamArea} onChange={e => setTeamArea(e.target.value)} />
                <p className="text-xs text-muted-foreground">
                  Lock all analytics to this specific Azure DevOps Project or Team Area.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleNext} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Connect & Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card className="border-t-4 border-t-blue-500 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">LLM Provider Setup</CardTitle>
              <CardDescription>
                Configure at least one Language Model provider for analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groq">Groq API Key (Optional)</Label>
                <Input id="groq" type="password" placeholder="gsk_..." value={groqKey} onChange={e => setGroqKey(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="openai">OpenAI API Key (Optional)</Label>
                <Input id="openai" type="password" placeholder="sk-..." value={openaiKey} onChange={e => setOpenaiKey(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anthropic">Anthropic API Key (Optional)</Label>
                <Input id="anthropic" type="password" placeholder="sk-ant-..." value={anthropicKey} onChange={e => setAnthropicKey(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="azure">Azure OpenAI Endpoint (Optional)</Label>
                <Input id="azure" placeholder="https://your-resource.openai.azure.com/" disabled />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack} disabled={loading}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Configuration
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card className="border-t-4 border-t-emerald-500 shadow-lg border-2 border-emerald-500/20">
            <CardContent className="pt-10 pb-8 flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Successfully Connected!</h3>
                <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
                  Your Azure DevOps data is syncing. We are ready to analyze your sprints.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t bg-muted/50 p-4">
              <Button className="w-full max-w-sm" onClick={() => window.location.href = '/dashboard'}>
                Go to Dashboard
                <Activity className="ml-2 h-4 w-4 text-emerald-400" />
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
