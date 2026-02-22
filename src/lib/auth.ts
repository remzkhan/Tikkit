import { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            memberships: {
              include: { org: true },
            },
          },
        })

        if (!user) {
          throw new Error("No account found with that email")
        }

        const isValid = await compare(credentials.password, user.passwordHash)
        if (!isValid) {
          throw new Error("Invalid password")
        }

        const primaryMembership = user.memberships[0]

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
          orgId: primaryMembership?.orgId ?? null,
          orgName: primaryMembership?.org.name ?? null,
          role: primaryMembership?.role ?? "VIEWER",
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.orgId = (user as any).orgId
        token.orgName = (user as any).orgName
        token.role = (user as any).role
      }
      // Handle org switching
      if (trigger === "update" && session?.orgId) {
        token.orgId = session.orgId
        token.orgName = session.orgName
        token.role = session.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
        ;(session.user as any).orgId = token.orgId as string
        ;(session.user as any).orgName = token.orgName as string
        ;(session.user as any).role = token.role as string
      }
      return session
    },
  },
}

export function getServerSession() {
  // Use next-auth's getServerSession with authOptions
  // This is imported and used in API routes and server components
  return import("next-auth").then((mod) => mod.getServerSession(authOptions))
}
