import * as React from "react"
import type { Metadata } from "next"
import { unstable_noStore as noStore } from "next/cache"
import Link from "next/link"
import { products, type Product } from "@/db/schema"
import { env } from "@/env.mjs"
import type { SearchParams } from "@/types"
import { storeProductsSearchParamsSchema } from "@/validations/params"
import { and, asc, desc, gte, inArray, like, lte, sql } from "drizzle-orm"

import { db } from "@/config/db"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { CustomTooltip } from "@/components/custom-tooltip"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { Icons } from "@/components/icons"
import { ProductsTableShell } from "@/components/shells/products-table-shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Produkty",
  description: "Zarządzaj swoimi produktami",
}

interface AdminProductsPageProps {
  searchParams: SearchParams
}

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps): Promise<JSX.Element> {
  const { page, per_page, sort, name, category, from, to } =
    storeProductsSearchParamsSchema.parse(searchParams)

  const fallbackPage = isNaN(page) || page < 1 ? 1 : page
  const limit = isNaN(per_page) ? 10 : per_page
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0
  const fromDay = from ? new Date(from) : undefined
  const toDay = to ? new Date(to) : undefined

  const [column, order] = (sort?.split(".") as [
    keyof Product | undefined,
    "asc" | "desc" | undefined,
  ]) ?? ["createdAt", "desc"]

  const categories = (category?.split(".") as Product["category"][]) ?? []

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
        name ? like(products.name, `%{name}%`) : undefined,
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
        name ? like(products.name, `%{name}%`) : undefined,
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
      <div className="flex h-16 w-full items-center justify-between border-b bg-tertiary px-5">
        <Breadcrumbs />
        <div className="flex items-center gap-2">
          <CustomTooltip text="Dodaj produkt">
            <Link
              href="/admin/asortyment/produkty/dodaj-produkt"
              aria-label="Dodaj produkt"
              className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
            >
              <Icons.plus aria-hidden="true" className="size-3" />
              <span>Dodaj produkt</span>
            </Link>
          </CustomTooltip>
        </div>
      </div>

      <div className="p-5">
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={6}
              isNewRowCreatable={true}
              isRowsDeletable={true}
            />
          }
        >
          <ProductsTableShell data={data} pageCount={pageCount} />
        </React.Suspense>
      </div>
    </div>
  )
}
