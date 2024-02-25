import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductById } from "@/actions/products"
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
  title: "Zarządzanie produktem",
  description: "Edytuj wybrany produkt",
}

interface UpdateProductPageProps {
  params: {
    productId: string
  }
}

export default async function AdminProductPage({
  params,
}: UpdateProductPageProps): Promise<JSX.Element> {
  const product = await getProductById({ id: params.productId })
  if (!product) notFound()

  return (
    <Card>
      <UpdateProductForm />
    </Card>
  )
}
