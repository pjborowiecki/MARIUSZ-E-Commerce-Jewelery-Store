import * as z from "zod"

import { products } from "@/db/schema"

// TODO: Improve validations and messages

// TODO: Expecially the subcategory part (perhaps, z.array of ids or names ?)
export const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
  subcategory: z.string().optional().nullable(),
})

export const cartLineItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  // category: z.enum(products.category.enumValues),
  //   subcategory: z.enum(products.subcategory.enumValues),
  subcategory: z.string().optional().nullable(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  inventory: z.number().default(0),
  quantity: z.number(),
  //   storeId: z.string(),
  //   storeName: z.string().optional().nullable(),
  //   storeStripeAccountId: z.string().optional().nullable(),
  images: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        url: z.string(),
      })
    )
    .optional()
    .nullable(),
})

export const updateCartItemSchema = z.object({
  quantity: z.number().min(0).default(1),
})

export const deleteCartItemSchema = z.object({
  productId: z.string(),
})

export const deleteCartItemsSchema = z.object({
  productIds: z.array(z.string()),
})

export const checkoutItemSchema = cartItemSchema.extend({
  price: z.number(),
})

export type CartItem = z.infer<typeof cartItemSchema>

export type CartLineItem = z.infer<typeof cartLineItemSchema>

export type CheckoutItem = z.infer<typeof checkoutItemSchema>
