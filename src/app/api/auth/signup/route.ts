import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/utils"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, name, orgName } = body

    if (!email || !password || !name || !orgName) {
      return NextResponse.json(
        { error: "Email, password, name, and organization name are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      )
    }

    // Hash the password
    const passwordHash = await hash(password, 12)

    // Create org slug and ensure uniqueness
    let slug = slugify(orgName)
    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
    })
    if (existingOrg) {
      slug = `${slug}-${Date.now()}`
    }

    // Create organization, user, and membership in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the organization
      const org = await tx.organization.create({
        data: {
          name: orgName,
          slug,
        },
      })

      // Create the user
      const user = await tx.user.create({
        data: {
          email,
          name,
          passwordHash,
        },
      })

      // Create member with OWNER role
      await tx.member.create({
        data: {
          userId: user.id,
          orgId: org.id,
          role: "OWNER",
        },
      })

      // Create default SLA policies for the org
      await tx.slaPolicy.createMany({
        data: [
          {
            orgId: org.id,
            name: "Urgent SLA",
            priority: "URGENT",
            firstResponseMin: 30,
            resolutionMin: 240,
            businessHoursOnly: false,
          },
          {
            orgId: org.id,
            name: "High SLA",
            priority: "HIGH",
            firstResponseMin: 60,
            resolutionMin: 480,
            businessHoursOnly: true,
          },
          {
            orgId: org.id,
            name: "Medium SLA",
            priority: "MEDIUM",
            firstResponseMin: 240,
            resolutionMin: 1440,
            businessHoursOnly: true,
          },
          {
            orgId: org.id,
            name: "Low SLA",
            priority: "LOW",
            firstResponseMin: 480,
            resolutionMin: 2880,
            businessHoursOnly: true,
          },
        ],
      })

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        orgId: org.id,
        orgName: org.name,
        orgSlug: org.slug,
      }
    })

    return NextResponse.json({ data: result }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    )
  }
}
