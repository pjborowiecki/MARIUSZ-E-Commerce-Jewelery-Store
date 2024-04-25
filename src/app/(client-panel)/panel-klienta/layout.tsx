import * as React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"

import { Footer } from "@/components/nav/store-front/footer"
import { Header } from "@/components/nav/store-front/header"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Panel klienta",
  description: "Zarządzaj swoimi danymi oraz zamówienia w naszym sklepie",
}

interface ClientZoneLayoutProps {
  children: React.ReactNode
}

export default async function ClientZoneLayout({
  children,
}: Readonly<ClientZoneLayoutProps>): Promise<JSX.Element> {
  const session = await auth()
  if (!session) redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  return (
    <div>
      <div className="mx-auto flex size-full min-h-screen max-w-7xl flex-col">
        <Header />
        <main className="flex-1 border-t">
          <div className="px-8 py-10">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

// ;<div>
//   <div className="mx-auto flex size-full min-h-screen max-w-7xl flex-col">
//     <Header />
//     <main className="flex-1 px-8">{children}</main>
//   </div>
//   <Footer />
// </div>
