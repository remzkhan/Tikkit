"use client"

import { useState, useEffect, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  X,
  Send,
  Lock,
  Unlock,
  Clock,
  User as UserIcon,
  Mail,
  Building2,
  MessageSquare,
  Activity,
  ChevronDown,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PriorityBadge } from "@/components/tickets/priority-badge"
import { StatusBadge } from "@/components/tickets/status-badge"
import { SlaBadge } from "@/components/tickets/sla-badge"
import { useUIStore } from "@/stores/ui-store"
import { TICKET_STATUSES, PRIORITIES } from "@/lib/constants"
import { cn, formatRelativeTime, getInitials } from "@/lib/utils"
import type { TicketWithRelations } from "@/types"

interface TicketDetailProps {
  ticketId: string
}

function MessageBubble({
  message,
}: {
  message: TicketWithRelations["messages"][number]
}) {
  const isInternal = message.type === "NOTE"

  return (
    <div
      className={cn(
        "group flex gap-3 rounded-lg p-3",
        isInternal
          ? "bg-yellow-50 border border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800"
          : "bg-muted/50"
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage
          src={message.author?.avatar || undefined}
          alt={message.author?.name || ""}
        />
        <AvatarFallback className="text-xs">
          {message.author
            ? getInitials(message.author.name || "U")
            : "SYS"}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {message.author?.name || "System"}
          </span>
          {isInternal && (
            <Badge
              variant="outline"
              className="h-4 border-yellow-300 px-1 text-[10px] text-yellow-600 dark:border-yellow-700 dark:text-yellow-400"
            >
              <Lock className="mr-0.5 h-2.5 w-2.5" />
              Internal
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(message.createdAt)}
          </span>
        </div>
        <div className="mt-1 text-sm text-foreground whitespace-pre-wrap break-words">
          {message.body}
        </div>
      </div>
    </div>
  )
}

function ActivityItem({
  activity,
}: {
  activity: TicketWithRelations["activities"][number]
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
        <Activity className="h-3 w-3 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            {activity.user?.name || "System"}
          </span>{" "}
          {activity.type.replace(/_/g, " ")}
        </p>
        <span className="text-[10px] text-muted-foreground">
          {formatRelativeTime(activity.createdAt)}
        </span>
      </div>
    </div>
  )
}

function TicketDetailContent({ ticketId }: TicketDetailProps) {
  const { closeDetailPanel } = useUIStore()
  const [ticket, setTicket] = useState<TicketWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState("")
  const [isInternal, setIsInternal] = useState(false)
  const [sending, setSending] = useState(false)
  const [activeTab, setActiveTab] = useState<"messages" | "activity">("messages")

  const fetchTicket = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/tickets/${ticketId}`)
      if (res.ok) {
        const data = await res.json()
        setTicket(data.data || data)
      }
    } catch {
      // Silently handle errors
    } finally {
      setLoading(false)
    }
  }, [ticketId])

  useEffect(() => {
    fetchTicket()
  }, [fetchTicket])

  const handleStatusChange = async (status: string) => {
    if (!ticket) return
    try {
      await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      setTicket({ ...ticket, status })
    } catch {
      // Silently handle errors
    }
  }

  const handlePriorityChange = async (priority: string) => {
    if (!ticket) return
    try {
      await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority }),
      })
      setTicket({ ...ticket, priority })
    } catch {
      // Silently handle errors
    }
  }

  const handleSendReply = async () => {
    if (!replyText.trim() || sending) return
    try {
      setSending(true)
      const res = await fetch(`/api/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyText,
          type: isInternal ? "NOTE" : "REPLY",
        }),
      })
      if (res.ok) {
        setReplyText("")
        fetchTicket()
      }
    } catch {
      // Silently handle errors
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
        <p className="text-sm text-muted-foreground">Ticket not found</p>
        <Button variant="outline" size="sm" onClick={closeDetailPanel}>
          Close
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-sm font-mono text-muted-foreground">
              #{ticket.number}
            </span>
            <SlaBadge slaDeadline={ticket.slaDeadline} />
          </div>
          <h2 className="mt-1 truncate text-lg font-semibold">{ticket.title}</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={closeDetailPanel}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Status & Priority controls */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Status
              </label>
              <Select
                value={ticket.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TICKET_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn("h-2 w-2 rounded-full", s.color)}
                        />
                        {s.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Priority
              </label>
              <Select
                value={ticket.priority}
                onValueChange={handlePriorityChange}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignee */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Assignee
            </label>
            <div className="flex items-center gap-2 rounded-md border px-3 py-2">
              {ticket.assignee ? (
                <>
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={ticket.assignee.avatar || undefined}
                      alt={ticket.assignee.name || ""}
                    />
                    <AvatarFallback className="text-[10px]">
                      {getInitials(
                        ticket.assignee.name || ticket.assignee.email
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{ticket.assignee.name}</span>
                </>
              ) : (
                <>
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Unassigned
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Tags */}
          {ticket.tags.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ticket.tags.map(({ tag }) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="text-xs font-normal"
                    style={{
                      borderColor: tag.color || undefined,
                      color: tag.color || undefined,
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {ticket.description && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Description
              </label>
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>
          )}

          <Separator />

          {/* Customer info card */}
          {ticket.customer && (
            <div className="rounded-lg border p-3 space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">
                Customer
              </h4>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  {ticket.customer.name}
                </div>
                {ticket.customer.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {ticket.customer.email}
                  </div>
                )}
                {ticket.customer.company && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    {ticket.customer.company}
                  </div>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* Messages / Activity tabs */}
          <div>
            <div className="flex items-center gap-1 border-b">
              <button
                onClick={() => setActiveTab("messages")}
                className={cn(
                  "flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                  activeTab === "messages"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Messages
                {ticket.messages.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 rounded-sm px-1.5 text-[10px]">
                    {ticket.messages.length}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={cn(
                  "flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                  activeTab === "activity"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Activity className="h-3.5 w-3.5" />
                Activity
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {activeTab === "messages" ? (
                ticket.messages.length > 0 ? (
                  ticket.messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))
                ) : (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No messages yet
                  </p>
                )
              ) : ticket.activities.length > 0 ? (
                ticket.activities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No activity yet
                </p>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Reply area */}
      <div className="border-t p-4 space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsInternal(!isInternal)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              isInternal
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {isInternal ? (
              <Lock className="h-3 w-3" />
            ) : (
              <Unlock className="h-3 w-3" />
            )}
            {isInternal ? "Internal note" : "Public reply"}
          </button>
        </div>
        <Textarea
          placeholder={
            isInternal
              ? "Add an internal note..."
              : "Type your reply..."
          }
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          className="min-h-[80px] resize-none text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault()
              handleSendReply()
            }
          }}
        />
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">
            Ctrl+Enter to send
          </span>
          <Button
            size="sm"
            onClick={handleSendReply}
            disabled={!replyText.trim() || sending}
          >
            {sending ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="mr-1.5 h-3.5 w-3.5" />
            )}
            {isInternal ? "Add note" : "Send reply"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function TicketDetail({ ticketId }: TicketDetailProps) {
  const { detailPanelOpen, closeDetailPanel } = useUIStore()

  return (
    <AnimatePresence>
      {detailPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 lg:hidden"
            onClick={closeDetailPanel}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-lg border-l bg-background shadow-xl lg:relative lg:z-auto"
          >
            <TicketDetailContent ticketId={ticketId} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
