import { redirect } from "next/navigation"
import { auth } from "@/auth"

import { Footer } from "@/components/nav/back-office/footer"
import { Header } from "@/components/nav/back-office/header"
import { Sidebar } from "@/components/nav/back-office/sidebar"

export default async function AdminLayout({
  children,
}: React.PropsWithChildren) {
  const session = await auth()

  // TODO: Include user role check
  if (!session?.user) redirect("/logowanie")

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={session.user} />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <Sidebar />
        <main className="flex w-full flex-col overflow-hidden">{children}</main>
      </div>
      <Footer />
    </div>
  )
}
