import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { UpdateTicketInput } from "@/types"

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
    const { id } = params

    const ticket = await prisma.ticket.findFirst({
      where: { id, orgId },
      include: {
        assignee: true,
        customer: true,
        tags: {
          include: {
            tag: true,
          },
        },
        messages: {
          include: {
            author: true,
            attachments: true,
          },
          orderBy: { createdAt: "asc" },
        },
        activities: {
          include: {
            user: true,
          },
          orderBy: { createdAt: "desc" },
        },
        attachments: true,
        linkedIssues: true,
        customFields: {
          include: {
            field: true,
          },
        },
        watchers: {
          include: {
            user: true,
          },
        },
        slaPolicy: true,
      },
    })

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    return NextResponse.json({ data: ticket })
  } catch (error) {
    console.error("Error fetching ticket:", error)
    return NextResponse.json({ error: "Failed to fetch ticket" }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orgId, id: userId } = session.user as { orgId: string; id: string }
    const { id } = params
    const body: UpdateTicketInput = await req.json()

    // Verify ticket belongs to org
    const existingTicket = await prisma.ticket.findFirst({
      where: { id, orgId },
    })

    if (!existingTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    // Build update data
    const updateData: Record<string, unknown> = {}
    const activities: { type: string; data: Record<string, unknown> }[] = []

    if (body.title !== undefined) {
      updateData.title = body.title
      activities.push({
        type: "title_changed",
        data: { from: existingTicket.title, to: body.title },
      })
    }

    if (body.description !== undefined) {
      updateData.description = body.description
      activities.push({
        type: "description_changed",
        data: {},
      })
    }

    if (body.status !== undefined) {
      updateData.status = body.status
      activities.push({
        type: "status_changed",
        data: { from: existingTicket.status, to: body.status },
      })
      if (body.status === "RESOLVED" || body.status === "CLOSED") {
        updateData.resolvedAt = new Date()
      }
    }

    if (body.priority !== undefined) {
      updateData.priority = body.priority
      activities.push({
        type: "priority_changed",
        data: { from: existingTicket.priority, to: body.priority },
      })
    }

    if (body.assigneeId !== undefined) {
      updateData.assigneeId = body.assigneeId
      activities.push({
        type: "assignee_changed",
        data: { from: existingTicket.assigneeId, to: body.assigneeId },
      })
    }

    if (body.snoozeUntil !== undefined) {
      updateData.snoozeUntil = body.snoozeUntil ? new Date(body.snoozeUntil) : null
      activities.push({
        type: body.snoozeUntil ? "snoozed" : "unsnoozed",
        data: { until: body.snoozeUntil },
      })
    }

    // Handle tags update
    if (body.tags !== undefined) {
      // Remove existing tags and add new ones
      await prisma.ticketTag.deleteMany({ where: { ticketId: id } })
      if (body.tags.length > 0) {
        await prisma.ticketTag.createMany({
          data: body.tags.map((tagId) => ({
            ticketId: id,
            tagId,
          })),
        })
      }
      activities.push({
        type: "tags_changed",
        data: { tags: body.tags },
      })
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: updateData,
      include: {
        assignee: {
          select: { id: true, name: true, avatar: true, email: true },
        },
        customer: {
          select: { id: true, name: true, email: true, company: true },
        },
        tags: {
          include: {
            tag: {
              select: { id: true, name: true, color: true },
            },
          },
        },
        _count: {
          select: { messages: true },
        },
      },
    })

    // Create activity records
    if (activities.length > 0) {
      await prisma.activity.createMany({
        data: activities.map((activity) => ({
          ticketId: id,
          userId,
          type: activity.type,
          data: activity.data,
        })),
      })
    }

    return NextResponse.json({ data: ticket })
  } catch (error) {
    console.error("Error updating ticket:", error)
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orgId, role } = session.user as { orgId: string; role: string }
    const { id } = params

    // Only OWNER or ADMIN can delete tickets
    if (role !== "OWNER" && role !== "ADMIN") {
      return NextResponse.json(
        { error: "Insufficient permissions. Only owners and admins can delete tickets." },
        { status: 403 }
      )
    }

    // Verify ticket belongs to org
    const ticket = await prisma.ticket.findFirst({
      where: { id, orgId },
    })

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    await prisma.ticket.delete({ where: { id } })

    return NextResponse.json({ message: "Ticket deleted successfully" })
  } catch (error) {
    console.error("Error deleting ticket:", error)
    return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 })
  }
}
