import type { Metadata } from "next"
import { env } from "@/env.mjs"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AddCategoryForm } from "@/components/forms/inventory/add-category-form"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Nowa kategoria",
  description: "Dodaj nową kategorię produktów",
}

export default function AddCategoryPage(): JSX.Element {
  return (
    <div>
      {/* <SubSubHeader /> */}
      <div className="p-5">
        <Card className="max-w-5xl rounded-md bg-tertiary">
          <CardHeader className="px-5 pt-5">
            <CardTitle className="text-2xl">Nowa kategoria</CardTitle>
            <CardDescription className="text-base">
              Dodaj nową kategorię produktów
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pt-2">
            <AddCategoryForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
