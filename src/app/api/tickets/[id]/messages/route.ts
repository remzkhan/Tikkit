import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orgId } = session.user as { orgId: string }
    const { id: ticketId } = params

    // Verify ticket belongs to org
    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, orgId },
      select: { id: true },
    })

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    const messages = await prisma.message.findMany({
      where: { ticketId },
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
        attachments: true,
      },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json({ data: messages })
  } catch (error) {
    console.error("Error listing messages:", error)
    return NextResponse.json({ error: "Failed to list messages" }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orgId, id: userId } = session.user as { orgId: string; id: string }
    const { id: ticketId } = params
    const body = await req.json()

    const { content, type } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 })
    }

    // Validate message type
    const allowedTypes = ["REPLY", "NOTE"]
    const messageType = allowedTypes.includes(type) ? type : "REPLY"

    // Verify ticket belongs to org
    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, orgId },
      select: { id: true, firstResponseAt: true },
    })

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    const message = await prisma.message.create({
      data: {
        ticketId,
        authorId: userId,
        type: messageType,
        body: content.trim(),
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
        attachments: true,
      },
    })

    // Set first response time if this is the first agent reply
    if (!ticket.firstResponseAt && messageType === "REPLY") {
      await prisma.ticket.update({
        where: { id: ticketId },
        data: { firstResponseAt: new Date() },
      })
    }

    // Update ticket updatedAt timestamp
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { updatedAt: new Date() },
    })

    // Create activity for message
    await prisma.activity.create({
      data: {
        ticketId,
        userId,
        type: messageType === "NOTE" ? "note_added" : "reply_sent",
        data: { messageId: message.id },
      },
    })

    return NextResponse.json({ data: message }, { status: 201 })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
  }
}
