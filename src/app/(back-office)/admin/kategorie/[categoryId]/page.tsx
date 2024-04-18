import { type Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getCategoryById } from "@/actions/category"
import { auth } from "@/auth"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UpdateCategoryForm } from "@/components/forms/inventory/category/update-category-form"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Szczegóły kategorii",
  description: "Zobacz i edytuj kategorię produktów",
}

interface AdminCategoryPageProps {
  params: {
    categoryId: string
  }
}

export default async function AdminCategoryPage({
  params,
}: AdminCategoryPageProps): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  const category = await getCategoryById({ id: params.categoryId })
  if (!category) notFound()

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight md:text-2xl">
            Szczegóły kategorii
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UpdateCategoryForm category={category} />
        </CardContent>
      </Card>
    </div>
  )
}
