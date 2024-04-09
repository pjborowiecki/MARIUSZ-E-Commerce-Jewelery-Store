import * as React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"
import { adminNavItems } from "@/data/nav-items"

import { Header } from "@/components/nav/back-office/header"
import { Sidebar } from "@/components/nav/back-office/sidebar"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Panel Administratora",
  description: "Zaloguj się jako administrator aby zarządzać sklepem",
}

interface BackOfficeAdminLayoutProps {
  children: React.ReactNode
}

export default async function BackOfficeAdminLayout({
  children,
}: BackOfficeAdminLayoutProps): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "owner") redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  return (
    <div className="flex h-screen w-full flex-col bg-muted/40">
      <Sidebar navItems={adminNavItems} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header user={session?.user} navItems={adminNavItems} />
      </div>
      <main className="sm:pl-6">{children}</main>
    </div>
  )
}
