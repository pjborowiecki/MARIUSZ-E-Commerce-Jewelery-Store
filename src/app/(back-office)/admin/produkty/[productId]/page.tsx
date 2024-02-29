import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductById } from "@/actions/product"

import { env } from "@/env.mjs"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UpdateProductForm } from "@/components/forms/inventory/updatet-product-form"

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
  const product = await getProductById({ id: params.productId })
  if (!product) notFound()

  return (
    <div className="p-5">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Szczegóły produktu</CardTitle>

          <CardDescription>
            Zarządzaj, edytuj dane lub usuń produkt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateProductForm product={product} />
        </CardContent>
      </Card>
    </div>
  )
}
