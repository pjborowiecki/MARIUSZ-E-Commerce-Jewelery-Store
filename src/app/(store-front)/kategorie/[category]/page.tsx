import { type Product } from "@/db/schema"
import type { SearchParams } from "@/types"

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
