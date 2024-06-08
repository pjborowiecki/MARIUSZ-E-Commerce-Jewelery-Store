import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductById } from "@/actions/product"

import { env } from "@/env.mjs"

import { formatPrice } from "@/lib/utils"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { AddToCartForm } from "@/components/forms/cart/add-to-cart-form"
import { ProductImageCarousel } from "@/components/store-front/product-image-carousel"

// TODO: Replace productId with productName in the meta description
interface ProductPageProps {
  params: {
    productId: string
  }
}

export function generateMetadata({
  params,
}: Readonly<ProductPageProps>): Metadata {
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: params.productId,
    description: `Szczeółowy opis i zdjęcia produktu ${params.productId}`,
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
          <AddToCartForm productId={productId} />
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
                <p>{product.description}</p>
                {/* TODO: Break description into parts: 
                  - Material
                  - Length
                  - Weight 
                  - Wait time
                  - Etc
                */}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Separator className="md:hidden" />
        </div>
      </div>
    </div>
  )
}
