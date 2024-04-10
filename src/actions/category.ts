"use server"

import crypto from "crypto"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { db } from "@/config/db"
import {
  psCheckIfCategoryExists,
  psCheckIfCategoryNameTaken,
  psDeleteCategoryById,
  psGetCategoryById,
  psGetCategoryByName,
} from "@/db/prepared-statements/category"
import { categories, type Category } from "@/db/schema"
import {
  checkIfCategoryExistsSchema,
  checkIfCategoryNameTakenSchema,
  deleteCategorySchema,
  extendedCategorySchema,
  getCategoryByIdSchema,
  getCategoryByNameSchema,
  updateCategoryFunctionSchema,
  type AddCategoryInput,
  type CheckIfCategoryExistsInput,
  type CheckIfCategoryNameTakenInput,
  type DeleteCategoryInput,
  type GetCategoryByIdInput,
  type GetCategoryByNameInput,
  type UpdateCategoryFunctionInput,
} from "@/validations/category"

export async function getCategoryById(
  rawInput: GetCategoryByIdInput
): Promise<Category | null> {
  try {
    const validatedInput = getCategoryByIdSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [category] = await psGetCategoryById.execute({
      id: validatedInput.data.id,
    })
    return category || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting category by Id")
  }
}

export async function checkIfCategoryNameTaken(
  rawInput: CheckIfCategoryNameTakenInput
): Promise<"invalid-input" | boolean> {
  try {
    const validatedInput = checkIfCategoryNameTakenSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    noStore()
    const nameTaken = await psCheckIfCategoryNameTaken.execute({
      name: validatedInput.data.name,
    })

    return nameTaken ? true : false
  } catch (error) {
    console.error(error)
    throw new Error("Error checking if category name taken")
  }
}

export async function getCategoryByName(
  rawInput: GetCategoryByNameInput
): Promise<Category | null> {
  try {
    const validatedInput = getCategoryByNameSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [category] = await psGetCategoryByName.execute({
      name: validatedInput.data.name,
    })
    return category || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting category by name")
  }
}

export async function checkIfCategoryExists(
  rawInput: CheckIfCategoryExistsInput
): Promise<"invalid-input" | boolean> {
  try {
    const validatedInput = checkIfCategoryExistsSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    noStore()
    const exists = await psCheckIfCategoryExists.execute({
      id: validatedInput.data.id,
    })

    return exists ? true : false
  } catch (error) {
    console.error(error)
    throw new Error("Error checking if product exists")
  }
}

export async function addCategory(
  rawInput: AddCategoryInput
): Promise<"invalid-input" | "exists" | "error" | "success"> {
  try {
    const validatedInput = extendedCategorySchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    noStore()
    const nameTaken = await psCheckIfCategoryNameTaken.execute({
      name: validatedInput.data.name,
    })
    if (nameTaken) return "exists"

    noStore()
    const newCategory = await db
      .insert(categories)
      .values({
        id: crypto.randomUUID(),
        name: validatedInput.data.name,
        description: validatedInput.data.description,
        menuItem: validatedInput.data.menuItem,
        images: validatedInput.data.images,
      })
      .returning()

    revalidatePath("/")
    revalidatePath("/admin/kategorie")
    return newCategory ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error adding category")
  }
}

export async function deleteCategory(
  rawInput: DeleteCategoryInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = deleteCategorySchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const deleted = await psDeleteCategoryById.execute({
      id: validatedInput.data.id,
    })

    revalidatePath("/admin/kategorie")
    return deleted ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error deleting category")
  }
}

export async function updateCategory(
  rawInput: UpdateCategoryFunctionInput
): Promise<"invalid-input" | "not-found" | "error" | "success"> {
  try {
    const validatedInput = updateCategoryFunctionSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const exists = await checkIfCategoryExists({ id: validatedInput.data.id })
    if (!exists) return "not-found"

    noStore()
    const updatedCategory = await db
      .update(categories)
      .set({
        name: validatedInput.data.name,
        description: validatedInput.data.description,
        menuItem: validatedInput.data.menuItem,
        images: validatedInput.data.images,
      })
      .where(eq(categories.id, validatedInput.data.id))
      .returning()

    revalidatePath("/")
    revalidatePath("/admin/kategorie")

    return updatedCategory ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error updating product")
  }
}
