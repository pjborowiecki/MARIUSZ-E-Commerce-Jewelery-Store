import * as React from "react"
import Link from "next/link"
import { getProductCountByCategoryId } from "@/actions/product"
import Balancer from "react-wrap-balancer"

import type { Category } from "@/db/schema/index"

import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCount } from "@/components/store-front/product-count"

interface CategoryCardProps {
  category: Category
}

export async function CategoryCard({
  category,
}: Readonly<CategoryCardProps>): Promise<JSX.Element> {
  const productCount = await getProductCountByCategoryId({ id: category.id })

  return (
    <Link href={`/kategorie/${category.name}`}>
      <Card className="flex size-full flex-col gap-4 rounded-md bg-accent/20 p-5 transition-all hover:bg-accent/40">
        <div className="flex flex-1 flex-col space-y-1">
          <CardTitle className="capitalize">{category.name}</CardTitle>
          <CardDescription>
            <Balancer>{category.description}</Balancer>
          </CardDescription>
        </div>
        <React.Suspense
          fallback={
            <div className="pt-1">
              <Skeleton className="h-4 w-20" />
            </div>
          }
        >
          <ProductCount count={productCount} />
        </React.Suspense>
      </Card>
    </Link>
  )
}
