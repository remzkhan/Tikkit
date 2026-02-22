"use client"

import { useMemo } from "react"
import { Search, X, Check, ChevronsUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { TICKET_STATUSES, PRIORITIES, CHANNELS } from "@/lib/constants"
import { useTicketStore } from "@/stores/ticket-store"
import { cn } from "@/lib/utils"

function MultiSelectFilter({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string
  options: readonly { value: string; label: string; color?: string }[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 gap-1 border-dashed",
            selected.length > 0 && "border-solid"
          )}
        >
          <ChevronsUpDown className="h-3.5 w-3.5" />
          {label}
          {selected.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 rounded-sm px-1 text-xs font-normal"
            >
              {selected.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.includes(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => onToggle(option.value)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                    {"color" in option && option.color && (
                      <span
                        className={cn(
                          "mr-2 h-2 w-2 shrink-0 rounded-full",
                          option.color
                        )}
                      />
                    )}
                    <span className="text-sm">{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function TicketFilters() {
  const { filters, setFilters, searchQuery, setSearchQuery } = useTicketStore()

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.status?.length) count += filters.status.length
    if (filters.priority?.length) count += filters.priority.length
    if (filters.channel?.length) count += filters.channel.length
    return count
  }, [filters])

  const toggleFilter = (
    key: "status" | "priority" | "channel",
    value: string
  ) => {
    const current = filters[key] || []
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    setFilters({ ...filters, [key]: next.length > 0 ? next : undefined })
  }

  const clearAllFilters = () => {
    setFilters({})
    setSearchQuery("")
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tickets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 w-[200px] pl-8 text-sm lg:w-[280px]"
        />
      </div>

      <MultiSelectFilter
        label="Status"
        options={TICKET_STATUSES}
        selected={filters.status || []}
        onToggle={(value) => toggleFilter("status", value)}
      />

      <MultiSelectFilter
        label="Priority"
        options={PRIORITIES.map((p) => ({
          value: p.value,
          label: p.label,
        }))}
        selected={filters.priority || []}
        onToggle={(value) => toggleFilter("priority", value)}
      />

      <MultiSelectFilter
        label="Channel"
        options={CHANNELS}
        selected={filters.channel || []}
        onToggle={(value) => toggleFilter("channel", value)}
      />

      {activeFilterCount > 0 && (
        <>
          <Badge variant="secondary" className="h-6 gap-1 rounded-sm text-xs">
            {activeFilterCount} active
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-muted-foreground"
            onClick={clearAllFilters}
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Clear all
          </Button>
        </>
      )}
    </div>
  )
}
