"use client"

import { List, Columns3, LayoutGrid, Table2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTicketStore } from "@/stores/ticket-store"
import { cn } from "@/lib/utils"
import type { ViewMode } from "@/types"

const VIEW_MODES: { mode: ViewMode; label: string; icon: React.ElementType }[] = [
  { mode: "list", label: "List", icon: List },
  { mode: "kanban", label: "Kanban", icon: Columns3 },
  { mode: "card", label: "Card", icon: LayoutGrid },
  { mode: "table", label: "Table", icon: Table2 },
]

export function TicketViews() {
  const { viewMode, setViewMode } = useTicketStore()

  return (
    <div className="inline-flex items-center rounded-md border bg-muted p-0.5">
      {VIEW_MODES.map(({ mode, label, icon: Icon }) => (
        <Button
          key={mode}
          variant="ghost"
          size="sm"
          onClick={() => setViewMode(mode)}
          className={cn(
            "h-7 gap-1.5 rounded-sm px-2.5 text-xs font-medium",
            viewMode === mode
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </Button>
      ))}
    </div>
  )
}
