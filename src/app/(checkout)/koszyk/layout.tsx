import * as React from "react"
import { redirect } from "next/navigation"

import { DEFAULT_SIGNIN_REDIRECT } from "@/config/defaults"

import auth from "@/lib/auth"

import { Header } from "@/components/nav/store-front/header"

interface CartLayoutProps {
  children: React.ReactNode
}

export default async function CartLayout({
  children,
}: Readonly<CartLayoutProps>) {
  const session = await auth()
  if (!session) redirect(DEFAULT_SIGNIN_REDIRECT)

  return (
    <div className="relative mx-auto flex size-full h-auto min-h-[85.5vh] max-w-7xl flex-col">
      <Header />
      <main className="flex-1 px-8">{children}</main>
    </div>
  )
}
