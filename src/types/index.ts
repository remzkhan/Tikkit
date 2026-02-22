import type {
  Ticket,
  User,
  Organization,
  Message,
  Customer,
  Tag,
  Member,
  Macro,
  SlaPolicy,
  Activity,
  Attachment,
  LinkedIssue,
  SavedView,
  Integration,
  CustomFieldDef,
  CustomFieldValue,
  AutomationRule,
  Invite,
  Billing,
  KnowledgeArticle,
  AgentPresence,
} from "@prisma/client"

// Re-export Prisma types
export type {
  Ticket,
  User,
  Organization,
  Message,
  Customer,
  Tag,
  Member,
  Macro,
  SlaPolicy,
  Activity,
  Attachment,
  LinkedIssue,
  SavedView,
  Integration,
  CustomFieldDef,
  CustomFieldValue,
  AutomationRule,
  Invite,
  Billing,
  KnowledgeArticle,
  AgentPresence,
}

// ─── Extended Types (with relations) ────────────────────────────────────────────

export type TicketWithRelations = Ticket & {
  assignee: User | null
  customer: Customer | null
  tags: { tag: Tag }[]
  messages: (Message & { author: User | null })[]
  activities: (Activity & { user: User | null })[]
  attachments: Attachment[]
  linkedIssues: LinkedIssue[]
  customFields: (CustomFieldValue & { field: CustomFieldDef })[]
  watchers: { user: User }[]
  slaPolicy: SlaPolicy | null
  _count?: { messages: number }
}

export type TicketListItem = Ticket & {
  assignee: Pick<User, "id" | "name" | "avatar" | "email"> | null
  customer: Pick<Customer, "id" | "name" | "email" | "company"> | null
  tags: { tag: Pick<Tag, "id" | "name" | "color"> }[]
  _count: { messages: number }
}

export type MemberWithUser = Member & {
  user: Pick<User, "id" | "name" | "email" | "avatar" | "status">
}

export type MessageWithAuthor = Message & {
  author: Pick<User, "id" | "name" | "avatar"> | null
  attachments: Attachment[]
}

// ─── Session Types ──────────────────────────────────────────────────────────────

export interface SessionUser {
  id: string
  name: string
  email: string
  image?: string | null
  orgId: string
  orgName: string
  role: string
}

// ─── API Types ──────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface TicketFilters {
  status?: string[]
  priority?: string[]
  channel?: string[]
  assigneeId?: string | null
  tags?: string[]
  search?: string
  dateFrom?: string
  dateTo?: string
  slaBreached?: boolean
}

export interface TicketSort {
  field: "createdAt" | "updatedAt" | "priority" | "status" | "number"
  direction: "asc" | "desc"
}

export interface CreateTicketInput {
  title: string
  description?: string
  priority?: string
  channel?: string
  assigneeId?: string
  customerId?: string
  customerEmail?: string
  customerName?: string
  tags?: string[]
}

export interface UpdateTicketInput {
  title?: string
  description?: string
  status?: string
  priority?: string
  assigneeId?: string | null
  snoozeUntil?: string | null
  tags?: string[]
}

// ─── Real-time Types ────────────────────────────────────────────────────────────

export interface PresenceInfo {
  userId: string
  userName: string
  userAvatar?: string | null
  ticketId: string
  action: "viewing" | "typing" | "editing"
  updatedAt: string
}

export interface TicketEvent {
  type: "created" | "updated" | "deleted" | "message" | "assigned" | "status_changed"
  ticketId: string
  data: Record<string, unknown>
  userId: string
  timestamp: string
}

// ─── View Types ─────────────────────────────────────────────────────────────────

export type ViewMode = "list" | "kanban" | "card" | "table"

export interface KanbanColumn {
  id: string
  title: string
  tickets: TicketListItem[]
  color: string
}

// ─── Integration Types ──────────────────────────────────────────────────────────

export interface SlackWebhookPayload {
  type: string
  event?: {
    type: string
    text: string
    user: string
    channel: string
    ts: string
    thread_ts?: string
  }
  challenge?: string
}

export interface EmailWebhookPayload {
  from: string
  to: string
  subject: string
  text: string
  html?: string
  messageId: string
  inReplyTo?: string
  attachments?: { filename: string; content: string; mimeType: string }[]
}
