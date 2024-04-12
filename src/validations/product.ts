import * as z from "zod"

import { products } from "@/db/schema"

export const productIdSchema = z
  .string({
    required_error: "Id produktu jest wymagane",
    invalid_type_error: "Dane wejściowe muszą być tekstem",
  })
  .min(1, {
    message: "Id musi mieć przynajmniej 1 znak",
  })
  .max(512, {
    message: "Id może mieć maksymalnie 512 znaków",
  })

export const productNameSchema = z
  .string({
    required_error: "Nazwa produktu jest wymagana",
    invalid_type_error: "Nazwa musi być tekstem",
  })
  .min(3, {
    message: "Nazwa musi składać się z przynajmniej 3 znaków",
  })
  .max(128, {
    message: "Nazwa może składać się z maksymalnie 128 znaków",
  })

export const productSchema = z.object({
  name: productNameSchema,
  description: z
    .string({
      invalid_type_error: "Opis musi być tekstem",
    })
    .optional(),
  category: z
    .enum(products.category.enumValues, {
      required_error: "Kategoria jest wymagana",
      invalid_type_error:
        "Kategoria musi być jedną z predefiniowanych wartości typu string",
    })
    .default(products.category.enumValues[0]),
  subcategory: z.string().optional().nullable(),
  price: z
    .string({
      required_error: "Cena jest wymagana",
      invalid_type_error: "Cena musi być tekstem",
    })
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: "Nieprawidłowy format. Spróbuj z kropką, np. 120.99",
    }),
  inventory: z.number().min(0, { message: "Ilość nie może być ujemna" }),
  images: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false
      if (val.some((file) => !(file instanceof File))) return false
      return true
    }, "Dane wejściowe muszą być szeregiem elementów typu File")
    .optional()
    .nullable()
    .default(null),
})

export const extendedProductSchema = productSchema.extend({
  images: z
    .array(z.object({ id: z.string(), name: z.string(), url: z.string() }))
    .nullable(),
})

export const getProductsSchema = z.object({
  limit: z.number().default(10),
  offset: z.number().default(0),
  categories: z.string().optional().nullable(),
  subcategories: z.string().optional().nullable(),
  sort: z.string().optional().nullable(),
  price_range: z.string().optional().nullable(),
  active: z.string().optional().nullable(),
})

export const getProductByIdSchema = z.object({
  id: productIdSchema,
})

export const getProductByNameSchema = z.object({
  name: productNameSchema,
})

export const updateProductFormSchema = productSchema

export const updateProductFunctionSchema = extendedProductSchema.extend({
  id: productIdSchema,
})

export const deleteProductSchema = z.object({
  id: productIdSchema,
})

export const filterProductSchema = z.object({
  query: z.string(),
})

export const checkIfProductNameTakenSchema = z.object({
  name: productNameSchema,
})

export const checkIfProductExistsSchema = z.object({
  id: productIdSchema,
})

export type GetProductByIdInput = z.infer<typeof getProductByIdSchema>

export type GetProductByNameInput = z.infer<typeof getProductByNameSchema>

export type GetProductsInput = z.infer<typeof getProductsSchema>

export type AddProductInput = z.infer<typeof productSchema>

export type UpdateProductFormInput = z.infer<typeof updateProductFormSchema>

export type UpdateProductFunctionInput = z.infer<
  typeof updateProductFunctionSchema
>

export type DeleteProductInput = z.infer<typeof deleteProductSchema>

export type FilterProductInput = z.infer<typeof filterProductSchema>

export type CheckIfProductExistsInput = z.infer<
  typeof checkIfProductExistsSchema
>

export type CheckIfProductNameTakenInput = z.infer<
  typeof checkIfProductNameTakenSchema
>
