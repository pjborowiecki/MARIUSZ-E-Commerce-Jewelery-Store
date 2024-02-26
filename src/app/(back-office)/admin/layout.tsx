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
    <div className="flex size-full h-screen min-h-screen flex-col">
      <Header user={session.user} />
      <div className="flex h-full">
        <Sidebar />
        <main className="flex size-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
