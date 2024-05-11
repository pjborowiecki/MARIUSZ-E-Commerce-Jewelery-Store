import * as React from "react"
import type { Metadata } from "next"
import { unstable_noStore as noStore } from "next/cache"
import { redirect } from "next/navigation"
import type { SearchParams } from "@/types"
import { asc, desc, like, sql } from "drizzle-orm"

import { env } from "@/env.mjs"
import { db } from "@/config/db"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"
import { categories, type Category } from "@/db/schema"
import { productCategoriesSearchParamsSchema } from "@/validations/params"

import auth from "@/lib/auth"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
}: Readonly<AdminCategoriesPageProps>): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  const { page, per_page, sort, name } =
    productCategoriesSearchParamsSchema.parse(searchParams)

  const fallbackPage = isNaN(page) || page < 1 ? 1 : page
  const limit = isNaN(per_page) ? 10 : per_page
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0

  const [column, order] = (sort?.split(".") as [
    keyof Category | undefined,
    "asc" | "desc" | undefined,
  ]) ?? ["createdAt", "desc"]

  noStore()
  const data = await db
    .select({
      id: categories.id,
      name: categories.name,
      description: categories.description || null,
      visibility: categories.visibility,
      createdAt: categories.createdAt,
    })
    .from(categories)
    .limit(limit)
    .offset(offset)
    .where(name ? like(categories.name, `%${name}%`) : undefined)
    .orderBy(
      column && column in categories
        ? order === "asc"
          ? asc(categories[column])
          : desc(categories[column])
        : desc(categories.createdAt)
    )

  noStore()
  const count = await db
    .select({
      count: sql<number>`count(${categories.id})`,
    })
    .from(categories)
    .where(name ? like(categories.name, `%${name}%`) : undefined)
    .then((res) => res[0]?.count ?? 0)

  const pageCount = Math.ceil(count / limit)

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      <Card className="rounded-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight md:text-2xl">
            Kategorie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <React.Suspense fallback={<DataTableSkeleton columnCount={4} />}>
            <CategoriesTableShell
              data={data ? data : []}
              pageCount={pageCount ? pageCount : 0}
            />
          </React.Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
