import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { PaginatedResponse } from "@/types"
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
    const search = searchParams.get("search")

    const where: Prisma.CustomerWhereInput = { orgId }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ]
    }

    const skip = (page - 1) * pageSize

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        include: {
          _count: {
            select: { tickets: true },
          },
        },
      }),
      prisma.customer.count({ where }),
    ])

    const totalPages = Math.ceil(total / pageSize)

    const response: PaginatedResponse<typeof customers[number]> = {
      data: customers,
      total,
      page,
      pageSize,
      totalPages,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error listing customers:", error)
    return NextResponse.json({ error: "Failed to list customers" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orgId } = session.user as { orgId: string }
    const body = await req.json()

    const { name, email, company, phone } = body

    if (!email || email.trim().length === 0) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if customer with this email already exists in the org
    const existing = await prisma.customer.findUnique({
      where: {
        orgId_email: {
          orgId,
          email: email.trim(),
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "A customer with this email already exists" },
        { status: 409 }
      )
    }

    const customer = await prisma.customer.create({
      data: {
        orgId,
        email: email.trim(),
        name: name?.trim() || null,
        company: company?.trim() || null,
        phone: phone?.trim() || null,
      },
      include: {
        _count: {
          select: { tickets: true },
        },
      },
    })

    return NextResponse.json({ data: customer }, { status: 201 })
  } catch (error) {
    console.error("Error creating customer:", error)
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}
