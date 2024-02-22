import * as z from "zod"

export const emailSchema = z
  .string({
    required_error: "Email jest wymagany",
    invalid_type_error: "Nieprawidłowy typ danych",
  })
  .min(5, {
    message: "Email musi składać się z przynamniej 5 znaków",
  })
  .max(64, {
    message: "Email nie może mieć więcej ni 64 znaków",
  })
  .email({
    message: "Proszę podać poprawny adres email",
  })

export const emailVerificationSchema = z.object({
  email: emailSchema,
})

export const markEmailAsVerifiedSchema = z.object({
  token: z.string(),
})

export const checkIfEmailVerifiedSchema = z.object({
  email: emailSchema,
})

export type EmailVerificationFormInput = z.infer<typeof emailVerificationSchema>

export type MarkEmailAsVerifiedInput = z.infer<typeof markEmailAsVerifiedSchema>

export type CheckIfEmailVerifiedInput = z.infer<
  typeof checkIfEmailVerifiedSchema
>
