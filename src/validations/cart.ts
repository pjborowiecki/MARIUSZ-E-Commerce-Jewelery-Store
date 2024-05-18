import * as z from "zod"

export const cartIdSchema = z
  .string({
    required_error: "Id koszyka jest wymagane",
    invalid_type_error: "Dane wejściowe muszą być tekstem",
  })
  .max(128, {
    message: "Id nie może mieć więcej niż 128 znaków",
  })

export const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(0),
  subcategoryName: z.string().optional().nullable(),
})

export const getCartItemsSchema = z.object({
  cartId: cartIdSchema.optional(),
})

export const checkoutItemSchema = cartItemSchema.extend({
  price: z.number(),
})

// TODO: Might need to update to reflect new db schema
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
  categoryName: z.string().optional().nullable(),
  subcategoryName: z.string().optional().nullable(),
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

export const updateCartItemSchema = cartItemSchema

export const updateCartItemsSchema = z.object({
  quantity: z.number().min(0).default(1),
})

export const addToCartSchema = cartItemSchema

export type CartItem = z.infer<typeof cartItemSchema>
export type CheckoutItem = z.infer<typeof checkoutItemSchema>
export type CartLineItem = z.infer<typeof cartLineItemSchema>

export type GetCartItemsInput = z.infer<typeof getCartItemsSchema>

export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>
export type UpdateCartItemsInput = z.infer<typeof updateCartItemsSchema>

export type DeleteCartItemInput = z.infer<typeof deleteCartItemSchema>
export type DeleteCartItemsInput = z.infer<typeof deleteCartItemsSchema>

export type AddToCartInput = z.infer<typeof addToCartSchema>
