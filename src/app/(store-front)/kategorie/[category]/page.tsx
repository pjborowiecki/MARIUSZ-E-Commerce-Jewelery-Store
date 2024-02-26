import type { SearchParams } from "@/types"

import { type Product } from "@/db/schema"

interface CategoryPageProps {
  params: {
    category: Product["category"]
  }
  searchParams: SearchParams
}

export default function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = params

  return <div>Kategoria: ${category}</div>
}
