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
  isScrollable,
  isEditable,
  variant,
  className,
  ...props
}: CartLineItemsProps) {
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
        TODO
      </div>
    </Comp>
  )
}
