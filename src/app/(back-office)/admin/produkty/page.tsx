import * as React from "react"
import type { Metadata } from "next"
import { unstable_noStore as noStore } from "next/cache"
import type { SearchParams } from "@/types"
import { and, asc, desc, gte, inArray, like, lte, sql } from "drizzle-orm"

import { env } from "@/env.mjs"
import { db } from "@/config/db"
import { products, type Product } from "@/db/schema"
import { storeProductsSearchParamsSchema } from "@/validations/params"

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
}: ProductsPageProps): Promise<JSX.Element> {
  const { page, per_page, sort, name, category, from, to } =
    storeProductsSearchParamsSchema.parse(searchParams)

  const fallbackPage = isNaN(page) || page < 1 ? 1 : page
  const limit = isNaN(per_page) ? 10 : per_page
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0
  const fromDay = from ? new Date(from) : undefined
  const toDay = to ? new Date(to) : undefined

  const categories = (category?.split(".") as Product["category"][]) ?? []

  const [column, order] = (sort?.split(".") as [
    keyof Product | undefined,
    "asc" | "desc" | undefined,
  ]) ?? ["createdAt", "desc"]

  noStore()
  const data = await db
    .select({
      id: products.id,
      name: products.name,
      category: products.category,
      price: products.price,
      inventory: products.inventory,
      createdAt: products.createdAt,
    })
    .from(products)
    .limit(limit)
    .offset(offset)
    .where(
      and(
        name ? like(products.name, `%${name}%`) : undefined,
        categories.length > 0
          ? inArray(products.category, categories)
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
        categories.length > 0
          ? inArray(products.category, categories)
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
    <div>
      <div className="flex flex-col gap-2 border-b bg-tertiary p-4 sm:flex-row sm:items-center sm:justify-between md:min-h-20">
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">
          Produkty
        </h2>
        <DateRangePicker align="end" />
      </div>

      <div className="p-4">
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={5}
              isNewRowCreatable={true}
              isRowsDeletable={true}
            />
          }
        >
          <ProductsTableShell
            data={data ? data : []}
            pageCount={pageCount ? pageCount : 0}
          />
        </React.Suspense>
      </div>
    </div>
  )
}
