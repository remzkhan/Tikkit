"use client"

import { Badge } from "@/components/ui/badge"
import { TICKET_STATUSES } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = TICKET_STATUSES.find((s) => s.value === status)

  if (!config) {
    return (
      <Badge variant="secondary" className={cn("text-xs", className)}>
        <span className="mr-1.5 h-2 w-2 rounded-full bg-gray-400" />
        {status}
      </Badge>
    )
  }

  return (
    <Badge
      variant="secondary"
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        className
      )}
    >
      <span className={cn("h-2 w-2 shrink-0 rounded-full", config.color)} />
      {config.label}
    </Badge>
  )
}
