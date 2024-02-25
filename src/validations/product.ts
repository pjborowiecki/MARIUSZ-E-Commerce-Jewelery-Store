import * as z from "zod"

// TODO: Think about how to define categories and subcategories

export const productSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
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

export type AddProductInput = z.infer<typeof productSchema>
