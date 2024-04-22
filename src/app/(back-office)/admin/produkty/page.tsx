import * as React from "react"
import type { Metadata } from "next"
import { unstable_noStore as noStore } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import type { SearchParams } from "@/types"
import { endOfDay, startOfDay } from "date-fns"
import { and, asc, desc, gte, like, lte, sql } from "drizzle-orm"

import { env } from "@/env.mjs"
import { db } from "@/config/db"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"
import { products, type Product } from "@/db/schema"
import { storeProductsSearchParamsSchema } from "@/validations/params"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import { ProductsTableShell } from "@/components/shells/products-table-shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Produkty",
  description: "Zarządzaj produktami w swoim asortymencie",
}

interface ProductsPageProps {
  searchParams: SearchParams
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps): Promise<React.JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  const {
    page,
    per_page,
    sort,
    name,
    categoryName,
    subcategoryName,
    from,
    to,
  } = storeProductsSearchParamsSchema.parse(searchParams)

  const fallbackPage = isNaN(page) || page < 1 ? 1 : page
  const limit = isNaN(per_page) ? 10 : per_page
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0
  const fromDay = from ? startOfDay(new Date(from)) : undefined
  const toDay = to ? endOfDay(new Date(to)) : undefined

  const [column, order] = (sort?.split(".") as [
    keyof Product | undefined,
    "asc" | "desc" | undefined,
  ]) ?? ["createdAt", "desc"]

  noStore()
  const data = await db
    .select({
      id: products.id,
      name: products.name,
      state: products.state,
      price: products.price,
      inventory: products.inventory,
      categoryName: products.categoryName,
      subcategoryName: products.subcategoryName,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .limit(limit)
    .offset(offset)
    .where(
      and(
        name ? like(products.name, `%${name}%`) : undefined,
        categoryName
          ? like(products.categoryName, `%${categoryName}%`)
          : undefined,
        subcategoryName
          ? like(products.subcategoryName, `%${subcategoryName}%`)
          : undefined,
        fromDay && toDay
          ? and(
              gte(products.createdAt, fromDay),
              lte(products.createdAt, toDay)
            )
          : undefined
      )
    )
    .orderBy(
      column && column in products
        ? order === "asc"
          ? asc(products[column])
          : desc(products[column])
        : desc(products.createdAt)
    )

  noStore()
  const count = await db
    .select({
      count: sql<number>`count(${products.id})`,
    })
    .from(products)
    .where(
      and(
        name ? like(products.name, `%${name}%`) : undefined,
        categoryName
          ? like(products.categoryName, `%${categoryName}%`)
          : undefined,
        subcategoryName
          ? like(products.subcategoryName, `%${subcategoryName}%`)
          : undefined,
        fromDay && toDay
          ? and(
              gte(products.createdAt, fromDay),
              lte(products.createdAt, toDay)
            )
          : undefined
      )
    )
    .then((res) => res[0]?.count ?? 0)

  const pageCount = Math.ceil(count / limit)

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      <Card className="rounded-md">
        <CardHeader className="space-y-1">
          <CardTitle className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <div className="text-xl font-bold tracking-tight md:text-2xl">
              Produkty
            </div>
            <DateRangePicker align="end" />
          </CardTitle>
        </CardHeader>

        <CardContent>
          <React.Suspense fallback={<DataTableSkeleton columnCount={5} />}>
            <ProductsTableShell
              data={data ? data : []}
              pageCount={pageCount ? pageCount : 0}
            />
          </React.Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
