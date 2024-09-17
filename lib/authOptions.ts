import { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";

import prisma from "@/lib/prisma";
interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface CustomGoogleProfile extends GoogleProfile {
  email_verified: boolean;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }): Promise<boolean> {
      if (account && account.provider === "google") {
        const googleProfile = profile as CustomGoogleProfile;
        console.log(googleProfile)
        return (
          profile !== null &&
          googleProfile.email === process.env.MY_EMAIL
        );
      }
      return false;
    },
    async session({
      session,
      user,
    }: {
      session: Session;
      token: JWT;
      user: User;
    }): Promise<Session> {
      const customSession = session as CustomSession;
      customSession.user.id = user.id;
      return customSession;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/error",
  },
};
