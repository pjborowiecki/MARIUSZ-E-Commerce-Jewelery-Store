import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getUserById } from "@/actions/user"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"

import auth from "@/lib/auth"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UpdateUserAsAdminForm } from "@/components/forms/user/update-user-as-admin-form"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Dane użytkownika",
  description: "Zobacz i edytuj dane użytkownika",
}

interface AdminRegisteredUserPageProps {
  params: {
    userId: string
  }
}

export default async function AdminRegisteredUserPage({
  params,
}: Readonly<AdminRegisteredUserPageProps>): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  const user = await getUserById({ id: params.userId })
  if (!user) notFound()

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight md:text-2xl">
            {`Dane użytkownika ${user.email}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UpdateUserAsAdminForm user={user} />
        </CardContent>
      </Card>
    </div>
  )
}
