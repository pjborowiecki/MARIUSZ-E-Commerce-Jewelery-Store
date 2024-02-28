import * as z from "zod"

export const getOrderByIdSchema = z.object({
  id: z.string(),
})

export const getOrderLineItemsSchema = z.object({
  items: z.string().optional(),
})

export const verifyOrderSchema = z.object({
  deliveryPostalCode: z
    .string({
      required_error: "Kod pocztowy jest wymagany",
      invalid_type_error: "Kod pocztowy musi być tekstem",
    })
    .min(1, {
      message: "Proszę podać poprawny kod pocztowy",
    }),
})

export type GetOrderByIdInput = z.infer<typeof getOrderByIdSchema>
export type GetOrderLineItemsInput = z.infer<typeof getOrderLineItemsSchema>
