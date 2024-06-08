"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { addToCart, deleteCartItem } from "@/actions/cart"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"

import type { Product } from "@/db/schema"

import { useToast } from "@/hooks/use-toast"
import { cn, formatPrice } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { PlaceholderImage } from "@/components/placeholder-image"

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product
  variant?: "default" | "switchable"
  isAddedToCart?: boolean
}

export function ProductCard({
  product,
  variant = "default",
  isAddedToCart = false,
  className,
  ...props
}: Readonly<ProductCardProps>): JSX.Element {
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()

  return (
    <Card
      className={cn(
        "size-full overflow-hidden rounded-md transition-all duration-200 ease-in-out hover:bg-accent/30",
        className
      )}
      {...props}
    >
      <Link href={`/produkty/${product.id}`} aria-label={product.name}>
        <CardHeader className="border-b p-0">
          <AspectRatio ratio={4 / 3}>
            {product.images?.length ? (
              <Image
                src={
                  product.images[0]?.url ?? "/images/product-placeholder.webp"
                }
                alt={product.images[0]?.name ?? product.name}
                className="object-cover"
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                fill
                loading="lazy"
              />
            ) : (
              <PlaceholderImage className="rounded-none" asChild />
            )}
          </AspectRatio>
        </CardHeader>
        <span className="sr-only">{product.name}</span>
      </Link>
      <Link href={`/produkty/${product.id}`} tabIndex={-1}>
        <CardContent className="space-y-1.5 p-4">
          <CardTitle className="line-clamp-1 capitalize">
            {product.name}
          </CardTitle>
          <CardDescription className="line-clamp-1">
            {formatPrice(product.price)}
          </CardDescription>
        </CardContent>
      </Link>
      <CardFooter className="w-full p-4 pt-1">
        {variant === "default" ? (
          <div className="flex w-full items-center justify-between gap-8">
            <Button
              variant="outline"
              size="sm"
              aria-label="Dodaj do koszyka"
              className="h-8 w-full rounded-full font-medium transition-all duration-200 ease-in-out hover:bg-accent"
              onClick={() => {
                startTransition(async () => {
                  try {
                    const message = await addToCart({
                      productId: product.id,
                      quantity: 1,
                    })

                    switch (message) {
                      case "success":
                        toast({
                          title: "Produkt dodano do koszyka",
                        })
                        break
                      case "out-of-stock":
                        toast({
                          title: "Produkt nie jest dostępny",
                          description:
                            "Przepraszamy, wybrany produkt nie jest już dostępny",
                          variant: "destructive",
                        })
                        break
                      default:
                        toast({
                          title: "Przepraszamy, coś poszło nie tak",
                          description:
                            "Spróbuj ponownie lub skontaktuj się z nami",
                          variant: "destructive",
                        })
                    }
                  } catch (error) {
                    console.error(error)
                    toast({
                      title: "Przepraszamy, coś poszło nie tak",
                      description: "Spróbuj ponownie lub skontaktuj się z nami",
                      variant: "destructive",
                    })
                  }
                })
              }}
              disabled={isPending}
            >
              {isPending && (
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Do koszyka
            </Button>

            <div className="flex items-center justify-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="size-8 shrink-0 transition-all duration-200 ease-in-out hover:scale-110"
              >
                <Icons.heart className="size-3.5" aria-hidden="true" />
                <span className="sr-only">Dodaj do ulubionych</span>
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="size-8 shrink-0 transition-all duration-200 ease-in-out hover:scale-110"
              >
                <Icons.share className="size-3.5" aria-hidden="true" />
                <span className="sr-only">
                  Udostępnij w mediach społecznościowych
                </span>
              </Button>
            </div>
          </div>
        ) : (
          <Button
            aria-label={isAddedToCart ? "Usuń z koszyka" : "Dodaj do koszyka"}
            size="sm"
            className="h-8 w-full rounded-sm"
            // TODO: Test delete cart teim functionality
            // TODO: Update button style and text based on whether the item is in cart or not
            onClick={() =>
              startTransition(async () => {
                try {
                  const message = await deleteCartItem({
                    productId: product.id,
                  })

                  switch (message) {
                    case "success":
                      toast({
                        title: "Produkt usunięty z koszyka",
                        description: "TODO: ZAIMPLENTOWAĆ",
                      })
                      break
                    default:
                      toast({
                        title: "Coś poszło nie tak",
                        description:
                          "Spróbuj ponownie lub skontaktuj się z nami",
                        variant: "destructive",
                      })
                  }
                } catch (error) {
                  console.error(error)
                  toast({
                    title: "Coś poszło nie tak",
                    description: "Spróbuj ponownie lub skontaktuj się z nami",
                    variant: "destructive",
                  })
                }
              })
            }
            disabled={isPending}
          >
            {isPending ? (
              <Icons.spinner
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            ) : isAddedToCart ? (
              <Icons.check className="mr-2 size-4" aria-hidden="true" />
            ) : (
              <Icons.plus className="mr-2 size-4" aria-hidden="true" />
            )}
            {isAddedToCart ? "W koszyku" : "Dodaj do koszyka"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
