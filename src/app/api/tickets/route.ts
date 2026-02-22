import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateTicketNumber } from "@/lib/utils"
import type { CreateTicketInput, PaginatedResponse, TicketListItem } from "@/types"
import { Prisma } from "@prisma/client"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orgId } = session.user as { orgId: string }
    const { searchParams } = new URL(req.url)

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "20")))
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const channel = searchParams.get("channel")
    const assigneeId = searchParams.get("assigneeId")
    const search = searchParams.get("search")
    const sortField = searchParams.get("sortField") || "createdAt"
    const sortDir = searchParams.get("sortDir") || "desc"

    // Build where clause
    const where: Prisma.TicketWhereInput = {
      orgId,
    }

    if (status) {
      where.status = { in: status.split(",") as any }
    }

    if (priority) {
      where.priority = { in: priority.split(",") as any }
    }

    if (channel) {
      where.channel = { in: channel.split(",") as any }
    }

    if (assigneeId) {
      where.assigneeId = assigneeId === "unassigned" ? null : assigneeId
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { number: { equals: parseInt(search) || -1 } },
      ]
    }

    // Build orderBy
    const allowedSortFields = ["createdAt", "updatedAt", "priority", "status", "number"]
    const orderField = allowedSortFields.includes(sortField) ? sortField : "createdAt"
    const orderDir = sortDir === "asc" ? "asc" : "desc"
    const orderBy: Prisma.TicketOrderByWithRelationInput = { [orderField]: orderDir }

    const skip = (page - 1) * pageSize

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
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
      }),
      prisma.ticket.count({ where }),
    ])

    const totalPages = Math.ceil(total / pageSize)

    const response: PaginatedResponse<TicketListItem> = {
      data: tickets as unknown as TicketListItem[],
      total,
      page,
      pageSize,
      totalPages,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error listing tickets:", error)
    return NextResponse.json({ error: "Failed to list tickets" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orgId, id: userId } = session.user as { orgId: string; id: string }
    const body: CreateTicketInput = await req.json()

    if (!body.title || body.title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Generate unique ticket number
    const ticketNumber = generateTicketNumber()

    // Handle customer creation/lookup if email provided
    let customerId = body.customerId
    if (!customerId && body.customerEmail) {
      const customer = await prisma.customer.upsert({
        where: {
          orgId_email: {
            orgId,
            email: body.customerEmail,
          },
        },
        update: {
          name: body.customerName || undefined,
        },
        create: {
          orgId,
          email: body.customerEmail,
          name: body.customerName || null,
        },
      })
      customerId = customer.id
    }

    // Create the ticket
    const ticket = await prisma.ticket.create({
      data: {
        number: ticketNumber,
        orgId,
        title: body.title.trim(),
        description: body.description || null,
        priority: (body.priority as any) || "MEDIUM",
        channel: (body.channel as any) || "EMAIL",
        assigneeId: body.assigneeId || null,
        customerId: customerId || null,
        tags: body.tags && body.tags.length > 0
          ? {
              create: body.tags.map((tagId) => ({
                tagId,
              })),
            }
          : undefined,
      },
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

    // Create activity log for ticket creation
    await prisma.activity.create({
      data: {
        ticketId: ticket.id,
        userId,
        type: "ticket_created",
        data: { title: ticket.title },
      },
    })

    return NextResponse.json({ data: ticket }, { status: 201 })
  } catch (error) {
    console.error("Error creating ticket:", error)
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}
