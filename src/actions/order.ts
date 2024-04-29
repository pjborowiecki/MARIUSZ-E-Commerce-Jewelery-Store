"use server"

import { unstable_noStore as noStore } from "next/cache"
import { cookies } from "next/headers"
import { and, asc, desc, eq, gte, inArray, like, lte, sql } from "drizzle-orm"
import type Stripe from "stripe"
import * as z from "zod"

import { db } from "@/config/db"
import { psGetOrderById } from "@/db/prepared-statements/order"
import {
  addresses,
  carts,
  orders,
  payments,
  products,
  type Order,
} from "@/db/schema"
import type { CartLineItem, CheckoutItem } from "@/validations/cart"
import { checkoutItemSchema } from "@/validations/cart"
import {
  getOrderByIdSchema,
  type GetOrderByIdInput,
  type GetOrderLineItemsInput,
} from "@/validations/order"

export async function getOrderById(
  rawInput: GetOrderByIdInput
): Promise<Order | null> {
  try {
    const validatedInput = getOrderByIdSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [order] = await psGetOrderById.execute({ id: validatedInput.data.id })
    return order || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting order by Id")
  }
}

export async function getOrderLineItems(
  rawInput: GetOrderLineItemsInput & {
    paymentIntent?: Stripe.Response<Stripe.PaymentIntent> | null
  }
): Promise<CartLineItem[]> {
  try {
    const safeParsedItems = z
      .array(checkoutItemSchema)
      .safeParse(JSON.parse(rawInput.items ?? "[]"))

    if (!safeParsedItems.success) throw new Error("Error parsing order items")

    // TODO: Check fields
    const lineItems = await db
      .select({
        id: products.id,
        name: products.name,
        images: products.images,
        categoryName: products.categoryName,
        subcategoryName: products.subcategoryName,
        price: products.price,
        inventory: products.inventory,
      })
      .from(products)
      .where(
        inArray(
          products.id,
          safeParsedItems.data.map((item) => item.productId)
        )
      )
      .groupBy(products.id)
      .orderBy(desc(products.createdAt))
      .execute()
      .then((items) => {
        return items.map((item) => {
          const quantity = safeParsedItems.data.find(
            (checkoutItem) => checkoutItem.productId === item.id
          )?.quantity

          return {
            ...item,
            quantity: quantity ?? 0,
          }
        })
      })

    // Temporary workaround for payment_intent.succeeded webhook event not firing in production
    // TODO: Remove this, when the webook starts to work
    if (rawInput.paymentIntent?.status === "succeeded") {
      const cartId = String(cookies().get("cartId")?.value)

      const cart = await db.query.carts.findFirst({
        columns: {
          closed: true,
          paymentIntentId: true,
          clientSecret: true,
        },
        where: eq(carts.id, cartId),
      })

      if (!cart || cart.closed || !cart.clientSecret || !cart.paymentIntentId)
        return lineItems

      const payment = await db.query.payments.findFirst({
        columns: {
          stripeAccountId: true,
        },
        // TODO: Ensure this does not cause issues
        // where: eq(payments.storeId, input.storeId),
      })

      if (!payment?.stripeAccountId) return lineItems

      // Create new address in DB
      const stripeAddress = rawInput.paymentIntent.shipping?.address

      const newAddress = await db.insert(addresses).values({
        line1: stripeAddress?.line1,
        line2: stripeAddress?.line2,
        city: stripeAddress?.city,
        state: stripeAddress?.state,
        country: stripeAddress?.country,
        postalCode: stripeAddress?.postal_code,
      })

      if (!newAddress.insertId) throw new Error("No address created.")

      // Create new order in db
      await db.insert(orders).values({
        items: input.items as unknown as CheckoutItem[],
        quantity: safeParsedItems.data.reduce(
          (acc, item) => acc + item.quantity,
          0
        ),
        amount: String(Number(input.paymentIntent.amount) / 100),
        stripePaymentIntentId: input.paymentIntent.id,
        stripePaymentIntentStatus: input.paymentIntent.status,
        name: input.paymentIntent.shipping?.name,
        email: input.paymentIntent.receipt_email,
        addressId: String(newAddress.insertId),
      })

      // Update product inventory in db
      for (const item of safeParsedItems.data) {
        const product = await db.query.products.findFirst({
          columns: {
            id: true,
            inventory: true,
          },
          where: eq(products.id, item.productId),
        })

        if (!product) return lineItems

        const inventory = product.inventory - item.quantity

        if (inventory < 0) return lineItems

        await db
          .update(products)
          .set({
            inventory: product.inventory - item.quantity,
          })
          .where(eq(products.id, item.productId))
      }

      await db
        .update(carts)
        .set({
          closed: true,
          items: [],
        })
        .where(eq(carts.paymentIntentId, cart.paymentIntentId))
    }

    return lineItems
  } catch (error) {
    console.error(error)
    return []
  }
}
