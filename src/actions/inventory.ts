"use server"

import { unstable_noStore as noStore } from "next/cache"
import {
  psDeleteAllCategories,
  psDeleteAllProducts,
  psDeleteAllTags,
  psDeleteCategoryById,
  psDeleteProductById,
  psDeleteTagById,
  psGetAllCategories,
  psGetAllProducts,
  psGetAllTags,
  psGetCategoryById,
  psGetCategoryByName,
  psGetProductById,
  psGetProductByName,
  psGetTagById,
  psGetTagByName,
} from "@/db/prepared-statements/inventory"
import { categories, type Category } from "@/db/schema"
import {
  categorySchema,
  getCategoryByIdSchema,
  getCategoryByNameSchema,
  type AddCategoryInput,
  type GetCategoryByIdInput,
  type GetCategoryByNameInput,
} from "@/validations/inventory"

import { db } from "@/config/db"

export async function getAllCategories(): Promise<Category[]> {
  try {
    noStore()
    const categories = await psGetAllCategories.execute()
    return categories
  } catch (error) {
    console.error(error)
    throw new Error("Error getting all categories")
  }
}

export async function getCategoryById(
  rawInput: GetCategoryByIdInput
): Promise<Category> {
  try {
    const validatedInput = getCategoryByIdSchema.safeParse(rawInput)
    if (!validatedInput.success) return

    noStore()
    const [category] = await psGetCategoryById.execute({
      id: validatedInput.data.id,
    })
    return category
  } catch (error) {
    console.error(error)
    throw new Error("Error getting category by Id")
  }
}

export async function getCategoryByName(
  rawInput: GetCategoryByNameInput
): Promise<Category> {
  try {
    const validatedInput = getCategoryByNameSchema.safeParse(rawInput)
    if (!validatedInput.success) return

    noStore()
    const [category] = await psGetCategoryByName.execute({
      name: validatedInput.data.name,
    })
    return category
  } catch (error) {
    console.error(error)
    throw new Error("Error getting category by name")
  }
}

export async function addCategory(
  rawInput: AddCategoryInput
): Promise<"invalid-input" | "exists" | "error" | "success"> {
  try {
    const validatedInput = categorySchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    return "success"
  } catch (error) {
    console.error(error)
    throw new Error("Error adding category")
  }
}

export async function editCategory() {}

export async function deleteCategory() {}

export async function getAllTags() {}

export async function getTagById() {}

export async function getTagByName() {}

export async function addTag() {}

export async function editTag() {}

export async function deleteTag() {}
