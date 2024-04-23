import * as z from "zod"

import { categories } from "@/db/schema"

export const categoryIdSchema = z
  .string({
    required_error: "Id produktu jest wymagane",
    invalid_type_error: "Dane wejściowe muszą być tekstem",
  })
  .min(1, {
    message: "Id musi mieć przynajmniej 1 znak",
  })
  .max(32, {
    message: "Id może mieć maksymalnie 32 znaki",
  })

export const categoryNameSchema = z
  .string({
    required_error: "Nazwa kategorii jest wymagana",
    invalid_type_error: "Nazwa musi być tekstem",
  })
  .min(3, {
    message: "Nazwa musi składać się z przynajmniej 3 znaków",
  })
  .max(32, {
    message: "Nazwa może składać się z maksymalnie 32 znaków",
  })

export const categorySchema = z.object({
  name: categoryNameSchema,
  description: z
    .string({
      invalid_type_error: "Dane wejściowe muszą być tekstem",
    })
    .optional(),
  visibility: z
    .enum(categories.visibility.enumValues, {
      required_error: "To pole jest wymagane",
      invalid_type_error:
        "Widoczność musi być jedną z predefiniowanych wartości typu string",
    })
    .default("widoczna"),
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

export const subcategorySchema = z.object({
  name: categoryNameSchema,
  description: z
    .string({
      invalid_type_error: "Dane wejściowe muszą być tekstem",
    })
    .optional(),
  categoryName: categoryNameSchema,
})

export const addCategorySchema = categorySchema

export const addSubcategorySchema = subcategorySchema

export const addCategoryFunctionSchema = categorySchema
  .omit({
    images: true,
  })
  .extend({
    images: z
      .array(z.object({ id: z.string(), name: z.string(), url: z.string() }))
      .nullable(),
  })

export const getCategoryByIdSchema = z.object({
  id: categoryIdSchema,
})

export const getSubcategoryByIdSchema = z.object({
  id: categoryIdSchema,
})

export const getCategoryByNameSchema = z.object({
  name: categoryNameSchema,
})

export const getSubcategoryByNameSchema = z.object({
  name: categoryNameSchema,
})

export const getSubcategoriesByCategoryIdSchema = z.object({
  id: categoryIdSchema,
})

export const getSubcategoriesByCategoryNameSchema = z.object({
  name: categoryNameSchema,
})

export const updateCategorySchema = categorySchema
  .omit({
    images: true,
  })
  .extend({
    id: categoryIdSchema,
    images: z
      .array(z.object({ id: z.string(), name: z.string(), url: z.string() }))
      .nullable(),
  })

export const updateSubcategorySchema = subcategorySchema.extend({
  id: categoryIdSchema,
})

export const deleteCategorySchema = z.object({
  id: categoryIdSchema,
})

export const deleteSubcategorySchema = z.object({
  id: categoryIdSchema,
})

export const filterCategorySchema = z.object({
  name: categoryNameSchema,
})

export const checkIfCategoryNameTakenSchema = z.object({
  name: categoryNameSchema,
})

export const checkIfCategoryExistsSchema = z.object({
  id: categoryIdSchema,
})

export const checkIfSubcategoryExistsSchema = z.object({
  id: categoryIdSchema,
})

export type GetCategoryByIdInput = z.infer<typeof getCategoryByIdSchema>

export type GetSubcategoryByIdInput = z.infer<typeof getSubcategoryByIdSchema>

export type GetCategoryByNameInput = z.infer<typeof getCategoryByNameSchema>

export type GetSubcategoryByNameInput = z.infer<
  typeof getSubcategoryByNameSchema
>

export type GetSubcategoriesByCategoryIdInput = z.infer<
  typeof getSubcategoriesByCategoryIdSchema
>

export type GetSubcategoriesByCategoryNameInput = z.infer<
  typeof getSubcategoriesByCategoryNameSchema
>

export type AddCategoryInput = z.infer<typeof addCategorySchema>

export type AddSubcategoryInput = z.infer<typeof addSubcategorySchema>

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>

export type UpdateSubcategoryInput = z.infer<typeof updateSubcategorySchema>

export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>

export type DeleteSubcategoryInput = z.infer<typeof deleteSubcategorySchema>

export type CheckIfCategoryExistsInput = z.infer<
  typeof checkIfCategoryExistsSchema
>

export type CheckIfSubcategoryExistsInput = z.infer<
  typeof checkIfSubcategoryExistsSchema
>

export type CheckIfCategoryNameTakenInput = z.infer<
  typeof checkIfCategoryNameTakenSchema
>
