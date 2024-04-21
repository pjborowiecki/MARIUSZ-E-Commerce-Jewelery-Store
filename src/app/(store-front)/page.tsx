import * as React from "react"
import { getCategories } from "@/actions/category"
import { getFeaturedProducts } from "@/actions/product"

import { StoreFront } from "@/components/store-front/store-front"
import { StoreFrontSkeleton } from "@/components/store-front/store-front-skeleton"

// const productsPromise = getFeaturedProducts()
// const categoriesPromise = getCategories()

export default function LandingPage(): JSX.Element {
  return (
    <React.Suspense fallback={<StoreFrontSkeleton />}>
      <div>landing page</div>
      {/* <StoreFront
        productsPromise={productsPromise}
        categoriesPromise={categoriesPromise}
      /> */}
    </React.Suspense>
  )
}
