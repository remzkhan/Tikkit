import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orgId } = session.user as { orgId: string }

    const macros = await prisma.macro.findMany({
      where: { orgId },
      orderBy: { name: "asc" },
    })

    return NextResponse.json({ data: macros })
  } catch (error) {
    console.error("Error listing macros:", error)
    return NextResponse.json({ error: "Failed to list macros" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orgId, id: userId } = session.user as { orgId: string; id: string }
    const body = await req.json()

    const { name, content, category } = body

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const macro = await prisma.macro.create({
      data: {
        orgId,
        userId,
        name: name.trim(),
        content: content.trim(),
        actions: category ? { category } : undefined,
        isShared: true,
      },
    })

    return NextResponse.json({ data: macro }, { status: 201 })
  } catch (error) {
    console.error("Error creating macro:", error)
    return NextResponse.json({ error: "Failed to create macro" }, { status: 500 })
  }
}
