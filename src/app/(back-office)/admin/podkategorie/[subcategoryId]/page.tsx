import { type Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getSubcategoryById } from "@/actions/category"
import { auth } from "@/auth"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UpdateSubcategoryForm } from "@/components/forms/inventory/subcategory/update-subcategory-form"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Szczegóły podkategorii",
  description: "Zobacz i edytuj podkategorię produktów",
}

interface AdminSubcategoryPageProps {
  params: {
    subcategoryId: string
  }
}

export default async function AdminSubcategoryPage({
  params,
}: AdminSubcategoryPageProps): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  const subcategory = await getSubcategoryById({ id: params.subcategoryId })
  if (!subcategory) notFound()

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight md:text-2xl">
            Szczegóły podkategorii
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UpdateSubcategoryForm subcategory={subcategory} />
        </CardContent>
      </Card>
    </div>
  )
}
