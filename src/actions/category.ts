"use server"

import {
  unstable_cache as cache,
  unstable_noStore as noStore,
  revalidatePath,
} from "next/cache"
import type { SearchParams, StoredFile } from "@/types"
import { desc, eq } from "drizzle-orm"

import { db } from "@/config/db"
import {
  psCheckIfCategoryExists,
  psCheckIfCategoryNameTaken,
  psDeleteCategoryById,
  psGetCategoryById,
  psGetCategoryByName,
} from "@/db/prepared-statements/category"
import { categories, subcategories, type Category } from "@/db/schema"
import {
  addCategorySchema,
  checkIfCategoryExistsSchema,
  checkIfCategoryNameTakenSchema,
  deleteCategorySchema,
  getCategoryByIdSchema,
  getCategoryByNameSchema,
  type AddCategoryInput,
  type CheckIfCategoryExistsInput,
  type CheckIfCategoryNameTakenInput,
  type DeleteCategoryInput,
  type GetCategoryByIdInput,
  type GetCategoryByNameInput,
} from "@/validations/category"

import { generateId, slugify } from "@/lib/utils"

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

export async function getCategories() {
  return await cache(
    async () => {
      return db
        .selectDistinct({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
        })
        .from(categories)
        .orderBy(desc(categories.name))
    },
    ["categories"],
    {
      revalidate: 3600, // every hour
      tags: ["categories"],
    }
  )()
}

export async function getSubcategories() {
  return await cache(
    async () => {
      return db
        .selectDistinct({
          id: subcategories.id,
          name: subcategories.name,
          slug: subcategories.slug,
          description: subcategories.description,
        })
        .from(subcategories)
    },
    ["subcategories"],
    {
      revalidate: 3600, // every hour
      tags: ["subcategories"],
    }
  )()
}

export async function getSubcategoriesByCategory({
  categoryId,
}: {
  categoryId: string
}) {
  return await cache(
    async () => {
      return db
        .selectDistinct({
          id: subcategories.id,
          name: subcategories.name,
          slug: subcategories.slug,
          description: subcategories.description,
        })
        .from(subcategories)
        .where(eq(subcategories.id, categoryId))
    },
    [`subcategories-${categoryId}`],
    {
      revalidate: 3600, // every hour
      tags: [`subcategories-${categoryId}`],
    }
  )()
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
  rawInput: Omit<AddCategoryInput, "images"> & {
    images: StoredFile[] | null
  }
): Promise<"invalid-input" | "exists" | "error" | "success"> {
  try {
    const validatedInput = addCategorySchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    noStore()
    const nameTaken = await psCheckIfCategoryNameTaken.execute({
      name: validatedInput.data.name.toLowerCase(),
    })
    if (nameTaken) return "exists"

    noStore()
    const newCategory = await db
      .insert(categories)
      .values({
        id: generateId(),
        name: validatedInput.data.name.toLowerCase(),
        slug: slugify(validatedInput.data.name.toLowerCase()),
        description: validatedInput.data.description,
        menuItem: validatedInput.data.menuItem,
        images: JSON.stringify(rawInput.images) as unknown as StoredFile[],
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
  rawInput: UpdateCategoryInput
): Promise<"invalid-input" | "not-found" | "error" | "success"> {
  try {
    const validatedInput = updateCategorySchema.safeParse(rawInput)
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
