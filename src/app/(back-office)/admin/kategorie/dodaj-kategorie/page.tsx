import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"

import auth from "@/lib/auth"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddCategoryForm } from "@/components/forms/inventory/category/add-category-form"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Dodaj nową kategorię",
  description: "Dodaj nową kategorię produktów w swoim asortymencie",
}

export default async function NewCategoryPage(): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight md:text-2xl">
            Dodaj nową kategorię
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AddCategoryForm />
        </CardContent>
      </Card>
    </div>
  )
}
