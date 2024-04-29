"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { addToCart } from "@/actions/cart"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"

import type { Product } from "@/db/schema"

import { useToast } from "@/hooks/use-toast"
import { cn, formatPrice } from "@/lib/utils"

import { Button, buttonVariants } from "@/components/ui/button"
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
  onSwitch?: () => Promise<void>
}

export function ProductCard({
  product,
  variant = "default",
  isAddedToCart = false,
  onSwitch,
  className,
  ...props
}: Readonly<ProductCardProps>): JSX.Element {
  const { toast } = useToast()
  const [isUpdatePending, startUpdateTransition] = React.useTransition()

  console.log(product)

  return (
    <Card
      className={cn(
        "size-full overflow-hidden rounded-md hover:bg-accent",
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
      <CardFooter className="p-4 pt-1">
        {variant === "default" ? (
          <div className="flex w-full items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              aria-label="Dodaj do koszyka"
              className="h-8 w-full rounded-sm"
              // onClick={async () => {
              //   startUpdateTransition(() => {})
              //   const { error } = await addToCart({
              //     productId: product.id,
              //     quantity: 1,
              //   })

              //   if (error) {
              //     toast.error(error)
              //   }
              // }}
              disabled={isUpdatePending}
            >
              {isUpdatePending && (
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Do koszyka
            </Button>
            <Link
              href={`/produkty/podglad/${product.id}`}
              title="Podgląd"
              className={cn(
                buttonVariants({
                  variant: "secondary",
                  size: "icon",
                  className: "h-8 w-8 shrink-0",
                })
              )}
            >
              <Icons.eyeOpen className="size-4" aria-hidden="true" />
              <span className="sr-only">Podgląd</span>
            </Link>
          </div>
        ) : (
          <Button
            aria-label={isAddedToCart ? "Usuń z koszyka" : "Dodaj do koszyka"}
            size="sm"
            className="h-8 w-full rounded-sm"
            onClick={async () => {
              startUpdateTransition(async () => {})
              await onSwitch?.()
            }}
            disabled={isUpdatePending}
          >
            {isUpdatePending ? (
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
