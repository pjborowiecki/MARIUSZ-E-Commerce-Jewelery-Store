"use server"

import crypto from "crypto"

import { unstable_noStore as noStore } from "next/cache"
import { getUserByEmail } from "@/actions/user"
import { eq } from "drizzle-orm"

import { env } from "@/env.mjs"
import { db } from "@/config/db"
import { resend } from "@/config/email"
import { users } from "@/db/schema"
import {
  checkIfEmailVerifiedSchema,
  emailVerificationSchema,
  markEmailAsVerifiedSchema,
  type CheckIfEmailVerifiedInput,
  type EmailVerificationFormInput,
  type MarkEmailAsVerifiedInput,
} from "@/validations/email"

import { EmailVerificationEmail } from "@/components/emails/email-verification-email"

export async function resendEmailVerificationLink(
  rawInput: EmailVerificationFormInput
): Promise<"invalid-input" | "not-found" | "verified" | "error" | "success"> {
  try {
    const validatedInput = emailVerificationSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const user = await getUserByEmail({ email: validatedInput.data.email })
    if (!user) return "not-found"
    if (user.emailVerified) return "verified"

    const emailVerificationToken = crypto.randomBytes(32).toString("base64url")

    const userUpdated = await db
      .update(users)
      .set({ emailVerificationToken })
      .where(eq(users.email, validatedInput.data.email))

    const emailSent = await resend.emails.send({
      from: env.RESEND_EMAIL_FROM,
      to: [validatedInput.data.email],
      subject: "Weryfikacja adresu email",
      react: EmailVerificationEmail({
        email: validatedInput.data.email,
        emailVerificationToken,
      }),
    })

    return userUpdated && emailSent ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error resending email verification link")
  }
}

export async function checkIfEmailVerified(
  rawInput: CheckIfEmailVerifiedInput
): Promise<boolean> {
  try {
    const validatedInput = checkIfEmailVerifiedSchema.safeParse(rawInput)
    if (!validatedInput.success) return false

    noStore()
    const user = await getUserByEmail({ email: validatedInput.data.email })
    return user?.emailVerified instanceof Date ? true : false
  } catch (error) {
    console.error(error)
    throw new Error("Error checking if email verified")
  }
}

export async function markEmailAsVerified(
  rawInput: MarkEmailAsVerifiedInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = markEmailAsVerifiedSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const userUpdated = await db
      .update(users)
      .set({
        emailVerified: new Date(),
        emailVerificationToken: null,
      })
      .where(eq(users.emailVerificationToken, validatedInput.data.token))

    return userUpdated ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error marking email as verified")
  }
}
