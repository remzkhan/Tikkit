import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl

    // Allow public routes
    if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/api/webhooks") ||
      pathname === "/"
    ) {
      return NextResponse.next()
    }

    // Check if user is authenticated
    const token = req.nextauth.token
    if (!token) {
      const loginUrl = new URL("/login", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        // Allow public routes without auth
        if (
          pathname.startsWith("/login") ||
          pathname.startsWith("/signup") ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/api/webhooks") ||
          pathname === "/"
        ) {
          return true
        }
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|integrations|images).*)",
  ],
}
