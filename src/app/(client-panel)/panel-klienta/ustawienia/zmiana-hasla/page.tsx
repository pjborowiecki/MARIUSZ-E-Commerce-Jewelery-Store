import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Zmiana hasła",
  description: "Zmień swoje hasło",
}

export default async function PasswordUpdatePage(): Promise<JSX.Element> {
  const session = await auth()
  if (!session) redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  return <div>Zmiana hasła (TODO: Strona w budowie)</div>
}
