import { type Metadata } from "next"
import { PathParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime"
import { notFound, redirect } from "next/navigation"
import { getSubcategoryById } from "@/actions/category"
import { auth } from "@/auth"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UpdateSubcategoryForm } from "@/components/forms/inventory/subcategory/update-subcategory-form"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Szczegóły produktu",
  description: "Zobacz i edytuj dane swojego produktu",
}

interface AdminSubcategoryPageProps {
  params: {
    categoryId: string
  }
}

export default async function AdminSubcategoryPage(): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  const subcategory = await getSubcategoryById({
    id: PathParamsContext.subcategoryId,
  })
  if (!subcategory) notFound()

  return <div className="px-2 py-5 sm:pl-14 sm:pr-6"></div>
}
