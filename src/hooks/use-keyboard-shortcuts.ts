"use client"

import { useEffect, useCallback } from "react"
import { useTicketStore } from "@/stores/ticket-store"
import { useUIStore } from "@/stores/ui-store"

interface ShortcutHandler {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  handler: () => void
  description: string
  scope?: "global" | "tickets" | "detail"
}

export function useKeyboardShortcuts(scope: "global" | "tickets" | "detail" = "global") {
  const ticketStore = useTicketStore()
  const uiStore = useUIStore()

  const shortcuts: ShortcutHandler[] = [
    // Global shortcuts
    {
      key: "k",
      ctrl: true,
      handler: () => uiStore.setCommandPaletteOpen(true),
      description: "Open command palette",
      scope: "global",
    },
    {
      key: "n",
      ctrl: true,
      handler: () => uiStore.setCreateTicketOpen(true),
      description: "Create new ticket",
      scope: "global",
    },
    {
      key: "/",
      ctrl: true,
      handler: () => {
        const el = document.querySelector<HTMLInputElement>('[data-search-input]')
        el?.focus()
      },
      description: "Focus search",
      scope: "global",
    },
    {
      key: "?",
      handler: () => uiStore.setShortcutsModalOpen(true),
      description: "Show shortcuts",
      scope: "global",
    },

    // Ticket list shortcuts
    {
      key: "j",
      handler: () => ticketStore.moveFocusDown(),
      description: "Next ticket",
      scope: "tickets",
    },
    {
      key: "k",
      handler: () => ticketStore.moveFocusUp(),
      description: "Previous ticket",
      scope: "tickets",
    },
    {
      key: "Enter",
      handler: () => {
        const ticket = ticketStore.tickets[ticketStore.focusedIndex]
        if (ticket) uiStore.openDetailPanel(ticket.id)
      },
      description: "Open ticket",
      scope: "tickets",
    },
    {
      key: "x",
      handler: () => {
        const ticket = ticketStore.tickets[ticketStore.focusedIndex]
        if (ticket) ticketStore.toggleTicketSelection(ticket.id)
      },
      description: "Select ticket",
      scope: "tickets",
    },
    {
      key: "1",
      handler: () => ticketStore.setViewMode("list"),
      description: "List view",
      scope: "tickets",
    },
    {
      key: "2",
      handler: () => ticketStore.setViewMode("kanban"),
      description: "Kanban view",
      scope: "tickets",
    },
    {
      key: "3",
      handler: () => ticketStore.setViewMode("card"),
      description: "Card view",
      scope: "tickets",
    },
    {
      key: "4",
      handler: () => ticketStore.setViewMode("table"),
      description: "Table view",
      scope: "tickets",
    },

    // Detail panel shortcuts
    {
      key: "Escape",
      handler: () => uiStore.closeDetailPanel(),
      description: "Close panel",
      scope: "detail",
    },
    {
      key: "m",
      handler: () => uiStore.setMacroPickerOpen(true),
      description: "Open macros",
      scope: "detail",
    },
  ]

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger in inputs/textareas unless it's a ctrl/meta shortcut
      const target = e.target as HTMLElement
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable
      if (isInput && !e.ctrlKey && !e.metaKey) return

      for (const shortcut of shortcuts) {
        if (shortcut.scope && shortcut.scope !== "global" && shortcut.scope !== scope) continue

        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase() || e.key === shortcut.key
        const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : (!e.ctrlKey && !e.metaKey)
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey
        const altMatch = shortcut.alt ? e.altKey : !e.altKey

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          // For k without ctrl, only in ticket scope (not when command palette shortcut)
          if (shortcut.key === "k" && !shortcut.ctrl && scope !== "tickets") continue

          e.preventDefault()
          shortcut.handler()
          return
        }
      }
    },
    [scope, shortcuts]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])
}

export function useHotkey(
  key: string,
  handler: () => void,
  options?: { ctrl?: boolean; shift?: boolean; enabled?: boolean }
) {
  useEffect(() => {
    if (options?.enabled === false) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable
      if (isInput && !options?.ctrl) return

      const keyMatch = e.key.toLowerCase() === key.toLowerCase()
      const ctrlMatch = options?.ctrl ? (e.ctrlKey || e.metaKey) : true
      const shiftMatch = options?.shift ? e.shiftKey : true

      if (keyMatch && ctrlMatch && shiftMatch) {
        e.preventDefault()
        handler()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [key, handler, options?.ctrl, options?.shift, options?.enabled])
}
