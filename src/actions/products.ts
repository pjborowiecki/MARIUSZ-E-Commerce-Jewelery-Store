"use server"

import { unstable_noStore as noStore } from "next/cache"
import {
  psDeleteProductById,
  psGetProductById,
} from "@/db/prepared-statements/product"
import type { Product } from "@/db/schema"
import {
  getProductByIdSchema,
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

export async function deleteProduct() {}
