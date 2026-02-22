"use client"

import { useEffect, useCallback } from "react"
import { useTicketStore } from "@/stores/ticket-store"
import { useUIStore } from "@/stores/ui-store"
import { TicketList } from "@/components/tickets/ticket-list"
import { TicketFilters } from "@/components/tickets/ticket-filters"
import { TicketViews } from "@/components/tickets/ticket-views"
import { TicketDetail } from "@/components/tickets/ticket-detail"
import { CreateTicketDialog } from "@/components/tickets/create-ticket-dialog"

export default function TicketsPage() {
  const {
    filters,
    sort,
    page,
    pageSize,
    selectedTicketId,
    setTickets,
    setLoading,
    setTotal,
  } = useTicketStore()
  const { detailPanelOpen, createTicketOpen } = useUIStore()

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.set("page", String(page))
      params.set("pageSize", String(pageSize))
      params.set("sortField", sort.field)
      params.set("sortDirection", sort.direction)

      if (filters.search) params.set("search", filters.search)
      if (filters.status?.length) params.set("status", filters.status.join(","))
      if (filters.priority?.length) params.set("priority", filters.priority.join(","))
      if (filters.channel?.length) params.set("channel", filters.channel.join(","))

      const res = await fetch(`/api/tickets?${params}`)
      if (res.ok) {
        const data = await res.json()
        setTickets(data.data || [])
        setTotal(data.total || 0)
      }
    } catch {
      setLoading(false)
    }
  }, [filters, sort, page, pageSize, setTickets, setLoading, setTotal])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  return (
    <div className="flex h-full gap-0">
      <div className="flex flex-1 flex-col min-w-0">
        <div className="mb-4 flex items-center justify-between gap-4">
          <TicketFilters />
          <TicketViews />
        </div>

        <TicketList />
      </div>

      {detailPanelOpen && selectedTicketId && (
        <TicketDetail ticketId={selectedTicketId} />
      )}

      {createTicketOpen && (
        <CreateTicketDialog onCreated={fetchTickets} />
      )}
    </div>
  )
}
