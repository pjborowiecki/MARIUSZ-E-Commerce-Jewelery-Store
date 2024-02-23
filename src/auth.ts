import { linkOAuthAccount } from "@/actions/auth"
import { getUserById } from "@/actions/user"
import { env } from "@/env.mjs"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import NextAuth from "next-auth"

import authConfig from "@/config/auth"
import { db } from "@/config/db"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  debug: env.NODE_ENV === "development",
  pages: {
    signIn: "/logowanie",
    signOut: "/signout",
  },
  secret: env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 daysd
    updateAge: 24 * 60 * 60, // 24 hours
  },
  events: {
    async linkAccount({ user }) {
      if (user.id) await linkOAuthAccount({ userId: user.id })
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.id) return false
      if (account?.provider !== "credentials") return true

      const existingUser = await getUserById({ id: user.id })

      return !existingUser?.emailVerified ? false : true
    },
  },
  adapter: DrizzleAdapter(db),
  ...authConfig,
})