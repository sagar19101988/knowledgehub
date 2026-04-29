"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, PlayCircle, Clock } from "lucide-react"

const REPORTS = [
  {
    id: "retro",
    title: "Sprint Retrospective",
    description: "AI-written retro with data backing from the selected sprint.",
    ready: true,
  },
  {
    id: "exec",
    title: "Stakeholder Update",
    description: "Executive summary, no jargon. Perfect for leadership emails.",
    ready: true,
  },
  {
    id: "qbr",
    title: "Quarter Business Review",
    description: "Full QBR deck content summarizing all sprints in the quarter.",
    ready: false,
  },
  {
    id: "risk",
    title: "Risk Report",
    description: "Current risks, mitigations, and owners for active projects.",
    ready: false,
  }
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Reports</h1>
          <p className="text-muted-foreground mt-1">Generate branded, automated reports backed by AI.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {REPORTS.map((report) => (
          <Card key={report.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-5 w-5 text-primary" />
                {report.title}
              </CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="bg-muted/30 p-4 rounded-md flex items-center justify-center h-24 border border-dashed">
                 <span className="text-sm text-muted-foreground">Template Preview</span>
              </div>
            </CardContent>
            <CardFooter>
              {report.ready ? (
                <Button className="w-full">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  <Clock className="mr-2 h-4 w-4" />
                  Coming Soon
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
