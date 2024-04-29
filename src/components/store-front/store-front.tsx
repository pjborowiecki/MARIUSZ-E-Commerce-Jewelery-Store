import type { Category, Product } from "@/db/schema/index"

import { CategoriesSection } from "@/components/store-front/sections/categories-section"
import { FeaturedProductsSection } from "@/components/store-front/sections/featured-products-section"
import { HeroSection } from "@/components/store-front/sections/hero-section"

interface StoreFrontProps {
  products: Product[]
  categories: Category[]
}

export function StoreFront({
  products,
  categories,
}: Readonly<StoreFrontProps>): JSX.Element {
  const featuredProducts = products.filter(
    (product) => product.importance === "wyróżniony"
  )

  return (
    <div className="space-y-10 pb-10">
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FeaturedProductsSection featuredProducts={featuredProducts} />
    </div>
  )
}
