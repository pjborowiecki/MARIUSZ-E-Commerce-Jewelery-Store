import * as z from "zod"

export const tagSchema = z.object({
  name: z.string().min(3).max(64),
})

export const getTagByIdSchema = z.object({
  id: z
    .string({
      required_error: "Id tagu jest wymagane",
      invalid_type_error: "Dane wejściowe muszą być tekstem",
    })
    .min(1, {
      message: "Id musi mieć przynajmniej 1 znak",
    })
    .max(512, {
      message: "Id musi mieć maksymalnie 512 znaków",
    }),
})

export const getTagByNameSchema = z.object({
  name: z.string({
    required_error: "Nazwa tagu jest wymagana",
    invalid_type_error: "Dane wejściowe muszą być tekstem",
  }),
})

export type GetTagByIdInput = z.infer<typeof getTagByIdSchema>
export type GetTagByNameInput = z.infer<typeof getTagByNameSchema>
