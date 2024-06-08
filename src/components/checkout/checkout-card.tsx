import Link from "next/link"
import { getCart } from "@/actions/cart"

import { cn, formatPrice } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CartLineItems } from "@/components/checkout/cart-line-items"

export async function CheckoutCard(): Promise<JSX.Element> {
  const cartLineItems = await getCart()

  return (
    <Card>
      <CardHeader className="flex grow items-center space-x-4 py-4">
        <CardTitle className="line-clamp-1 flex-1">TODO: Title</CardTitle>
        {/* TODO: Podsumowanie lub finalizacja zamówienia */}
        <Link
          href="/podsumowanie"
          aria-label="Podsymowanie"
          className={cn(buttonVariants({ size: "sm" }), "")}
        >
          Podsumowanie
        </Link>
      </CardHeader>

      <Separator className="mb-4" />

      <CardContent className="pb-6 pl-6 pr-0">
        <CartLineItems items={cartLineItems} className="max-h-[280px]" />
      </CardContent>

      <Separator className="mb-4" />

      <CardFooter className="space-x-4">
        <span className="flex-1">
          Suma ({cartLineItems.reduce((acc, item) => acc + item.quantity, 0)})
        </span>
        <span>
          {formatPrice(
            cartLineItems.reduce(
              (acc, item) => acc + Number(item.price) * item.quantity,
              0
            )
          )}
        </span>
      </CardFooter>
    </Card>
  )
}
