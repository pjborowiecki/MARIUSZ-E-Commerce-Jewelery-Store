import * as React from "react"
import { type Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"
import { clientSettingsNavItems } from "@/data/nav-items"

import { Sidebar } from "@/components/nav/client-panel/sidebar"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Ustawienia konta",
  description:
    "Zobacz i edytuj swoje dane oraz ustawienia, lub ewentualnie usuń konto",
}

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default async function SettingsLayout({
  children,
}: Readonly<SettingsLayoutProps>): Promise<JSX.Element> {
  const session = await auth()
  if (!session) redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  return (
    <main className="flex h-full max-w-7xl flex-1 flex-col gap-4 md:gap-8">
      <h1 className="text-2xl font-semibold">Ustawienia</h1>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <Sidebar navItems={clientSettingsNavItems} />
        <div>{children}</div>
      </div>
    </main>
  )
}
