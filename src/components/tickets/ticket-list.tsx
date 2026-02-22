"use client"

import { Inbox } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PriorityBadge } from "@/components/tickets/priority-badge"
import { StatusBadge } from "@/components/tickets/status-badge"
import { SlaBadge } from "@/components/tickets/sla-badge"
import { useTicketStore } from "@/stores/ticket-store"
import { useUIStore } from "@/stores/ui-store"
import { cn, formatRelativeTime, getInitials, truncate } from "@/lib/utils"
import type { TicketListItem } from "@/types"

function TicketRow({ ticket }: { ticket: TicketListItem }) {
  const { selectedTicketId, selectedTicketIds, setSelectedTicketId, toggleTicketSelection } =
    useTicketStore()
  const { openDetailPanel, detailPanelTicketId } = useUIStore()

  const isSelected = selectedTicketIds.has(ticket.id)
  const isActive = detailPanelTicketId === ticket.id

  const handleRowClick = () => {
    setSelectedTicketId(ticket.id)
    openDetailPanel(ticket.id)
  }

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleTicketSelection(ticket.id)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleRowClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleRowClick()
        }
      }}
      className={cn(
        "group flex items-center gap-3 border-b px-4 py-3 transition-colors hover:bg-muted/50",
        isActive && "bg-muted/80 border-l-2 border-l-primary",
        isSelected && "bg-primary/5"
      )}
    >
      {/* Checkbox */}
      <div onClick={handleCheckboxChange} className="shrink-0">
        <Checkbox
          checked={isSelected}
          className="opacity-0 group-hover:opacity-100 data-[state=checked]:opacity-100 transition-opacity"
        />
      </div>

      {/* Priority badge */}
      <div className="shrink-0">
        <PriorityBadge priority={ticket.priority} />
      </div>

      {/* Ticket number + title */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-xs font-mono text-muted-foreground">
            #{ticket.number}
          </span>
          <span className="truncate text-sm font-medium">
            {truncate(ticket.title, 80)}
          </span>
        </div>
        {/* Customer name below title */}
        {ticket.customer && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {ticket.customer.name}
            {ticket.customer.company && (
              <span className="ml-1 text-muted-foreground/60">
                - {ticket.customer.company}
              </span>
            )}
          </p>
        )}
      </div>

      {/* Tags */}
      <div className="hidden shrink-0 items-center gap-1 md:flex">
        {ticket.tags.slice(0, 2).map(({ tag }) => (
          <Badge
            key={tag.id}
            variant="outline"
            className="h-5 rounded-sm px-1.5 text-[10px] font-normal"
            style={{
              borderColor: tag.color || undefined,
              color: tag.color || undefined,
            }}
          >
            {tag.name}
          </Badge>
        ))}
        {ticket.tags.length > 2 && (
          <span className="text-[10px] text-muted-foreground">
            +{ticket.tags.length - 2}
          </span>
        )}
      </div>

      {/* Status badge */}
      <div className="hidden shrink-0 lg:block">
        <StatusBadge status={ticket.status} />
      </div>

      {/* SLA badge */}
      <div className="hidden shrink-0 xl:block">
        <SlaBadge slaDeadline={ticket.slaDeadline} />
      </div>

      {/* Assignee avatar */}
      <div className="shrink-0">
        {ticket.assignee ? (
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={ticket.assignee.avatar || undefined}
              alt={ticket.assignee.name || ""}
            />
            <AvatarFallback className="text-[10px]">
              {getInitials(ticket.assignee.name || ticket.assignee.email)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-6 w-6 rounded-full border-2 border-dashed border-muted-foreground/30" />
        )}
      </div>

      {/* Relative time */}
      <span className="shrink-0 text-xs text-muted-foreground w-14 text-right">
        {formatRelativeTime(ticket.updatedAt)}
      </span>
    </div>
  )
}

export function TicketList() {
  const { tickets, isLoading } = useTicketStore()

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border-b px-4 py-3"
          >
            <div className="h-4 w-4 rounded-sm bg-muted animate-pulse" />
            <div className="h-5 w-14 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
              <div className="h-3 w-1/3 rounded bg-muted animate-pulse" />
            </div>
            <div className="h-6 w-6 rounded-full bg-muted animate-pulse" />
            <div className="h-3 w-12 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Inbox className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No tickets found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          There are no tickets matching your current filters. Try adjusting
          your search or filters.
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1">
      <div className="divide-y">
        {tickets.map((ticket) => (
          <TicketRow key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </ScrollArea>
  )
}
