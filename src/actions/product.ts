"use server"

import crypto from "crypto"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { db } from "@/config/db"
import {
  psCheckIfProductExists,
  psCheckIfProductNameTaken,
  psDeleteProductById,
  psGetProductById,
  psGetProductByName,
} from "@/db/prepared-statements/product"
import { products, type Product } from "@/db/schema"
import {
  checkIfProductExistsSchema,
  checkIfProductNameTakenSchema,
  deleteProductSchema,
  extendedProductSchema,
  getProductByIdSchema,
  getProductByNameSchema,
  updateProductSchema,
  type AddProductInput,
  type CheckIfProductExistsInput,
  type CheckIfProductNameTakenInput,
  type DeleteProductInput,
  type GetProductByIdInput,
  type GetProductByNameInput,
  type UpdateProductInput,
} from "@/validations/product"

export async function getProductById(
  rawInput: GetProductByIdInput
): Promise<Product | null> {
  try {
    const validatedInput = getProductByIdSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [product] = await psGetProductById.execute({
      id: validatedInput.data.id,
    })
    return product || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting product by Id")
  }
}

export async function getProductByName(
  rawInput: GetProductByNameInput
): Promise<Product | null> {
  try {
    const validatedInput = getProductByNameSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [product] = await psGetProductByName.execute({
      name: validatedInput.data.name,
    })

    return product || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting product by name")
  }
}

export async function checkIfProductNameTaken(
  rawInput: CheckIfProductNameTakenInput
): Promise<"invalid-input" | boolean> {
  try {
    const validatedInput = checkIfProductNameTakenSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    noStore()
    const nameTaken = await psCheckIfProductNameTaken.execute({
      name: validatedInput.data.name,
    })

    return nameTaken ? true : false
  } catch (error) {
    console.error(error)
    throw new Error("Error checking if product name taken")
  }
}

export async function checkIfProductExists(
  rawInput: CheckIfProductExistsInput
): Promise<"invalid-input" | boolean> {
  try {
    const validatedInput = checkIfProductExistsSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    noStore()
    const exists = await psCheckIfProductExists.execute({
      id: validatedInput.data.id,
    })

    return exists ? true : false
  } catch (error) {
    console.error(error)
    throw new Error("Error checking if product exists")
  }
}

export async function addProduct(
  rawInput: AddProductInput
): Promise<"invalid-input" | "exists" | "error" | "success"> {
  try {
    const validatedInput = extendedProductSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    noStore()
    const nameTaken = await psCheckIfProductNameTaken.execute({
      name: validatedInput.data.name,
    })
    if (nameTaken) return "exists"

    const newProduct = await db
      .insert(products)
      .values({
        id: crypto.randomUUID(),
        name: validatedInput.data.name,
        description: validatedInput.data.description,
        category: validatedInput.data.category,
        subcategory: validatedInput.data.subcategory,
        price: validatedInput.data.price,
        inventory: validatedInput.data.inventory,
        images: validatedInput.data.images,
      })
      .returning()

    revalidatePath("/")
    revalidatePath("/admin/produkty")
    return newProduct ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error adding product")
  }
}

export async function deleteProduct(
  rawInput: DeleteProductInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = deleteProductSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const deleted = await psDeleteProductById.execute({
      id: validatedInput.data.id,
    })

    revalidatePath("/admin/produkty")
    return deleted ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error deleting product by Id")
  }
}

export async function updateProduct(
  rawInput: UpdateProductInput
): Promise<"invalid-input" | "not-found" | "error" | "success"> {
  try {
    const validatedInput = updateProductSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const exists = await checkIfProductExists({ id: validatedInput.data.id })
    if (!exists) return "not-found"

    const updatedProduct = await db
      .update(products)
      .set({
        name: validatedInput.data.name,
        description: validatedInput.data.description,
        category: validatedInput.data.category,
        subcategory: validatedInput.data.subcategory,
        price: validatedInput.data.price,
        inventory: validatedInput.data.inventory,
        images: validatedInput.data.images,
      })
      .where(eq(products.id, validatedInput.data.id))
      .returning()

    revalidatePath("/")
    revalidatePath("/admin/produkty")

    return updatedProduct ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error updating product")
  }
}
