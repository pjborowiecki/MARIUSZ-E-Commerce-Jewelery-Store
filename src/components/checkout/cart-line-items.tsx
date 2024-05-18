import Image from "next/image"
import { Slot } from "@radix-ui/react-slot"

import { type CartLineItem } from "@/validations/cart"

import { cn, formatPrice } from "@/lib/utils"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { UpdateCart } from "@/components/checkout/update-cart"
import { Icons } from "@/components/icons"

interface CartLineItemsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: CartLineItem[]
  isScrollable?: boolean
  isEditable?: boolean
  variant?: "default" | "minimal"
}

export function CartLineItems({
  items,
  isScrollable = true,
  isEditable = true,
  variant = "default",
  className,
  ...props
}: Readonly<CartLineItemsProps>) {
  const Comp = isScrollable ? ScrollArea : Slot

  return (
    <Comp className="h-full">
      <div
        className={cn(
          "flex w-full flex-col gap-4",
          isScrollable && "pr-6",
          className
        )}
        {...props}
      >
        {items.map((item) => (
          <div key={item.id} className="space-y-3">
            <div
              className={cn(
                "flex items-start justify-between gap-4",
                isEditable && "xs:flex-row flex-col"
              )}
            >
              <div></div>
              {isEditable ? (
                <UpdateCart cartLineItem={item} />
              ) : ()}
            </div>
            {variant === "default" ?? <Separator />}
          </div>
        ))}
      </div>
    </Comp>
  )
}
