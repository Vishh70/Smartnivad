import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "PLACEHOLDER",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "PLACEHOLDER",
    }),
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email === "admin@techdeals.ai" && credentials?.password === "admin") {
          return { id: "1", name: "Super Admin", email: "admin@techdeals.ai", role: "admin" };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "development-secret-do-not-use-in-production-12345",
  pages: {
    signIn: "/login",
    error: "/access-denied",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return "/access-denied";

      // If logging in via Credentials (Admin)
      if (account?.provider === "credentials") {
        if (user.id === "1") return true;
        const adminUser = await prisma.admin.findUnique({
          where: { email: user.email },
        });
        if (adminUser) return true;
        return "/access-denied";
      }

      // If logging in via Google (Public User)
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // If it's credentials, they are an admin. Otherwise normal user.
        if (account?.provider === "credentials") {
          token.role = "admin";
        } else {
          token.role = "user";
        }
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
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

  if (user.email === "admin@techdeals.ai") {
    return { id: "1", email: "admin@techdeals.ai", name: "Super Admin", image: null, createdAt: new Date() };
  }

  const adminUser = await prisma.admin.findUnique({
    where: { email: user.email! },
  });

  if (!adminUser) {
    redirect("/access-denied");
  }

  return adminUser;
}
