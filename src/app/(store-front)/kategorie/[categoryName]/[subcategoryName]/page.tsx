import type { Metadata } from "next"
import { unstable_noStore as noStore } from "next/cache"
import type { SearchParams } from "@/types"
import { and, asc, desc, eq, gte, lte, sql } from "drizzle-orm"
import Balancer from "react-wrap-balancer"

import { env } from "@/env.mjs"
import { db } from "@/config/db"
import { products, type Product } from "@/db/schema"
import { getProductsSearchParamsSchema } from "@/validations/params"

import { toTitleCase, unslugify } from "@/lib/utils"

interface SubcategoryPageProps {
  searchParams: SearchParams
  params: {
    categoryName: string
    subcategoryName: string
  }
}

export function generateMetadata({ params }: SubcategoryPageProps): Metadata {
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: toTitleCase(params.subcategoryName),
    description: `Wszystkie produkty z podkategorii ${unslugify(params.subcategoryName)} dla kategorii ${unslugify(params.categoryName)}`,
  }
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: Readonly<SubcategoryPageProps>): Promise<JSX.Element> {
  const categoryName = decodeURIComponent(params.categoryName)
  const subcategoryName = decodeURIComponent(params.subcategoryName)

  const { page, per_page, sort, price_range, state } =
    getProductsSearchParamsSchema.parse(searchParams)

  const fallbackPage = isNaN(page) || page < 1 ? 1 : page
  const limit = isNaN(per_page) ? 10 : per_page
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0
  const [minPrice, maxPrice] = price_range?.split("-") ?? []

  const [column, order] = (sort?.split(".") as [
    keyof Product | undefined,
    "asc" | "desc" | undefined,
  ]) ?? ["createdAt", "desc"]

  noStore()
  const data = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      state: products.state,
      categoryName: products.categoryName,
      subcategoryName: products.subcategoryName,
      categoryId: products.categoryId,
      subcategoryId: products.subcategoryId,
      tags: products.tags,
      price: products.price,
      inventory: products.inventory,
      images: products.images,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .limit(limit)
    .offset(offset)
    .where(
      and(
        state ? eq(products.state, state) : eq(products.state, "aktywny"),
        minPrice ? gte(products.price, minPrice) : undefined,
        maxPrice ? lte(products.price, maxPrice) : undefined,
        categoryName ? eq(products.categoryName, categoryName) : undefined,
        subcategoryName
          ? eq(products.subcategoryName, subcategoryName)
          : undefined
      )
    )
    .groupBy(products.id)
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
        state ? eq(products.state, state) : eq(products.state, "aktywny"),
        minPrice ? gte(products.price, minPrice) : undefined,
        maxPrice ? lte(products.price, maxPrice) : undefined,
        categoryName ? eq(products.categoryName, categoryName) : undefined,
        subcategoryName
          ? eq(products.subcategoryName, subcategoryName)
          : undefined
      )
    )
    .execute()
    .then((res) => res[0]?.count ?? 0)

  const pageCount = Math.ceil(count / limit)

  // TODO: Remove later
  console.log(data)
  console.log(pageCount)

  return (
    <div className="py-5">
      <section>
        <h2 className="text-2xl font-semibold tracking-tighter  text-foreground/80">
          {toTitleCase(categoryName)}
        </h2>
        <p className="font-medium text-muted-foreground">
          <Balancer>{`Wszystkie produkty z podkategorii ${subcategoryName} w kategorii ${categoryName}`}</Balancer>
        </p>
      </section>

      {/* TODO: Add product cards, style */}
      <section>
        {data.map((product: Product) => (
          <div key={product.id} className="rounded-md border p-5">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
