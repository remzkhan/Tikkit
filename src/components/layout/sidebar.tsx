"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import {
  LayoutDashboard,
  Ticket,
  Users,
  UsersRound,
  BarChart3,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Moon,
  Sun,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useUIStore } from "@/stores/ui-store"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Tickets", icon: Ticket, href: "/tickets" },
  { label: "Customers", icon: Users, href: "/customers" },
  { label: "Team", icon: UsersRound, href: "/team" },
  { label: "Reports", icon: BarChart3, href: "/reports" },
  { label: "Settings", icon: Settings, href: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)

  const user = session?.user
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-screen flex-col border-r bg-background transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        {/* Workspace header */}
        <div className="flex h-14 items-center border-b px-3">
          <div
            className={cn(
              "flex items-center gap-2 overflow-hidden",
              sidebarCollapsed ? "justify-center" : "px-1"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
              T
            </div>
            {!sidebarCollapsed && (
              <span className="truncate text-sm font-semibold">Tikkit</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-2">
          <nav className="flex flex-col gap-1 px-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(item.href + "/"))

              const linkContent = (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                    sidebarCollapsed && "justify-center px-2"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              )

              if (sidebarCollapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                )
              }

              return <React.Fragment key={item.href}>{linkContent}</React.Fragment>
            })}
          </nav>
        </ScrollArea>

        <Separator />

        {/* Bottom section */}
        <div className="flex flex-col gap-1 p-2">
          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={sidebarCollapsed ? "icon" : "sm"}
                className={cn(
                  "w-full",
                  sidebarCollapsed ? "justify-center" : "justify-start gap-3 px-3"
                )}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-4 w-4 shrink-0 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 shrink-0 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
                {!sidebarCollapsed && (
                  <span className="truncate">Toggle theme</span>
                )}
              </Button>
            </TooltipTrigger>
            {sidebarCollapsed && (
              <TooltipContent side="right">Toggle theme</TooltipContent>
            )}
          </Tooltip>

          {/* Collapse toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={sidebarCollapsed ? "icon" : "sm"}
                className={cn(
                  "w-full",
                  sidebarCollapsed ? "justify-center" : "justify-start gap-3 px-3"
                )}
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? (
                  <ChevronsRight className="h-4 w-4 shrink-0" />
                ) : (
                  <ChevronsLeft className="h-4 w-4 shrink-0" />
                )}
                {!sidebarCollapsed && (
                  <span className="truncate">Collapse</span>
                )}
              </Button>
            </TooltipTrigger>
            {sidebarCollapsed && (
              <TooltipContent side="right">
                Expand sidebar
              </TooltipContent>
            )}
          </Tooltip>

          <Separator />

          {/* User info */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2",
                  sidebarCollapsed && "justify-center px-2"
                )}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage
                    src={user?.image ?? undefined}
                    alt={user?.name ?? "User"}
                  />
                  <AvatarFallback className="text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {!sidebarCollapsed && (
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-medium">
                      {user?.name ?? "User"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email ?? ""}
                    </span>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            {sidebarCollapsed && (
              <TooltipContent side="right">
                {user?.name ?? "User"}
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  )
}
