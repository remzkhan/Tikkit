"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  Ticket,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Loader2,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn, formatRelativeTime, getInitials } from "@/lib/utils"
import type { TicketListItem } from "@/types"

const statusColors: Record<string, string> = {
  OPEN: "bg-blue-500",
  IN_PROGRESS: "bg-yellow-500",
  PENDING: "bg-orange-500",
  ON_HOLD: "bg-gray-500",
  RESOLVED: "bg-green-500",
  CLOSED: "bg-gray-400",
}

const priorityLabels: Record<string, { label: string; class: string }> = {
  URGENT: { label: "Urgent", class: "text-red-600 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800" },
  HIGH: { label: "High", class: "text-orange-600 bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800" },
  MEDIUM: { label: "Medium", class: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800" },
  LOW: { label: "Low", class: "text-green-600 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800" },
}

interface DashboardStats {
  openTickets: number
  resolvedToday: number
  totalTickets: number
  slaBreached: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const firstName = session?.user?.name?.split(" ")[0] ?? "there"
  const [tickets, setTickets] = useState<TicketListItem[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    openTickets: 0,
    resolvedToday: 0,
    totalTickets: 0,
    slaBreached: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch recent tickets
        const res = await fetch("/api/tickets?pageSize=8&sortField=updatedAt&sortDirection=desc")
        if (res.ok) {
          const data = await res.json()
          setTickets(data.data || [])
          const total = data.total || 0
          const ticketList = data.data || []
          const openCount = ticketList.filter(
            (t: TicketListItem) => t.status === "OPEN" || t.status === "IN_PROGRESS" || t.status === "PENDING"
          ).length
          const slaCount = ticketList.filter((t: TicketListItem) => t.slaBreached).length

          setStats({
            openTickets: openCount,
            resolvedToday: 0,
            totalTickets: total,
            slaBreached: slaCount,
          })
        }
      } catch {
        // Handle silently
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statCards = [
    {
      label: "Open Tickets",
      value: String(stats.openTickets),
      icon: Ticket,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950",
    },
    {
      label: "Avg Response Time",
      value: "--",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950",
    },
    {
      label: "Total Tickets",
      value: String(stats.totalTickets),
      icon: CheckCircle2,
      color: "text-green-600 bg-green-50 dark:bg-green-950",
    },
    {
      label: "SLA Compliance",
      value: stats.totalTickets > 0
        ? `${Math.round(((stats.totalTickets - stats.slaBreached) / stats.totalTickets) * 100)}%`
        : "100%",
      icon: ShieldCheck,
      color: "text-violet-600 bg-violet-50 dark:bg-violet-950",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back, {firstName}
        </h2>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your support queue today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    stat.color
                  )}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{loading ? "--" : stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Tickets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Tickets</CardTitle>
          <CardDescription>
            Latest tickets in your support queue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Ticket className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No tickets yet. Create your first ticket to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {tickets.slice(0, 6).map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center gap-4 rounded-md px-3 py-2.5 transition-colors hover:bg-accent/50 cursor-pointer"
                  onClick={() => router.push("/tickets")}
                >
                  <div
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      statusColors[ticket.status] || "bg-gray-400"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">
                        #{ticket.number}
                      </span>
                      <span className="truncate text-sm font-medium">
                        {ticket.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {ticket.customer && (
                        <>
                          <span className="text-xs text-muted-foreground">
                            {ticket.customer.name || ticket.customer.email}
                          </span>
                          <span className="text-xs text-muted-foreground">&middot;</span>
                        </>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(ticket.updatedAt)}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "shrink-0 text-[10px]",
                      priorityLabels[ticket.priority]?.class
                    )}
                  >
                    {priorityLabels[ticket.priority]?.label}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
