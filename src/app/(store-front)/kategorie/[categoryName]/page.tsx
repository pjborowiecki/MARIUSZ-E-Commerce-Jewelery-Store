import type { Metadata } from "next"
import type { SearchParams } from "@/types"

import { env } from "@/env.mjs"
import type { Product } from "@/db/schema"

import { toTitleCase } from "@/lib/utils"

import { Products } from "@/components/store-front/products"

interface CategoryPageProps {
  params: {
    categoryName: string
  }
  searchParams: SearchParams
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: toTitleCase(params.categoryName),
    description: `Wszystkie produkty z kategorii ${params.categoryName}`,
  }
}

export default function CategoryPage({
  params,
  searchParams,
}: Readonly<CategoryPageProps>) {
  const { categoryName } = params

  return <div>Kategoria: {categoryName}</div>
}
