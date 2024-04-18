"use server"

import {
  unstable_cache as cache,
  unstable_noStore as noStore,
  revalidatePath,
} from "next/cache"
import type { SearchParams, StoredFile } from "@/types"
import { and, eq, not } from "drizzle-orm"

import { db } from "@/config/db"
import {
  psCheckIfCategoryExists,
  psCheckIfCategoryNameTaken,
  psCheckIfSubcategoryExists,
  psDeleteCategoryById,
  psDeleteSubcategoryById,
  psGetAllCategories,
  psGetAllSubcategories,
  psGetCategoryById,
  psGetCategoryByName,
  psGetSubcategoryById,
  psGetSubcategoryByName,
} from "@/db/prepared-statements/category"
import {
  categories,
  subcategories,
  type Category,
  type Subcategory,
} from "@/db/schema"
import {
  addCategoryFunctionSchema,
  addSubcategorySchema,
  checkIfCategoryExistsSchema,
  checkIfCategoryNameTakenSchema,
  checkIfSubcategoryExistsSchema,
  deleteCategorySchema,
  deleteSubcategorySchema,
  getCategoryByIdSchema,
  getCategoryByNameSchema,
  getSubcategoryByIdSchema,
  updateCategorySchema,
  updateSubcategorySchema,
  type AddCategoryInput,
  type AddSubcategoryInput,
  type CheckIfCategoryExistsInput,
  type CheckIfCategoryNameTakenInput,
  type CheckIfSubcategoryExistsInput,
  type DeleteCategoryInput,
  type DeleteSubcategoryInput,
  type GetCategoryByIdInput,
  type GetCategoryByNameInput,
  type GetSubcategoryByIdInput,
  type UpdateCategoryInput,
  type UpdateSubcategoryInput,
} from "@/validations/category"

import { generateId } from "@/lib/utils"

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

export async function getSubcategoryById(
  rawInput: GetSubcategoryByIdInput
): Promise<Subcategory | null> {
  try {
    const validatedInput = getSubcategoryByIdSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [category] = await psGetSubcategoryById.execute({
      id: validatedInput.data.id,
    })
    return category || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting subcategory by Id")
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

export async function getAllCategories(): Promise<Category[]> {
  try {
    return await psGetAllCategories.execute()
  } catch (error) {
    console.error(error)
    throw new Error("Error getting all categories")
  }
}

export async function getAllSubcategories(): Promise<Subcategory[]> {
  try {
    return await psGetAllSubcategories.execute()
  } catch (error) {
    console.error(error)
    throw new Error("Error getting all subcategories")
  }
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
    throw new Error("Error checking if category exists")
  }
}

export async function checkIfSubcategoryExists(
  rawInput: CheckIfSubcategoryExistsInput
): Promise<"invalid-input" | boolean> {
  try {
    const validatedInput = checkIfSubcategoryExistsSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    noStore()
    const exists = await psCheckIfSubcategoryExists.execute({
      id: validatedInput.data.id,
    })

    return exists ? true : false
  } catch (error) {
    console.error(error)
    throw new Error("Error checking if subcategory exists")
  }
}

export async function addCategory(
  rawInput: AddCategoryInput
): Promise<"invalid-input" | "exists" | "error" | "success"> {
  try {
    const validatedInput = addCategoryFunctionSchema.safeParse(rawInput)
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
        description: validatedInput.data.description,
        visibility: validatedInput.data.visibility,
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

export async function addSubcategory(
  rawInput: AddSubcategoryInput
): Promise<"invalid-input" | "exists" | "error" | "success"> {
  try {
    const validatedInput = addSubcategorySchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    noStore()
    const nameTaken = await db.query.subcategories.findFirst({
      columns: {
        id: true,
        categoryName: true,
      },
      where: and(
        eq(subcategories.name, validatedInput.data.name.toLowerCase()),
        eq(subcategories.categoryName, validatedInput.data.categoryName)
      ),
    })
    if (nameTaken) return "exists"

    noStore()
    const newCategory = await db
      .insert(subcategories)
      .values({
        id: generateId(),
        name: validatedInput.data.name.toLowerCase(),
        description: validatedInput.data.description,
        categoryName: validatedInput.data.categoryName,
      })
      .returning()

    revalidatePath("/")
    revalidatePath("/admin/podkategorie")
    return newCategory ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error adding subcategory")
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

export async function deleteSubcategory(
  rawInput: DeleteSubcategoryInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = deleteSubcategorySchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const deleted = await psDeleteSubcategoryById.execute({
      id: validatedInput.data.id,
    })

    revalidatePath("/admin/podkategorie")
    return deleted ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error deleting subcategory")
  }
}

export async function updateCategory(
  rawInput: UpdateCategoryInput
): Promise<"invalid-input" | "not-found" | "error" | "success"> {
  try {
    const validatedInput = updateCategorySchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const exists = await checkIfCategoryExists({ id: validatedInput.data.id })
    if (!exists || exists === "invalid-input") return "not-found"

    noStore()
    const updatedCategory = await db
      .update(categories)
      .set({
        name: validatedInput.data.name,
        description: validatedInput.data.description,
        visibility: validatedInput.data.visibility,
      })
      .where(eq(categories.id, validatedInput.data.id))
      .returning()

    revalidatePath("/")
    revalidatePath("/admin/kategorie")

    return updatedCategory ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error updating category")
  }
}

export async function updateSubcategory(
  rawInput: UpdateSubcategoryInput
): Promise<"invalid-input" | "not-found" | "exists" | "error" | "success"> {
  try {
    const validatedInput = updateSubcategorySchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const exists = await checkIfSubcategoryExists({
      id: validatedInput.data.id,
    })
    if (!exists || exists === "invalid-input") return "not-found"

    noStore()
    const newNameTaken = await db.query.subcategories.findFirst({
      columns: {
        id: true,
        categoryName: true,
      },
      where: and(
        eq(subcategories.name, validatedInput.data.name.toLowerCase()),
        eq(subcategories.categoryName, validatedInput.data.categoryName),
        not(eq(subcategories.id, validatedInput.data.id))
      ),
    })
    if (newNameTaken) return "exists"

    noStore()
    const updatedSubcategory = await db
      .update(subcategories)
      .set({
        name: validatedInput.data.name,
        description: validatedInput.data.description,
      })
      .where(eq(subcategories.id, validatedInput.data.id))
      .returning()

    revalidatePath("/")
    revalidatePath("/admin/podkategorie")

    return updatedSubcategory ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error updating subcategory")
  }
}
