"use client"

import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatSlaTime } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface SlaBadgeProps {
  slaDeadline: Date | string | null
  className?: string
}

const statusStyles = {
  ok: "text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800",
  warning:
    "text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950 dark:border-yellow-800",
  breached:
    "text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800",
} as const

export function SlaBadge({ slaDeadline, className }: SlaBadgeProps) {
  const sla = formatSlaTime(slaDeadline)

  if (!slaDeadline) {
    return null
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        statusStyles[sla.status],
        className
      )}
    >
      <Clock className="h-3 w-3" />
      {sla.text}
    </Badge>
  )
}
