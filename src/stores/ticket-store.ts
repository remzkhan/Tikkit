"use client"

import { create } from "zustand"
import type { TicketListItem, TicketFilters, TicketSort, ViewMode } from "@/types"

interface TicketStore {
  // Ticket data
  tickets: TicketListItem[]
  selectedTicketId: string | null
  selectedTicketIds: Set<string>
  focusedIndex: number

  // View
  viewMode: ViewMode
  filters: TicketFilters
  sort: TicketSort
  searchQuery: string

  // Loading states
  isLoading: boolean
  isRefreshing: boolean

  // Pagination
  page: number
  pageSize: number
  total: number

  // Actions
  setTickets: (tickets: TicketListItem[]) => void
  addTicket: (ticket: TicketListItem) => void
  updateTicket: (id: string, updates: Partial<TicketListItem>) => void
  removeTicket: (id: string) => void

  setSelectedTicketId: (id: string | null) => void
  toggleTicketSelection: (id: string) => void
  selectAllTickets: () => void
  clearSelection: () => void

  setFocusedIndex: (index: number) => void
  moveFocusUp: () => void
  moveFocusDown: () => void

  setViewMode: (mode: ViewMode) => void
  setFilters: (filters: TicketFilters) => void
  setSort: (sort: TicketSort) => void
  setSearchQuery: (query: string) => void

  setLoading: (loading: boolean) => void
  setRefreshing: (refreshing: boolean) => void
  setPage: (page: number) => void
  setTotal: (total: number) => void
}

export const useTicketStore = create<TicketStore>((set, get) => ({
  tickets: [],
  selectedTicketId: null,
  selectedTicketIds: new Set(),
  focusedIndex: 0,

  viewMode: "list",
  filters: {},
  sort: { field: "updatedAt", direction: "desc" },
  searchQuery: "",

  isLoading: true,
  isRefreshing: false,

  page: 1,
  pageSize: 50,
  total: 0,

  setTickets: (tickets) => set({ tickets, isLoading: false }),

  addTicket: (ticket) =>
    set((state) => ({ tickets: [ticket, ...state.tickets] })),

  updateTicket: (id, updates) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),

  removeTicket: (id) =>
    set((state) => ({
      tickets: state.tickets.filter((t) => t.id !== id),
      selectedTicketId:
        state.selectedTicketId === id ? null : state.selectedTicketId,
    })),

  setSelectedTicketId: (id) => set({ selectedTicketId: id }),

  toggleTicketSelection: (id) =>
    set((state) => {
      const next = new Set(state.selectedTicketIds)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { selectedTicketIds: next }
    }),

  selectAllTickets: () =>
    set((state) => ({
      selectedTicketIds: new Set(state.tickets.map((t) => t.id)),
    })),

  clearSelection: () => set({ selectedTicketIds: new Set() }),

  setFocusedIndex: (index) => set({ focusedIndex: index }),

  moveFocusUp: () =>
    set((state) => ({
      focusedIndex: Math.max(0, state.focusedIndex - 1),
    })),

  moveFocusDown: () =>
    set((state) => ({
      focusedIndex: Math.min(state.tickets.length - 1, state.focusedIndex + 1),
    })),

  setViewMode: (mode) => set({ viewMode: mode }),

  setFilters: (filters) => set({ filters, page: 1 }),

  setSort: (sort) => set({ sort }),

  setSearchQuery: (query) => set({ searchQuery: query, page: 1 }),

  setLoading: (loading) => set({ isLoading: loading }),

  setRefreshing: (refreshing) => set({ isRefreshing: refreshing }),

  setPage: (page) => set({ page }),

  setTotal: (total) => set({ total }),
}))
