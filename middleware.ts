import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // Protect /admin routes making sure user is ADMIN
        if (
            req.nextUrl.pathname.startsWith("/admin") &&
            req.nextauth.token?.role !== "ADMIN"
        ) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token, // Ensure they are at least logged in before hitting the logic
        },
        pages: {
            signIn: '/login',
        }
    }
);

// Apply middleware to /admin exactly, and all its children. Also protect any /api/admin paths
export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"]
};
