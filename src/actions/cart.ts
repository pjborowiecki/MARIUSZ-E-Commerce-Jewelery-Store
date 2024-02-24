"use server"

import { unstable_noStore as noStore } from "next/cache"
import { cookies } from "next/headers"
import { carts, products } from "@/db/schema"
import type { CartLineItem } from "@/validations/cart"
import { eq } from "drizzle-orm"

import { db } from "@/config/db"

export async function getCart(): Promise<CartLineItem[]> {
  const cartId = cookies().get("cartId")?.value
  if (!cartId || isNaN(Number(cartId))) return []

  const cart = await db.query.carts.findFirst({
    columns: {
      items: true,
    },
    where: eq(carts.id, Number(cartId)),
  })

  return cartLineItems
}
