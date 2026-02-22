export const TICKET_STATUSES = [
  { value: "OPEN", label: "Open", color: "bg-blue-500" },
  { value: "IN_PROGRESS", label: "In Progress", color: "bg-yellow-500" },
  { value: "PENDING", label: "Pending", color: "bg-orange-500" },
  { value: "ON_HOLD", label: "On Hold", color: "bg-gray-500" },
  { value: "RESOLVED", label: "Resolved", color: "bg-green-500" },
  { value: "CLOSED", label: "Closed", color: "bg-gray-400" },
] as const

export const PRIORITIES = [
  { value: "URGENT", label: "Urgent", color: "text-red-600 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800" },
  { value: "HIGH", label: "High", color: "text-orange-600 bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800" },
  { value: "MEDIUM", label: "Medium", color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800" },
  { value: "LOW", label: "Low", color: "text-green-600 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800" },
] as const

export const CHANNELS = [
  { value: "EMAIL", label: "Email", icon: "Mail" },
  { value: "SLACK", label: "Slack", icon: "Hash" },
  { value: "TEAMS", label: "Teams", icon: "Users" },
  { value: "WHATSAPP", label: "WhatsApp", icon: "MessageCircle" },
  { value: "CHAT", label: "Chat", icon: "MessagesSquare" },
  { value: "API", label: "API", icon: "Code" },
  { value: "PHONE", label: "Phone", icon: "Phone" },
] as const

export const ROLES = [
  { value: "OWNER", label: "Owner" },
  { value: "ADMIN", label: "Admin" },
  { value: "AGENT", label: "Agent" },
  { value: "VIEWER", label: "Viewer" },
] as const

export const PLANS = [
  {
    name: "Free",
    value: "FREE",
    price: { monthly: 0, annual: 0 },
    seats: 3,
    features: ["Up to 3 agents", "Email channel", "Basic reporting", "Community support"],
  },
  {
    name: "Pro",
    value: "PRO",
    price: { monthly: 29, annual: 24 },
    seats: 10,
    features: ["Up to 10 agents", "All channels", "SLA management", "Macros & automations", "Priority support"],
    popular: true,
  },
  {
    name: "Business",
    value: "BUSINESS",
    price: { monthly: 59, annual: 49 },
    seats: 50,
    features: ["Up to 50 agents", "All channels", "Advanced SLA", "AI-powered features", "Custom fields", "API access", "Dedicated support"],
  },
  {
    name: "Enterprise",
    value: "ENTERPRISE",
    price: { monthly: 99, annual: 84 },
    seats: 999,
    features: ["Unlimited agents", "All features", "Custom integrations", "SSO & SAML", "Audit logs", "SLA guarantee", "24/7 premium support"],
  },
] as const

export const INTEGRATIONS = [
  {
    id: "slack",
    name: "Slack",
    description: "Receive and respond to tickets directly from Slack channels and DMs",
    category: "messaging",
    icon: "/integrations/slack.svg",
    features: ["Bidirectional sync", "Thread tracking", "Channel-native replies", "Auto-create tickets"],
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Connect Teams channels to your support queue for seamless collaboration",
    category: "messaging",
    icon: "/integrations/teams.svg",
    features: ["Channel integration", "Adaptive cards", "Bot commands", "Tab app"],
  },
  {
    id: "email",
    name: "Email",
    description: "Convert emails into tickets with full thread tracking and auto-replies",
    category: "messaging",
    icon: "/integrations/email.svg",
    features: ["Inbound parsing", "Thread detection", "Custom templates", "DKIM/SPF support"],
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Support customers on WhatsApp with rich messaging and media support",
    category: "messaging",
    icon: "/integrations/whatsapp.svg",
    features: ["Two-way messaging", "Media support", "Message templates", "Business API"],
  },
  {
    id: "jira",
    name: "Jira",
    description: "Link tickets to Jira issues for engineering handoff and tracking",
    category: "engineering",
    icon: "/integrations/jira.svg",
    features: ["Issue linking", "Status sync", "Bidirectional updates", "Custom field mapping"],
  },
  {
    id: "linear",
    name: "Linear",
    description: "Create and track Linear issues directly from support tickets",
    category: "engineering",
    icon: "/integrations/linear.svg",
    features: ["Issue creation", "Status sync", "Priority mapping", "Label sync"],
  },
  {
    id: "github",
    name: "GitHub",
    description: "Link GitHub issues and PRs to support tickets for dev collaboration",
    category: "engineering",
    icon: "/integrations/github.svg",
    features: ["Issue linking", "PR tracking", "Commit references", "Webhook events"],
  },
  {
    id: "zoom",
    name: "Zoom",
    description: "Schedule and launch Zoom meetings directly from ticket conversations",
    category: "meetings",
    icon: "/integrations/zoom.svg",
    features: ["One-click meetings", "Calendar sync", "Recording links", "Meeting notes"],
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Schedule follow-ups and customer calls with Google Calendar integration",
    category: "meetings",
    icon: "/integrations/gcal.svg",
    features: ["Event creation", "Availability check", "Reminders", "Calendar sync"],
  },
  {
    id: "pagerduty",
    name: "PagerDuty",
    description: "Escalate critical tickets to on-call engineers via PagerDuty",
    category: "alerting",
    icon: "/integrations/pagerduty.svg",
    features: ["Incident creation", "On-call lookup", "Escalation policies", "Status sync"],
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Sync customer data and ticket history with Salesforce CRM",
    category: "crm",
    icon: "/integrations/salesforce.svg",
    features: ["Contact sync", "Case creation", "Account mapping", "Custom objects"],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Connect HubSpot CRM for customer context and lifecycle tracking",
    category: "crm",
    icon: "/integrations/hubspot.svg",
    features: ["Contact sync", "Deal tracking", "Timeline events", "Custom properties"],
  },
] as const

export const KEYBOARD_SHORTCUTS = {
  global: [
    { keys: ["Ctrl", "K"], action: "Open command palette", id: "command-palette" },
    { keys: ["Ctrl", "N"], action: "Create new ticket", id: "new-ticket" },
    { keys: ["Ctrl", "/"], action: "Search", id: "search" },
    { keys: ["?"], action: "Show keyboard shortcuts", id: "show-shortcuts" },
  ],
  ticketList: [
    { keys: ["J"], action: "Next ticket", id: "next-ticket" },
    { keys: ["K"], action: "Previous ticket", id: "prev-ticket" },
    { keys: ["Enter"], action: "Open ticket", id: "open-ticket" },
    { keys: ["X"], action: "Select ticket", id: "select-ticket" },
    { keys: ["E"], action: "Resolve ticket", id: "resolve-ticket" },
    { keys: ["A"], action: "Assign to me", id: "assign-me" },
    { keys: ["S"], action: "Snooze ticket", id: "snooze-ticket" },
    { keys: ["L"], action: "Add label", id: "add-label" },
    { keys: ["P"], action: "Change priority", id: "change-priority" },
    { keys: ["1"], action: "List view", id: "view-list" },
    { keys: ["2"], action: "Kanban view", id: "view-kanban" },
    { keys: ["3"], action: "Card view", id: "view-card" },
    { keys: ["4"], action: "Table view", id: "view-table" },
  ],
  ticketDetail: [
    { keys: ["R"], action: "Reply", id: "reply" },
    { keys: ["N"], action: "Internal note", id: "internal-note" },
    { keys: ["M"], action: "Open macros", id: "open-macros" },
    { keys: ["Ctrl", "Enter"], action: "Send reply", id: "send-reply" },
    { keys: ["Esc"], action: "Close panel", id: "close-panel" },
  ],
} as const
