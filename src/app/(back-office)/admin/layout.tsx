import { redirect } from "next/navigation"
import { auth } from "@/auth"

import { Header } from "@/components/nav/back-office/header"
import { Sidebar } from "@/components/nav/back-office/sidebar"

export default async function AdminLayout({
  children,
}: React.PropsWithChildren) {
  const session = await auth()

  // TODO: Include user role check
  if (!session?.user) redirect("/logowanie")

  return (
    <div className="flex flex-col">
      <Header user={session.user} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="h-auto w-full lg:ml-64">{children}</main>
      </div>
    </div>
  )
}
