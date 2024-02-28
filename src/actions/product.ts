"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"

import {
  psDeleteProductById,
  psGetProductById,
} from "@/db/prepared-statements/product"
import type { Product } from "@/db/schema"
import {
  deleteProductByIdSchema,
  getProductByIdSchema,
  type DeleteProductByIdInput,
  type GetProductByIdInput,
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

export async function deleteProduct(
  rawInput: DeleteProductByIdInput
): Promise<"error" | "success"> {
  try {
    const validatedInput = deleteProductByIdSchema.safeParse(rawInput)
    if (!validatedInput.success) return "error"

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
