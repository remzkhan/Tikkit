import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const d = new Date(date)
  const diffMs = now.getTime() - d.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHours = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSec < 60) return "just now"
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function formatSlaTime(deadline: Date | string | null): {
  text: string
  status: "ok" | "warning" | "breached"
  percentage: number
} {
  if (!deadline) return { text: "No SLA", status: "ok", percentage: 0 }
  const now = new Date()
  const dl = new Date(deadline)
  const diffMs = dl.getTime() - now.getTime()
  const diffMin = Math.floor(diffMs / 60000)

  if (diffMs <= 0) {
    return { text: `Breached ${Math.abs(diffMin)}m ago`, status: "breached", percentage: 100 }
  }

  const totalMin = 240 // assume 4h SLA as baseline for percentage
  const elapsed = totalMin - diffMin
  const pct = Math.min(100, Math.max(0, (elapsed / totalMin) * 100))

  if (diffMin < 30) {
    return { text: `${diffMin}m left`, status: "warning", percentage: pct }
  }
  if (diffMin < 60) {
    return { text: `${diffMin}m left`, status: "warning", percentage: pct }
  }
  const hours = Math.floor(diffMin / 60)
  const mins = diffMin % 60
  return { text: `${hours}h ${mins}m left`, status: "ok", percentage: pct }
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + "..."
}

export function generateTicketNumber(): number {
  return Math.floor(Math.random() * 90000) + 10000
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
