import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"

import auth from "@/lib/auth"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Usuwanie konta",
  description: "Usuń konto w naszym sklepie",
}

export default async function DeleteAccountPage(): Promise<JSX.Element> {
  const session = await auth()
  if (!session) redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  return <div>Usuwanie konta (TODO: Strona w budowie)</div>
}
