import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductById } from "@/actions/product"

import { env } from "@/env.mjs"

import { formatPrice, toTitleCase } from "@/lib/utils"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { AddToCartForm } from "@/components/forms/cart/add-to-cart-form"
import { ProductImageCarousel } from "@/components/store-front/product-image-carousel"

// TODO: Add Metadata

interface ProductPageProps {
  params: {
    productId: string
  }
}

export default async function ProductPage({
  params,
}: Readonly<ProductPageProps>): Promise<JSX.Element> {
  const productId = decodeURIComponent(params.productId)

  const product = await getProductById({ id: productId })
  if (!product) notFound()

  return (
    <div className="pb-12 md:pb-14">
      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        <ProductImageCarousel
          images={product.images ?? []}
          options={{ loop: true }}
          className="w-full md:w-1/2"
        />

        <Separator className="mt-4 md:hidden" />

        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="space-y-2">
            <h2 className="line-clamp-1 text-2xl font-bold capitalize">
              {product.name}
            </h2>
            <p className="text-base text-muted-foreground">
              {formatPrice(product.price)}
            </p>
          </div>

          <Separator className="my-1.5" />

          <AddToCartForm productId={productId} showBuyNow={true} />
          <Separator className="mt-5" />
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="description"
          >
            <AccordionItem value="description" className="border-none">
              <AccordionTrigger>Opis przedmiotu</AccordionTrigger>
              <AccordionContent>
                {product.description ??
                  "No description is available for this product."}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Separator className="md:hidden" />
        </div>
      </div>

      {/* <div className="space-y-6 overflow-hidden">
          <h2 className="line-clamp-1 flex-1 text-2xl font-bold">
            More products from {store.name}
          </h2>
          <ScrollArea orientation="horizontal" className="pb-3.5">
            <div className="flex gap-4">
              {otherProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="min-w-[260px]"
                />
              ))}
            </div>
          </ScrollArea>
        </div> */}
    </div>
  )
}
