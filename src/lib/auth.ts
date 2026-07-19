import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";

const providers: any[] = [
  CredentialsProvider({
    name: "Admin Login",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      // Check for admin in the database first
      const dbAdmin = await prisma.admin.findUnique({
        where: { email: credentials.email },
      });

      if (dbAdmin) {
        // If admin has a hashed password in DB, verify it
        if (dbAdmin.password) {
          const valid = await bcrypt.compare(
            credentials.password,
            dbAdmin.password,
          );
          if (valid) {
            return {
              id: dbAdmin.id,
              name: dbAdmin.name || "Admin",
              email: dbAdmin.email,
              role: "admin",
            };
          }
          return null;
        }
      }

      // Fallback for default Super Admin via Environment Variables
      const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
      const superAdminHash = process.env.SUPER_ADMIN_PASSWORD_HASH;

      if (superAdminEmail && credentials.email === superAdminEmail) {
        if (
          superAdminHash &&
          (await bcrypt.compare(credentials.password, superAdminHash))
        ) {
          return {
            id: "1",
            name: "Super Admin",
            email: superAdminEmail,
            role: "admin",
          };
        }
      }

      return null;
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: "jwt",
  },
  secret:
    process.env.NEXTAUTH_SECRET ||
    "development-secret-do-not-use-in-production-12345",
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

  // Ensure role is admin (prevents Google users with matching emails from getting access)
  if (user.role !== "admin") {
    redirect("/access-denied");
  }

  if (process.env.SUPER_ADMIN_EMAIL && user.email === process.env.SUPER_ADMIN_EMAIL) {
    return {
      id: "1",
      email: process.env.SUPER_ADMIN_EMAIL,
      name: "Super Admin",
      image: null,
      createdAt: new Date(),
    };
  }

  const adminUser = await prisma.admin.findUnique({
    where: { email: user.email! },
  });

  if (!adminUser) {
    redirect("/access-denied");
  }

  return adminUser;
}
