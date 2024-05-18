"use client"

import * as React from "react"
import { deleteCartItem, updateCartItem } from "@/actions/cart"

import type { CartLineItem } from "@/validations/cart"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"

interface UpdateCartProps {
  cartLineItem: CartLineItem
}

export function UpdateCart({
  cartLineItem,
}: Readonly<UpdateCartProps>): JSX.Element {
  const id = React.useId()
  const [isPending, startTransition] = React.useTransition()

  return (
    // justify normal ??
    <div className="xs:w-auto xs:justify-normal flex w-full items-center justify-between space-x-2">
      <div>
        <Button>
          <Icons.minus />
          <span>Remove on item</span>
        </Button>
      </div>
    </div>
  )
}
