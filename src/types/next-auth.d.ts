import type { DefaultSession } from "next-auth"

type Role = "klient" | "administrator"

declare module "next-auth" {
  interface User {
    role: Role
  }

  interface Session {
    user: DefaultSession["user"] & {
      role: Role
    }
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: Role
  }
}
