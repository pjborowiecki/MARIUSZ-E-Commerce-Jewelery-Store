import * as z from "zod"

export const productSchema = z.object({
  name: z.string(),
  description: z.string(),
  images: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false
      if (val.some((file) => !(file instanceof File))) return false
      return true
    }, "Must be an array of File")
    .optional()
    .nullable()
    .default(null),
})

export type AddProductInput = z.infer<typeof productSchema>
