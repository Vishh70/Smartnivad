import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const adminPath =
      "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a";
    const designPreviewPath = "/design-preview";
    
    if ((req.nextUrl.pathname.startsWith(adminPath) || req.nextUrl.pathname.startsWith(designPreviewPath)) && token?.role !== "admin") {
      return Response.redirect(new URL("/access-denied", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // If it's an admin route or design preview, require token
        const adminPath =
          "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a";
        const designPreviewPath = "/design-preview";
        
        if (req.nextUrl.pathname.startsWith(adminPath) || req.nextUrl.pathname.startsWith(designPreviewPath)) {
          return !!token;
        }
        return true; // Other matched routes can be accessed, but there are none in the matcher right now except admin.
      },
    },
    pages: {
      signIn: "/login",
      error: "/access-denied",
    },
  },
);

export const config = {
  matcher: [
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/:path*",
    "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a",
    "/design-preview",
  ],
};
