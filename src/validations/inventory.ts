import * as z from "zod"

export const tagSchema = z.object({
  name: z.string().min(3).max(64),
})

export const categorySchema = z.object({
  name: z
    .string({
      required_error: "Nazwa kategorii jest wymagana",
      invalid_type_error: "Dane wejściowe muszą być tekstem",
    })
    .min(3, {
      message: "Nazwa kategorii musi mieć co najmniej 3 znaki",
    })
    .max(64, {
      message: "Nazwa kategorii może mieć maksymalnie 64 znaki",
    }),
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
  topLevel: z
    .boolean({
      required_error: "Ta informacja jest wymagana",
      invalid_type_error: "Dane wejściowe muszą być typu boolean",
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

export const getCategoryByIdSchema = z.object({
  id: z
    .string({
      required_error: "Id kategorii jest wymagany",
      invalid_type_error: "Dane wejściowe muszą być tekstem",
    })
    .min(1, {
      message: "Id musi mieć przynajmniej 1 znak",
    })
    .max(512, {
      message: "Id musi mieć maksymalnie 512 znaków",
    }),
})

export const getCategoryByNameSchema = z.object({
  name: z.string({
    required_error: "Nazwa kategorii jest wymagana",
    invalid_type_error: "Dane wejściowe muszą być tekstem",
  }),
})

export type AddCategoryInput = z.infer<typeof categorySchema>

export type GetCategoryByIdInput = z.infer<typeof getCategoryByIdSchema>

export type GetCategoryByNameInput = z.infer<typeof getCategoryByNameSchema>
