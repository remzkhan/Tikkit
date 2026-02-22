"use client"

import {
  Ticket,
  Clock,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Users,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const metrics = [
  {
    label: "Total Tickets",
    value: "1,284",
    change: "+18%",
    period: "vs last month",
    icon: Ticket,
    color: "text-blue-600 bg-blue-50 dark:bg-blue-950",
  },
  {
    label: "Avg First Response",
    value: "1.2h",
    change: "-22%",
    period: "vs last month",
    icon: Clock,
    color: "text-amber-600 bg-amber-50 dark:bg-amber-950",
  },
  {
    label: "Resolution Rate",
    value: "94.2%",
    change: "+3.1%",
    period: "vs last month",
    icon: CheckCircle2,
    color: "text-green-600 bg-green-50 dark:bg-green-950",
  },
  {
    label: "SLA Compliance",
    value: "98.5%",
    change: "+1.2%",
    period: "vs last month",
    icon: ShieldCheck,
    color: "text-violet-600 bg-violet-50 dark:bg-violet-950",
  },
]

const channelBreakdown = [
  { channel: "Email", tickets: 542, percentage: 42.2, color: "bg-blue-500" },
  { channel: "Slack", tickets: 321, percentage: 25.0, color: "bg-purple-500" },
  { channel: "Chat", tickets: 198, percentage: 15.4, color: "bg-green-500" },
  { channel: "API", tickets: 123, percentage: 9.6, color: "bg-orange-500" },
  { channel: "Phone", tickets: 67, percentage: 5.2, color: "bg-red-500" },
  { channel: "Other", tickets: 33, percentage: 2.6, color: "bg-gray-400" },
]

const topAgents = [
  { name: "Alex Morgan", resolved: 124, avgTime: "0.8h", satisfaction: "98%" },
  { name: "Jamie Lee", resolved: 112, avgTime: "1.1h", satisfaction: "96%" },
  { name: "Taylor Swift", resolved: 98, avgTime: "1.3h", satisfaction: "97%" },
  { name: "Jordan Rivera", resolved: 87, avgTime: "0.9h", satisfaction: "95%" },
  { name: "Casey Kim", resolved: 76, avgTime: "1.5h", satisfaction: "94%" },
]

const priorityDistribution = [
  { priority: "Urgent", count: 45, percentage: 3.5, color: "bg-red-500" },
  { priority: "High", count: 198, percentage: 15.4, color: "bg-orange-500" },
  { priority: "Medium", count: 687, percentage: 53.5, color: "bg-yellow-500" },
  { priority: "Low", count: 354, percentage: 27.6, color: "bg-green-500" },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Analytics and insights for your support operations.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    metric.color
                  )}
                >
                  <metric.icon className="h-4.5 w-4.5" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  {metric.change}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-xs text-muted-foreground">
                  {metric.label} &middot; {metric.period}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Channel Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4" />
              Tickets by Channel
            </CardTitle>
            <CardDescription>Distribution across support channels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {channelBreakdown.map((ch) => (
                <div key={ch.channel} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{ch.channel}</span>
                    <span className="text-muted-foreground">
                      {ch.tickets} ({ch.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full", ch.color)}
                      style={{ width: `${ch.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4" />
              Priority Distribution
            </CardTitle>
            <CardDescription>Ticket volume by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {priorityDistribution.map((p) => (
                <div key={p.priority} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{p.priority}</span>
                    <span className="text-muted-foreground">
                      {p.count} ({p.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full", p.color)}
                      style={{ width: `${p.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Agents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" />
            Top Agents
          </CardTitle>
          <CardDescription>
            Best performing agents this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Agent</th>
                  <th className="pb-2 pr-4 font-medium text-right">Resolved</th>
                  <th className="pb-2 pr-4 font-medium text-right">Avg Time</th>
                  <th className="pb-2 font-medium text-right">Satisfaction</th>
                </tr>
              </thead>
              <tbody>
                {topAgents.map((agent, idx) => (
                  <tr key={agent.name} className="border-b last:border-0">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="h-6 w-6 justify-center rounded-full p-0 text-[10px]"
                        >
                          {idx + 1}
                        </Badge>
                        <span className="font-medium">{agent.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-right">{agent.resolved}</td>
                    <td className="py-3 pr-4 text-right">{agent.avgTime}</td>
                    <td className="py-3 text-right">
                      <Badge variant="secondary" className="text-[10px]">
                        {agent.satisfaction}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
