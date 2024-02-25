import * as z from "zod"

// TODO: Think about how to define categories and subcategories
// TODO: Adjust to the current db schema

export const productSchema = z.object({
  name: z
    .string({
      required_error: "Nazwa jest wymagana",
      invalid_type_error: "Nazwa musi być tekstem",
    })
    .min(3, {
      message: "Nazwa musi składać się z przynajmniej 3 znaków",
    })
    .max(128, {
      message: "Nazwa może składać się z maksymalnie 128 znaków",
    }),
  description: z
    .string({
      invalid_type_error: "Opis musi być tekstem",
    })
    .optional(),
  categories: z.array(z.string()),
  subcategories: z.array(z.string()),
  images: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false
      if (val.some((file) => !(file instanceof File))) return false
      return true
    }, "Nieprawidłowy typ danych")
    .optional()
    .nullable()
    .default(null),
})

export const getProductByIdSchema = z.object({
  id: z
    .string({
      required_error: "Id produktu jest wymagane",
      invalid_type_error: "Dane wejściowe muszą być tekstem",
    })
    .min(1, {
      message: "Id musi mieć przynajmniej 1 znak",
    })
    .max(512, {
      message: "Id może mieć maksymalnie 512 znaków",
    }),
})

export const getProductByNameSchema = z.object({
  name: z.string({
    required_error: "Nazwa produktu jest wymagana",
    invalid_type_error: "Dane wejściowe muszą być tekstem",
  }),
})

export type GetProductByIdInput = z.infer<typeof getProductByIdSchema>
export type GetProductByNameInput = z.infer<typeof getProductByNameSchema>
export type AddProductInput = z.infer<typeof productSchema>
