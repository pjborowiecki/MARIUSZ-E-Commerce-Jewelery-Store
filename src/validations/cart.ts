import * as z from "zod"

import { products } from "@/db/schema"

export const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(0),
  subcategory: z.string().optional(),
})

export const checkoutItemSchema = cartItemSchema.extend({
  price: z.number(),
})

export const cartLineItemSchema = z.object({
  id: z.string(),
  name: z.string(),
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
  category: z.string().optional().nullable(),
  subcategory: z.string().optional().nullable(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  inventory: z.number().default(0),
  quantity: z.number(),
})

export const deleteCartItemSchema = z.object({
  productId: z.string(),
})

export const deleteCartItemsSchema = z.object({
  productIds: z.array(z.string()),
})

export const updateCartItemSchema = z.object({
  quantity: z.number().min(0).default(1),
})

export type CartItem = z.infer<typeof cartItemSchema>
export type CheckoutItem = z.infer<typeof checkoutItemSchema>
export type CartLineItem = z.infer<typeof cartLineItemSchema>
export type DeleteCartItemInput = z.infer<typeof deleteCartItemSchema>
export type DeleteCartItemsInput = z.infer<typeof deleteCartItemsSchema>
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>
