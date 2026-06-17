import NextAuth, { type NextAuthResult } from "next-auth";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db, schema } from "@malay/db";

export const { handlers, signIn, signOut, auth }: NextAuthResult = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: schema.users,
    accountsTable: schema.accounts,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
    authenticatorsTable: schema.authenticators,
  }),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await db.query.users.findFirst({
          where: (u, { eq }) => eq(u.email, credentials.email as string),
        });
        if (!user) return null;
        // Password verification will use bcrypt in Phase 2
        // For now, credentials login is stubbed; use Google/Apple OAuth
        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
    Apple({
      clientId: process.env.AUTH_APPLE_ID ?? "",
      clientSecret: process.env.AUTH_APPLE_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        (session.user as any).role = (user as any).role;
      }
      return session;
    },
  },
});
