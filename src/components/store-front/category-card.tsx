import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { getProductCountByCategoryId } from "@/actions/product"

import type { Category } from "@/db/schema/index"

import { cn } from "@/lib/utils"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCount } from "@/components/store-front/product-count"

interface CategoryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  category: Category
}

export async function CategoryCard({
  category,
  className,
  ...props
}: Readonly<CategoryCardProps>): Promise<JSX.Element> {
  const productCount = await getProductCountByCategoryId({ id: category.id })

  return (
    <Link href={`/kategorie/${category.name}`} aria-label={category.name}>
      <Card
        className={cn(
          "flex size-full flex-col gap-4 overflow-hidden rounded-md bg-accent/20 transition-all hover:bg-accent",
          className
        )}
        {...props}
      >
        <CardHeader className="border-b p-0">
          <AspectRatio ratio={4 / 3}>
            <Image
              src={
                category.images
                  ? category.images[0]?.url
                  : "/images/image-placeholder.webp"
              }
              alt={category.name}
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              fill
              loading="lazy"
            />
          </AspectRatio>
        </CardHeader>
        <CardContent>
          <div className="flex flex-1 flex-col space-y-1.5">
            <CardTitle className="text-lg font-semibold capitalize">
              {category.name}
            </CardTitle>

            <React.Suspense
              fallback={
                <div className="pt-1">
                  <Skeleton className="h-4 w-20" />
                </div>
              }
            >
              <ProductCount count={productCount} />
            </React.Suspense>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
