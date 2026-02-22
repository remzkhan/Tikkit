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

    const { assigneeId } = body

    // Verify ticket belongs to org
    const existingTicket = await prisma.ticket.findFirst({
      where: { id, orgId },
      select: { id: true, assigneeId: true },
    })

    if (!existingTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    // If assigning (not unassigning), verify assignee is a member of the org
    if (assigneeId) {
      const member = await prisma.member.findFirst({
        where: {
          userId: assigneeId,
          orgId,
        },
      })

      if (!member) {
        return NextResponse.json(
          { error: "Assignee is not a member of this organization" },
          { status: 400 }
        )
      }
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: { assigneeId: assigneeId || null },
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
        type: "assignee_changed",
        data: {
          from: existingTicket.assigneeId,
          to: assigneeId || null,
        },
      },
    })

    return NextResponse.json({ data: ticket })
  } catch (error) {
    console.error("Error assigning ticket:", error)
    return NextResponse.json({ error: "Failed to assign ticket" }, { status: 500 })
  }
}
