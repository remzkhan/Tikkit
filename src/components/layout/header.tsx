"use client"

import { usePathname } from "next/navigation"
import { Search, Plus, Bell } from "lucide-react"

import { useUIStore } from "@/stores/ui-store"
import { Button } from "@/components/ui/button"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/tickets": "Tickets",
  "/customers": "Customers",
  "/team": "Team",
  "/reports": "Reports",
  "/settings": "Settings",
}

function getPageTitle(pathname: string): string {
  // Exact match first
  if (pageTitles[pathname]) {
    return pageTitles[pathname]
  }

  // Match by prefix for nested routes (e.g. /tickets/123)
  const segment = "/" + pathname.split("/").filter(Boolean)[0]
  return pageTitles[segment] ?? "Tikkit"
}

export function Header() {
  const pathname = usePathname()
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen)
  const setCreateTicketOpen = useUIStore((s) => s.setCreateTicketOpen)
  const title = getPageTitle(pathname)

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-6">
      {/* Left: Page title */}
      <h1 className="text-lg font-semibold">{title}</h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search / Command palette */}
        <Button
          variant="outline"
          size="sm"
          className="hidden gap-2 text-muted-foreground sm:flex"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="h-4 w-4" />
          <span className="text-sm">Search...</span>
          <kbd className="pointer-events-none ml-2 hidden select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex">
            <span className="text-xs">&#8984;</span>K
          </kbd>
        </Button>

        {/* Mobile search button */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>

        {/* Create ticket */}
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => setCreateTicketOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Ticket</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  )
}
