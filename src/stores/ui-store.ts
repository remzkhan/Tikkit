"use client"

import { create } from "zustand"

interface UIStore {
  // Sidebar
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void

  // Command palette
  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void

  // Keyboard shortcuts modal
  shortcutsModalOpen: boolean
  setShortcutsModalOpen: (open: boolean) => void

  // Ticket detail panel
  detailPanelOpen: boolean
  detailPanelTicketId: string | null
  openDetailPanel: (ticketId: string) => void
  closeDetailPanel: () => void

  // Create ticket dialog
  createTicketOpen: boolean
  setCreateTicketOpen: (open: boolean) => void

  // Macro picker
  macroPickerOpen: boolean
  setMacroPickerOpen: (open: boolean) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void
  dismissNotification: (id: string) => void
}

interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message?: string
  timestamp: number
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  shortcutsModalOpen: false,
  setShortcutsModalOpen: (open) => set({ shortcutsModalOpen: open }),

  detailPanelOpen: false,
  detailPanelTicketId: null,
  openDetailPanel: (ticketId) =>
    set({ detailPanelOpen: true, detailPanelTicketId: ticketId }),
  closeDetailPanel: () =>
    set({ detailPanelOpen: false, detailPanelTicketId: null }),

  createTicketOpen: false,
  setCreateTicketOpen: (open) => set({ createTicketOpen: open }),

  macroPickerOpen: false,
  setMacroPickerOpen: (open) => set({ macroPickerOpen: open }),

  notifications: [],
  addNotification: (notification) =>
    set((s) => ({
      notifications: [
        ...s.notifications,
        {
          ...notification,
          id: Math.random().toString(36).slice(2),
          timestamp: Date.now(),
        },
      ],
    })),
  dismissNotification: (id) =>
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    })),
}))
