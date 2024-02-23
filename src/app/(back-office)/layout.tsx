import * as React from "react"

import { Header } from "@/components/nav/back-office/header"
import { Sidebar } from "@/components/nav/back-office/sidebar"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({
  children,
}: Readonly<AdminLayoutProps>): JSX.Element {
  return (
    <div className="flex">
      <Sidebar />
      <div className="h-screen w-full overflow-y-auto">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  )
}
