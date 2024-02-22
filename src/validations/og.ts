import * as z from "zod"

export const ogImageSchema = z.object({
  title: z
    .string({
      required_error: "Tytuł jest wymagany",
      invalid_type_error: "Nieprawidłowy typ danych",
    })
    .max(60, "Tytuł nie może mieć więcej niż 60 znaków"),
  description: z
    .string({
      invalid_type_error: "Nieprawidłowy typ danych",
    })
    .max(1024, "Opis nie może mieć więcej niż 160 znaków")
    .optional(),
  type: z
    .string({
      invalid_type_error: "Nieprawidłowy typ danych",
    })
    .max(128, {
      message: "Typ nie może mieć więcej niż 60 znaków",
    })
    .optional(),
  mode: z.enum(["light", "dark"]).default("dark"),
})
