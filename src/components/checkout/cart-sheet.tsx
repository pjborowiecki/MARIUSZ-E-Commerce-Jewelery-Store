import Link from "next/link"
import { getCart } from "@/actions/cart"

import { cn, formatPrice } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CartLineItems } from "@/components/checkout/cart-line-items"
import { CustomTooltip } from "@/components/custom-tooltip"
import { Icons } from "@/components/icons"

export async function CartSheet(): Promise<JSX.Element> {
  const cartLineItems = await getCart()

  const itemCount = cartLineItems.reduce(
    (total, item) => total + Number(item.quantity),
    0
  )

  const cartTotal = cartLineItems.reduce(
    (total, item) => total + Number(item.quantity) * Number(item.price),
    0
  )

  return (
    <Sheet>
      <SheetTrigger asChild className="transition-all duration-300 ease-in-out">
        <Button
          aria-label="Pokaż koszyk"
          variant="outline"
          size="icon"
          className="relative size-8 shrink-0"
        >
          {itemCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -right-2 -top-2 size-6 justify-center rounded-full p-2.5"
            >
              {itemCount}
            </Badge>
          )}
          <Icons.shoppingCart className="size-4" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 transition-all duration-300 ease-in-out sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Koszyk {itemCount > 0 && `(${itemCount})`}</SheetTitle>
          <Separator />
        </SheetHeader>

        {itemCount > 0 ? (
          <>
            <CartLineItems items={cartLineItems} className="" />
            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Wysyłka</span>
                  <span>Gratis</span>
                </div>
                <div className="flex">
                  <span className="flex-1">VAT</span>
                  <span>Przejdź do podsumowania</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Suma</span>
                  <span>{formatPrice(cartTotal.toFixed(2))}</span>
                </div>
              </div>
              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    aria-label="View your cart"
                    href="/cart"
                    className={buttonVariants({
                      size: "sm",
                      className: "w-full",
                    })}
                  >
                    Przejdź do podsumowania
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <Icons.shoppingCart
              className="mb-4 size-16 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="text-xl font-medium text-muted-foreground">
              Twój koszyk jest pusty
            </p>

            {/*  */}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
