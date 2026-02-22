"use client"

import { Badge } from "@/components/ui/badge"
import { PRIORITIES } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface PriorityBadgeProps {
  priority: string
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = PRIORITIES.find((p) => p.value === priority)

  if (!config) {
    return (
      <Badge variant="outline" className={cn("text-xs", className)}>
        {priority}
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium", config.color, className)}
    >
      {config.label}
    </Badge>
  )
}
