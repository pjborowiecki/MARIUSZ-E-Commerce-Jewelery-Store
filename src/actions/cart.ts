"use server"

import { cookies } from "next/headers"

import { db } from "@/config/db"

export async function getCart() {
  const cartId = cookies().get("cartId")?.value
  if (!cartId || isNaN(Number(cartId))) return []

  const cartLineItems = await db.query.carts.findFirst({
    columns: {
      items: true,
    },
    // where: eq(carts.id, Number(cartId)),
  })

  return cartLineItems
}

// TODO: Implement
export async function addToCart() {}
