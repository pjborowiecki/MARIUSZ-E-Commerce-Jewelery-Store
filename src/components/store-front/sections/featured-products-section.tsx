import Link from "next/link"

import type { Product } from "@/db/schema/index"

import { cn } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ProductCard } from "@/components/store-front/product-card"

interface FeaturedProductsSectionProps {
  featuredProducts: Product[]
}

export function FeaturedProductsSection({
  featuredProducts,
}: Readonly<FeaturedProductsSectionProps>): JSX.Element {
  return (
    <section className="w-full space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-semibold leading-[1.1] md:text-xl">
          Polecane produkty
        </h2>
        <Link
          href="/produkty"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "flex items-center justify-center gap-2"
          )}
        >
          Zobacz wszystkie
          <Icons.arrowRight className="size-4" />
          <span className="sr-only">Zobacz wszystkie</span>
        </Link>
      </div>

      <div className="grid w-full animate-fade-up grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
