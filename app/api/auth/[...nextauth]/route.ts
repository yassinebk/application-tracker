import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
      profile,
      email,
      credentials,
    }: {
      user: User;
      account: any;
      profile?: any;
      email?: any;
      credentials?: any;
    }): Promise<boolean> {
      return user.email === process.env.YOUR_EMAIL;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: Session;
      token: JWT;
      user: User;
    }): Promise<Session> {
      (session!.user as any)!.id = user.id;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/error",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
