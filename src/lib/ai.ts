import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface AISuggestion {
  reply: string
  confidence: number
  tone: string
}

export interface AICategorizationResult {
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW"
  category: string
  tags: string[]
  sentiment: "positive" | "neutral" | "negative" | "frustrated"
  summary: string
}

export interface AIRoutingResult {
  suggestedAssignee: string | null
  reason: string
  skills: string[]
}

export async function suggestReply(
  ticketTitle: string,
  conversationHistory: { role: string; content: string }[],
  customerName: string,
  orgContext?: string
): Promise<AISuggestion> {
  const historyText = conversationHistory
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n")

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: `You are a helpful customer support AI assistant. Generate a professional, empathetic reply to help resolve the customer's issue. Be concise but thorough.${orgContext ? ` Context about the organization: ${orgContext}` : ""}`,
    messages: [
      {
        role: "user",
        content: `Ticket: "${ticketTitle}"
Customer: ${customerName}

Conversation so far:
${historyText}

Generate a helpful reply to the customer. Return JSON with:
- reply: the suggested reply text
- confidence: 0-1 score of how confident you are this reply is appropriate
- tone: "professional" | "empathetic" | "technical" | "casual"`,
      },
    ],
  })

  const text = response.content[0].type === "text" ? response.content[0].text : ""
  try {
    return JSON.parse(text)
  } catch {
    return { reply: text, confidence: 0.7, tone: "professional" }
  }
}

export async function categorizeTicket(
  title: string,
  description: string
): Promise<AICategorizationResult> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    system: "You are a ticket categorization system. Analyze support tickets and return structured categorization data as JSON.",
    messages: [
      {
        role: "user",
        content: `Categorize this support ticket:

Title: ${title}
Description: ${description}

Return JSON with:
- priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW"
- category: a short category label (e.g., "billing", "technical", "feature-request", "bug-report", "account")
- tags: array of relevant tag strings
- sentiment: "positive" | "neutral" | "negative" | "frustrated"
- summary: one-sentence summary of the issue`,
      },
    ],
  })

  const text = response.content[0].type === "text" ? response.content[0].text : ""
  try {
    return JSON.parse(text)
  } catch {
    return {
      priority: "MEDIUM",
      category: "general",
      tags: [],
      sentiment: "neutral",
      summary: title,
    }
  }
}

export async function summarizeConversation(
  messages: { role: string; content: string; timestamp: string }[]
): Promise<string> {
  const historyText = messages
    .map((m) => `[${m.timestamp}] ${m.role}: ${m.content}`)
    .join("\n")

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 256,
    system: "You are a conversation summarizer. Create brief, actionable summaries of support conversations.",
    messages: [
      {
        role: "user",
        content: `Summarize this support conversation in 2-3 sentences. Focus on: the customer's issue, steps taken so far, and current status.

${historyText}`,
      },
    ],
  })

  return response.content[0].type === "text" ? response.content[0].text : ""
}

export async function searchKnowledgeBase(
  query: string,
  articles: { title: string; content: string }[]
): Promise<{ articleIndex: number; relevance: number; excerpt: string }[]> {
  if (articles.length === 0) return []

  const articlesText = articles
    .map((a, i) => `[${i}] Title: ${a.title}\nContent: ${a.content.slice(0, 500)}`)
    .join("\n\n")

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    system: "You are a knowledge base search system. Find the most relevant articles for a support query. Return JSON array.",
    messages: [
      {
        role: "user",
        content: `Query: "${query}"

Articles:
${articlesText}

Return a JSON array of the most relevant articles (max 3):
[{ "articleIndex": number, "relevance": 0-1, "excerpt": "relevant excerpt from article" }]`,
      },
    ],
  })

  const text = response.content[0].type === "text" ? response.content[0].text : ""
  try {
    return JSON.parse(text)
  } catch {
    return []
  }
}
