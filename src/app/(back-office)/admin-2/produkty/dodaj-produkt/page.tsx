import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

import { env } from "@/env.mjs"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AddProductForm } from "@/components/forms/inventory/product/add-product-form"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Dodaj produkt",
  description: "Dodaj nowy projekt do swojego asortymentu",
}

export default async function NewProductPage(): Promise<JSX.Element> {
  // TODO: Check for role === owner
  const session = await auth()
  if (!session?.user) redirect("/logowanie")

  return (
    <div className="p-4">
      <Card className="rounded-md bg-tertiary">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Dodaj produkt</CardTitle>
          <CardDescription>
            Dodaj produkt do swojego asortymentu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddProductForm />
        </CardContent>
      </Card>
    </div>
  )
}
