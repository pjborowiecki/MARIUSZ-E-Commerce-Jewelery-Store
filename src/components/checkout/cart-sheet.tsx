import Link from "next-link"

import { cn, formatPrice } from "@/lib/utils"
import { Button, buttonVariables } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Icons } from "@/components/icons"

export function CartSheet(): JSX.Element {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="Open cart"
          variant="outline"
          size="icon"
          className="relative size-8 shrink-0"
        >
          {/* {itemCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -right-2 -top-2 size-6 justify-center rounded-full p-2.5"
            >
              {itemCount}
            </Badge>
          )} */}
          <Icons.shoppingCart className="size-4" aria-hidden="true" />
        </Button>
      </SheetTrigger>
    </Sheet>
  )
}
