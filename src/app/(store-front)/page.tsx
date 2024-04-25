import * as React from "react"
import { getAllCategories } from "@/actions/category"
import { getFeaturedProducts } from "@/actions/product"

import { StoreFront } from "@/components/store-front/store-front"
import { StoreFrontSkeleton } from "@/components/store-front/store-front-skeleton"

const products = await getFeaturedProducts()
const categories = await getAllCategories()

export default function LandingPage(): JSX.Element {
  return (
    <React.Suspense fallback={<StoreFrontSkeleton />}>
      <StoreFront products={products} categories={categories} />
    </React.Suspense>
  )
}
