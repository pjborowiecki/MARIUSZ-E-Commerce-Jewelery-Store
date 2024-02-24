import * as z from "zod"

// TODO: Decide whether Ids are needed or not

export const tagSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(3).max(64),
})

export const subcategorySchema = z.object({
  name: z.string().min(3).max(64),
  description: z.string().optional().nullable(),
  categoryId: z.array(z.string()),
})

export const categorySchema = z.object({
  name: z.string().min(3).max(64),
  description: z.string().optional().nullable(),
  //   subcategories: z.array(subcategorySchema),
})

export type AddCategoryInput = z.infer<typeof categorySchema>
