import { getAllActiveProducts } from "@/actions/product"

import { products } from "@/db/schema"
import type { Product } from "@/db/schema"

import { ProductCard } from "@/components/store-front/product-card"

// TODO: Add Metadata, style
// TODO: Add filters, add pagination
export default async function ProductsPage(): Promise<JSX.Element> {
  const products = await getAllActiveProducts()

  return (
    <div className="space-y-5 py-5">
      <h2 className="text-2xl font-semibold">Wszystkie produkty</h2>

      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
