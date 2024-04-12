"use server"

import crypto from "crypto"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import bcryptjs from "bcryptjs"
import { eq } from "drizzle-orm"

import { db } from "@/config/db"
import {
  psCheckIfUserExists,
  psDeleteUserById,
  psGetUserByEmail,
  psGetUserByEmailVerificationToken,
  psGetUserById,
  psGetUserByResetPasswordToken,
} from "@/db/prepared-statements/user"
import { users, type User } from "@/db/schema"
import {
  addUserAsAdminSchema,
  checkIfUserExistsSchema,
  deleteUserSchema,
  getUserByEmailSchema,
  getUserByEmailVerificationTokenSchema,
  getUserByIdSchema,
  getUserByResetPasswordTokenSchema,
  updateUserAsAdminSchema,
  type AddUserAsAdminInput,
  type CheckIfUserExistsInput,
  type DeleteUserInput,
  type GetUserByEmailInput,
  type GetUserByEmailVerificationTokenInput,
  type GetUserByIdInput,
  type GetUserByResetPasswordTokenInput,
  type UpdateUserAsAdminInput,
} from "@/validations/user"

export async function getUserById(
  rawInput: GetUserByIdInput
): Promise<User | null> {
  try {
    const validatedInput = getUserByIdSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [user] = await psGetUserById.execute({ id: validatedInput.data.id })
    return user || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting user by id")
  }
}

export async function getUserByEmail(
  rawInput: GetUserByEmailInput
): Promise<User | null> {
  try {
    const validatedInput = getUserByEmailSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [user] = await psGetUserByEmail.execute({
      email: validatedInput.data.email,
    })
    return user || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting user by email")
  }
}

export async function getUserByResetPasswordToken(
  rawInput: GetUserByResetPasswordTokenInput
): Promise<User | null> {
  try {
    const validatedInput = getUserByResetPasswordTokenSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [user] = await psGetUserByResetPasswordToken.execute({
      token: validatedInput.data.token,
    })
    return user || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting user by reset password token")
  }
}

export async function getUserByEmailVerificationToken(
  rawInput: GetUserByEmailVerificationTokenInput
): Promise<User | null> {
  try {
    const validatedInput =
      getUserByEmailVerificationTokenSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [user] = await psGetUserByEmailVerificationToken.execute({
      token: validatedInput.data.token,
    })
    return user || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting user by email verification token")
  }
}

export async function checkIfUserExists(
  rawInput: CheckIfUserExistsInput
): Promise<"invalid-input" | boolean> {
  try {
    const validatedInput = checkIfUserExistsSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    noStore()
    const exists = await psCheckIfUserExists.execute({
      id: validatedInput.data.id,
    })

    return exists ? true : false
  } catch (error) {
    console.error(error)
    throw new Error("Error checking if user exists")
  }
}

export async function addUserAsAdmin(
  rawInput: AddUserAsAdminInput
): Promise<"invalid-input" | "exists" | "error" | "success"> {
  try {
    const validatedInput = addUserAsAdminSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const user = await getUserByEmail({ email: validatedInput.data.email })
    if (user) return "exists"

    const passwordHash = await bcryptjs.hash(validatedInput.data.password, 10)

    const newUser = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        role: validatedInput.data.role,
        name: validatedInput.data.name,
        surname: validatedInput.data.surname,
        email: validatedInput.data.email,
        emailVerified: new Date(),
        passwordHash,
      })
      .returning()

    return newUser ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error adding user as admin")
  }
}

export async function updateUserAsAdmin(
  rawInput: UpdateUserAsAdminInput
): Promise<"invalid-input" | "not-found" | "error" | "success"> {
  try {
    const validatedInput = updateUserAsAdminSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const exists = await checkIfUserExists({ id: validatedInput.data.id })
    if (!exists || exists === "invalid-input") return "not-found"

    noStore()
    const updatedUser = await db
      .update(users)
      .set({
        role: validatedInput.data.role,
      })
      .where(eq(users.id, validatedInput.data.id))
      .returning()

    revalidatePath("/admin/uzytkownicy")
    // TODO: Update the path
    revalidatePath("/panel-klienta/dane")

    return updatedUser ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error updating user as admin")
  }
}

export async function updateUserAsCustomer() {}

export async function deleteUserAsAdmin(
  rawInput: DeleteUserInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = deleteUserSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const deleted = await psDeleteUserById.execute({
      id: validatedInput.data.id,
    })

    revalidatePath("/admin/uzytkownicy")
    return deleted ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error deleting user")
  }
}

export async function deleteUserAsCustomer() {}
