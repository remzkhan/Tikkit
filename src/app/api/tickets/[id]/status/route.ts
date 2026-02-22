import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
    const body = await req.json()

    const { status } = body

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const validStatuses = ["OPEN", "IN_PROGRESS", "PENDING", "ON_HOLD", "RESOLVED", "CLOSED"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      )
    }

    // Verify ticket belongs to org
    const existingTicket = await prisma.ticket.findFirst({
      where: { id, orgId },
      select: { id: true, status: true },
    })

    if (!existingTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    // Build update data
    const updateData: Record<string, unknown> = { status }

    // Set resolvedAt if status is RESOLVED or CLOSED
    if (status === "RESOLVED" || status === "CLOSED") {
      updateData.resolvedAt = new Date()
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

    // Create activity record
    await prisma.activity.create({
      data: {
        ticketId: id,
        userId,
        type: "status_changed",
        data: {
          from: existingTicket.status,
          to: status,
        },
      },
    })

    return NextResponse.json({ data: ticket })
  } catch (error) {
    console.error("Error updating ticket status:", error)
    return NextResponse.json({ error: "Failed to update ticket status" }, { status: 500 })
  }
}
