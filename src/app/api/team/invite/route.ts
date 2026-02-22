import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orgId } = session.user as { orgId: string }

    const members = await prisma.member.findMany({
      where: { orgId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            status: true,
          },
        },
      },
    })

    return NextResponse.json({ data: members })
  } catch (error) {
    console.error("Error listing team members:", error)
    return NextResponse.json({ error: "Failed to list team members" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orgId, role: currentUserRole } = session.user as {
      orgId: string
      role: string
    }

    // Only OWNER or ADMIN can invite members
    if (currentUserRole !== "OWNER" && currentUserRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Insufficient permissions. Only owners and admins can invite members." },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { email, role } = body

    if (!email || email.trim().length === 0) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const validRoles = ["ADMIN", "AGENT", "VIEWER"]
    const inviteRole = validRoles.includes(role) ? role : "AGENT"

    // Check if user already exists and is already a member
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim() },
    })

    if (existingUser) {
      const existingMember = await prisma.member.findUnique({
        where: {
          userId_orgId: {
            userId: existingUser.id,
            orgId,
          },
        },
      })

      if (existingMember) {
        return NextResponse.json(
          { error: "This user is already a member of your organization" },
          { status: 409 }
        )
      }
    }

    // Check if there's already a pending invite
    const existingInvite = await prisma.invite.findFirst({
      where: {
        orgId,
        email: email.trim(),
        acceptedAt: null,
        expiresAt: { gt: new Date() },
      },
    })

    if (existingInvite) {
      return NextResponse.json(
        { error: "An invitation has already been sent to this email" },
        { status: 409 }
      )
    }

    // Create invite
    const token = randomBytes(32).toString("hex")
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

    const invite = await prisma.invite.create({
      data: {
        orgId,
        email: email.trim(),
        role: inviteRole,
        token,
        expiresAt,
      },
    })

    return NextResponse.json({ data: invite }, { status: 201 })
  } catch (error) {
    console.error("Error inviting team member:", error)
    return NextResponse.json({ error: "Failed to invite team member" }, { status: 500 })
  }
}
