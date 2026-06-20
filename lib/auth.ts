import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "PLACEHOLDER",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "PLACEHOLDER",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/access-denied",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return "/access-denied";

      const adminUser = await prisma.adminUser.findUnique({
        where: { email: user.email },
      });

      if (adminUser) {
        return true;
      }
      
      return "/access-denied";
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const adminUser = await prisma.adminUser.findUnique({
    where: { email: user.email! },
  });

  if (!adminUser) {
    redirect("/access-denied");
  }

  return adminUser;
}
