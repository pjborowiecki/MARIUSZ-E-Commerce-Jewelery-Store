import * as React from "react"
import type { Metadata } from "next"
import { unstable_noStore as noStore } from "next/cache"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import type { SearchParams } from "@/types"

import { env } from "@/env.mjs"
import { db } from "@/config/db"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"
import { categories, type Category } from "@/db/schema"
import { productCategoriesSearchParamsSchema } from "@/validations/params"

import { cn } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { CategoriesTableShell } from "@/components/shells/categories-table-shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Kategorie",
  description: "Zarządzaj kategoriami swoich produktów",
}

interface AdminCategoriesPageProps {
  searchParams: SearchParams
}

export default async function AdminCategoriesPage({
  searchParams,
}: AdminCategoriesPageProps): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "owner") redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  const { page, per_page, sort, name } =
    productCategoriesSearchParamsSchema.parse(searchParams)

  const data = []

  const pageCount = 0

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      {data?.length === 0 ? (
        <Card className="flex h-[84vh] flex-1 flex-col items-center justify-center rounded-md border-2 border-dashed bg-accent/40 text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Brak kategorii do wyświetlenia
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Dodaj pierwszą kategorię aby wyświetlić listę
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/kategorie/dodaj-kategorie"
              aria-label="dodaj kategorię"
              className={cn(buttonVariants())}
            >
              Dodaj kategorię
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight md:text-2xl">
              Kategorie
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* TODO: Update column count */}
            <React.Suspense fallback={<DataTableSkeleton columnCount={5} />}>
              <CategoriesTableShell
                data={data ? data : []}
                pageCount={pageCount ? pageCount : 0}
              />
            </React.Suspense>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
