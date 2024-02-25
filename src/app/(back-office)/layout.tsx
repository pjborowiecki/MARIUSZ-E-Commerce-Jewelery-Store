import * as React from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Footer } from "@/components/nav/back-office/footer"
import { Header } from "@/components/nav/back-office/header"
import { Sidebar } from "@/components/nav/back-office/sidebar"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({
  children,
}: Readonly<AdminLayoutProps>): Promise<JSX.Element> {
  const session = await auth()
  // TODO: Extend to check for user.role === "owner"
  if (!session?.user) redirect("/logowanie")

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={session?.user} />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <ScrollArea className="py-6 pr-6 lg:py-8">
            <Sidebar />
          </ScrollArea>
        </aside>
        <main className="flex w-full flex-col overflow-hidden">{children}</main>
      </div>
      <Footer />
    </div>
  )
}
