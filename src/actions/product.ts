"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { and, count, desc, eq } from "drizzle-orm"

import { db } from "@/config/db"
import { psGetCategoryByName } from "@/db/prepared-statements/category"
import {
  psCheckIfProductExists,
  psCheckIfProductNameTaken,
  psDeleteProductById,
  psGetAllProducts,
  psGetAllProductsByCategoryId,
  psGetAllProductsByCategoryName,
  psGetProductById,
  psGetProductByName,
  psGetProductCountByCategoryId,
  psGetProductCountByCategoryName,
} from "@/db/prepared-statements/product"
import { categories, products, subcategories, type Product } from "@/db/schema"
import {
  addProductFunctionSchema,
  checkIfProductExistsSchema,
  checkIfProductNameTakenSchema,
  deleteProductSchema,
  filterProductsSchema,
  getProductByIdSchema,
  getProductByNameSchema,
  getProductCountByCategoryIdSchema,
  getProductCountByCategoryNameSchema,
  updateProductSchema,
  type AddProductInput,
  type CheckIfProductExistsInput,
  type CheckIfProductNameTakenInput,
  type DeleteProductInput,
  type FilterProductsInput,
  type GetProductByIdInput,
  type GetProductByNameInput,
  type GetProductCountByCategoryIdInput,
  type GetProductCountByCategoryNameInput,
  type UpdateProductInput,
} from "@/validations/product"

import { generateId } from "@/lib/utils"

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

// TODO
export async function getAllProducts() {
  try {
    console.log("getAllProducts called")
  } catch (error) {
    console.error(error)
    throw new Error("Error getting all products")
  }
}

// TODO
export async function getAllProductsByCategoryName(): Promise<Product[]> {
  try {
    const selectedProducts = await db.select().from(products).where(eq())

    return selectedProducts ?? []
  } catch (error) {
    console.error(error)
    throw new Error("Error getting all products by category name")
  }
}

// TODO
export async function getAllProductsByCategoryId() {
  try {
    console.log("getAllProductsByCategoryId called")
  } catch (error) {
    console.error(error)
    throw new Error("Error getting all products by category Id")
  }
}

export async function getProductCountByCategoryName(
  rawInput: GetProductCountByCategoryNameInput
): Promise<number> {
  try {
    const validatedInput =
      getProductCountByCategoryNameSchema.safeParse(rawInput)
    if (!validatedInput.success) return 0

    noStore()
    const [productCount] = await psGetProductCountByCategoryName.execute({
      name: validatedInput.data.name,
    })

    return productCount ? productCount.count : 0
  } catch (error) {
    console.error(error)
    throw new Error("Error getting product count by category name")
  }
}

export async function getProductCountByCategoryId(
  rawInput: GetProductCountByCategoryIdInput
): Promise<number> {
  try {
    const validatedInput = getProductCountByCategoryIdSchema.safeParse(rawInput)
    if (!validatedInput.success) return 0

    noStore()
    const [productCount] = await psGetProductCountByCategoryId.execute({
      id: validatedInput.data.id,
    })

    return productCount ? productCount.count : 0
  } catch (error) {
    console.error(error)
    throw new Error("Error getting product count by category Id")
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    noStore()
    const featuredProducts = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        state: products.state,
        categoryName: products.categoryName,
        subcategoryName: products.subcategoryName,
        categoryId: products.categoryId,
        subcategoryId: products.subcategoryId,
        tags: products.tags,
        price: products.price,
        inventory: products.inventory,
        images: products.images,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .limit(10)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .groupBy(products.id, categories.name)
      .orderBy(desc(products.createdAt), desc(count(products.images)))

    return featuredProducts
  } catch (error) {
    console.error(error)
    throw new Error("Error getting featured products")
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
    const validatedInput = addProductFunctionSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    noStore()
    const nameTaken = await psCheckIfProductNameTaken.execute({
      name: validatedInput.data.name,
    })
    if (nameTaken) return "exists"

    const [category] = await psGetCategoryByName.execute({
      name: validatedInput.data.categoryName,
    })

    const subcategory = await db.query.subcategories.findFirst({
      columns: {
        id: true,
        name: true,
        categoryName: true,
      },
      where: and(
        eq(subcategories.name, validatedInput.data.subcategoryName),
        eq(subcategories.categoryName, validatedInput.data.categoryName)
      ),
    })

    if (!category || !subcategory) return "error"

    const newProduct = await db
      .insert(products)
      .values({
        id: generateId(),
        name: validatedInput.data.name.toLowerCase(),
        description: validatedInput.data.description,
        state: validatedInput.data.state,
        categoryName: validatedInput.data.categoryName.toLowerCase(),
        subcategoryName: validatedInput.data.subcategoryName.toLowerCase(),
        categoryId: category.id,
        subcategoryId: subcategory.id,
        price: validatedInput.data.price,
        inventory: validatedInput.data.inventory,
        images: validatedInput.data.images,
      })
      .returning()

    if (newProduct) {
      revalidatePath("/")
      revalidatePath("/admin/produkty")
      return "success"
    } else {
      return "error"
    }
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
    if (!exists || exists === "invalid-input") return "not-found"

    const [category] = await psGetCategoryByName.execute({
      name: validatedInput.data.categoryName,
    })

    const subcategory = await db.query.subcategories.findFirst({
      columns: {
        id: true,
        name: true,
        categoryName: true,
      },
      where: and(
        eq(subcategories.name, validatedInput.data.subcategoryName),
        eq(subcategories.categoryName, validatedInput.data.categoryName)
      ),
    })

    if (!category || !subcategory) return "error"

    // TODO: Handle image update
    noStore()
    const updatedProduct = await db
      .update(products)
      .set({
        name: validatedInput.data.name,
        description: validatedInput.data.description,
        state: validatedInput.data.state,
        categoryName: validatedInput.data.categoryName,
        subcategoryName: validatedInput.data.subcategoryName,
        categoryId: category.id,
        subcategoryId: subcategory.id,
        price: validatedInput.data.price,
        inventory: validatedInput.data.inventory,
        // images: validatedInput.data.images,
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

export async function filterProducts(rawInput: FilterProductsInput) {
  try {
    const validatedInput = filterProductsSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    if (validatedInput.data.query.length === 0) {
      return {
        data: null,
        error: null,
      }
    }

    noStore()
    const categoriesWithProducts = await db.query.categories.findMany({
      columns: {
        id: true,
        name: true,
      },
      with: {
        products: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
      where: (table, { sql }) =>
        sql`position(${validatedInput.data.query} in ${table.name}) > 0`,
    })

    return {
      data: categoriesWithProducts,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: "Error filtering products",
    }
  }
}
