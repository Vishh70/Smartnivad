import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "admin") {
      return Response.redirect(new URL("/access-denied", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
      error: "/access-denied"
    }
  }
);

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
