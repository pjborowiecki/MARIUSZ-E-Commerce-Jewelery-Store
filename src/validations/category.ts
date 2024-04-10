import * as z from "zod"

export const categoryIdSchema = z
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

export const categoryNameSchema = z
  .string({
    required_error: "Nazwa kategorii jest wymagana",
    invalid_type_error: "Nazwa musi być tekstem",
  })
  .min(3, {
    message: "Nazwa musi składać się z przynajmniej 3 znaków",
  })
  .max(132, {
    message: "Nazwa może składać się z maksymalnie 32 znaków",
  })

export const categorySchema = z.object({
  name: categoryNameSchema,
  description: z
    .string({
      invalid_type_error: "Dane wejściowe muszą być tekstem",
    })
    .optional(),
  menuItem: z
    .boolean({
      required_error: "Ta informacja jest wymagana",
      invalid_type_error: "dane wejściowe muszą być typu boolean",
    })
    .default(true),
  parentId: z
    .string({
      invalid_type_error: "Dane wejściowe muszą być tekstem",
    })
    .max(512, {
      message: "Id kategorii musi mieć maksymalnie 512 znaków",
    })
    .optional()
    .nullable(),
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

export const extendedCategorySchema = categorySchema.extend({
  images: z
    .array(z.object({ id: z.string(), name: z.string(), url: z.string() }))
    .nullable(),
})

export const getCategoryByIdSchema = z.object({
  id: categoryIdSchema,
})

export const getCategoryByNameSchema = z.object({
  name: categoryNameSchema,
})

export const updateCategoryFormSchema = categorySchema

export const updateCategoryFunctionSchema = extendedCategorySchema.extend({
  id: categoryIdSchema,
})

export const deleteCategorySchema = z.object({
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

export type GetCategoryByIdInput = z.infer<typeof getCategoryByIdSchema>

export type GetCategoryByNameInput = z.infer<typeof getCategoryByNameSchema>

export type AddCategoryInput = z.infer<typeof categorySchema>

export type UpdateCategoryFormInput = z.infer<typeof updateCategoryFormSchema>

export type UpdateCategoryFunctionInput = z.infer<
  typeof updateCategoryFunctionSchema
>

export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>

export type CheckIfCategoryExistsInput = z.infer<
  typeof checkIfCategoryExistsSchema
>

export type CheckIfCategoryNameTakenInput = z.infer<
  typeof checkIfCategoryNameTakenSchema
>
