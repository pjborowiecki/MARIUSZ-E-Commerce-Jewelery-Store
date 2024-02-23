import * as React from "react"

import { Footer } from "@/components/nav/store-front/footer"
import { Header } from "@/components/nav/store-front/header"

interface StoreFrontLayoutProps {
  children: React.ReactNode
}

export default function StoreFrontLayout({
  children,
}: Readonly<StoreFrontLayoutProps>): JSX.Element {
  return (
    <div className="mx-auto flex size-full min-h-screen max-w-7xl flex-col px-8">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
