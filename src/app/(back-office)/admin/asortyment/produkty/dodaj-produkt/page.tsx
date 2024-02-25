import type { Metadata } from "next"
import { env } from "@/env.mjs"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { AddProductForm } from "@/components/forms/inventory/add-product-form"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Dodaj produkt",
  description: "Dodaj nowy produkt do asortymentu",
}

export default function AddProductPage(): JSX.Element {
  return (
    <div>
      <div className="flex h-16 w-full items-center border-b bg-tertiary px-4">
        <Breadcrumbs />
      </div>
      <div className="p-4">
        <Card className="max-w-5xl rounded-md bg-tertiary">
          {/* <CardHeader className="px-4 pt-4">
            <CardTitle className="text-2xl">Dodaj Produkt</CardTitle>
            <CardDescription>Dodaj produkt do asortymentu</CardDescription>
          </CardHeader> */}
          <CardContent className="p-4">
            <AddProductForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
