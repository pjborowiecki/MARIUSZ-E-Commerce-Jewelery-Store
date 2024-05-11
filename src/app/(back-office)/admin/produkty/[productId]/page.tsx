import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getAllCategories, getAllSubcategories } from "@/actions/category"
import { getProductById } from "@/actions/product"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"

import auth from "@/lib/auth"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UpdateProductForm } from "@/components/forms/inventory/product/updatet-product-form"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Szczegóły produktu",
  description: "Zobacz i edytuj dane swojego produktu",
}

interface AdminProductPage {
  params: {
    productId: string
  }
}

export default async function AdminProductPage({
  params,
}: AdminProductPage): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  const product = await getProductById({ id: params.productId })

  const categories = await getAllCategories()
  const subcategories = await getAllSubcategories()

  if (!product || !categories || !subcategories) notFound()

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight md:text-2xl">
            Szczegóły produktu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UpdateProductForm
            product={product}
            categories={categories}
            subcategories={subcategories}
          />
        </CardContent>
      </Card>
    </div>
  )
}
