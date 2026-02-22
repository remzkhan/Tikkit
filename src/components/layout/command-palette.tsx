"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  LayoutDashboard,
  Ticket,
  Users,
  UsersRound,
  BarChart3,
  Settings,
  Plus,
  Search,
  Sun,
  Moon,
  Keyboard,
} from "lucide-react"

import { useUIStore } from "@/stores/ui-store"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export function CommandPalette() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const open = useUIStore((s) => s.commandPaletteOpen)
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen)
  const setCreateTicketOpen = useUIStore((s) => s.setCreateTicketOpen)
  const setShortcutsModalOpen = useUIStore((s) => s.setShortcutsModalOpen)

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/dashboard"))}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/tickets"))}
          >
            <Ticket className="mr-2 h-4 w-4" />
            Tickets
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/customers"))}
          >
            <Users className="mr-2 h-4 w-4" />
            Customers
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/team"))}
          >
            <UsersRound className="mr-2 h-4 w-4" />
            Team
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/reports"))}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Reports
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/settings"))}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Actions */}
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() =>
              runCommand(() => setCreateTicketOpen(true))
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/tickets?focus=search"))}
          >
            <Search className="mr-2 h-4 w-4" />
            Search Tickets
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Settings */}
        <CommandGroup heading="Settings">
          <CommandItem
            onSelect={() =>
              runCommand(() =>
                setTheme(theme === "dark" ? "light" : "dark")
              )
            }
          >
            <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute ml-0 h-4 w-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
            <span className="ml-6">Toggle Theme</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => setShortcutsModalOpen(true))
            }
          >
            <Keyboard className="mr-2 h-4 w-4" />
            Keyboard Shortcuts
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
