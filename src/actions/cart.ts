"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { asc, eq, inArray } from "drizzle-orm"

import { db } from "@/config/db"
import { psDeleteCartById, psGetCartById } from "@/db/prepared-statements/cart"
import { psCheckIfProductInStock } from "@/db/prepared-statements/product"
import { carts, products } from "@/db/schema"
import {
  addToCartSchema,
  deleteCartItemSchema,
  deleteCartItemsSchema,
  getCartItemsSchema,
  updateCartItemSchema,
  type AddToCartInput,
  type CartItem,
  type CartLineItem,
  type DeleteCartItemInput,
  type DeleteCartItemsInput,
  type GetCartItemsInput,
  type UpdateCartItemInput,
} from "@/validations/cart"

import { generateId } from "@/lib/utils"

export async function getCart(): Promise<CartLineItem[]> {
  try {
    const cartId = cookies().get("cartId")?.value
    if (!cartId) return []

    noStore()
    const cart = await psGetCartById.execute({ cartId })

    const productIds = cart?.items?.map((item) => item.productId) ?? []
    if (productIds.length === 0) return []

    const uniqueProductIds = [...new Set(productIds)]

    // Might need to update to reflect new db schema
    const cartLineItems = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        inventory: products.inventory,
        categoryName: products.categoryName,
        subcategoryName: products.subcategoryName,
      })
      .from(products)
      .where(inArray(products.id, uniqueProductIds))
      .groupBy(products.id)
      .orderBy(asc(products.createdAt))
      .execute()
      .then((items) => {
        return items.map((item) => {
          const quantity = cart?.items?.find(
            (cartItem) => cartItem.productId === item.id
          )?.quantity

          return {
            ...item,
            quantity: quantity ?? 0,
          }
        })
      })

    return cartLineItems ?? []
  } catch (error) {
    console.error(error)
    return []
  }
}

// TODO: Check return types, especially for errors
export async function deleteCartItem(
  rawInput: DeleteCartItemInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = deleteCartItemSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const cartId = cookies().get("cartId")?.value
    if (!cartId) return "error"

    noStore()
    const cart = await psGetCartById.execute({ cartId })
    if (!cart) return "error"

    cart.items =
      cart.items?.filter(
        (item) => item.productId !== validatedInput.data.productId
      ) ?? []

    noStore()
    const updatedCart = await db
      .update(carts)
      .set({
        items: cart.items,
      })
      .where(eq(carts.id, cartId))

    revalidatePath("/")

    return updatedCart ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error deleting cart item")
  }
}

// TODO: Check return types, especially for errors
export async function addToCart(
  rawInput: AddToCartInput
): Promise<"invalid-input" | "out-of-stock" | "error" | CartItem[]> {
  try {
    const validatedInput = addToCartSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    noStore()
    const product = await psCheckIfProductInStock.execute({
      id: validatedInput.data.productId,
    })

    if (!product || product.inventory < validatedInput.data.quantity)
      return "out-of-stock"

    const cartId = cookies().get("cartId")?.value

    if (!cartId) {
      noStore()
      const cart = await db
        .insert(carts)
        .values({
          id: generateId(128),
          items: [
            {
              productId: validatedInput.data.productId,
              quantity: validatedInput.data.quantity,
            },
          ],
        })
        .returning({ insertedId: carts.id })

      cookies().set("cartId", String(cart[0]?.insertedId))
      revalidatePath("/")

      // return [
      //   {
      //     productId: validatedInput.data.productId,
      //     quantity: validatedInput.data.quantity,
      //   },
      // ]
    }

    //** Handling expired carts */
    noStore()
    const cart = await psGetCartById.execute({ cartId })
    if (!cart) {
      cookies().set({
        name: "cartId",
        value: "",
        expires: new Date(0),
      })

      await psDeleteCartById.execute({ cartId })
      return "error"
    }

    //** Deleting carts on cart sheet close and creating new ones on cart sheet open */
    if (cart.closed) {
      await psDeleteCartById.execute({ cartId })

      const newCart = await db.insert(carts).values({
        items: [validatedInput.data],
      })
    }

    //* */
    const cartItem = cart.items?.find(
      (item) => item.productId === validatedInput.data.productId
    )

    if (cartItem) {
      cartItem.quantity += validatedInput.data.quantity
    } else {
      cart.items?.push(validatedInput.data)
    }

    await db
      .update(carts)
      .set({
        items: cart.items,
      })
      .where(eq(carts.id, cartId))

    revalidatePath("/")
    return cart.items
  } catch (error) {
    console.error(error)
    throw new Error("Error adding to cart")
  }
}

// TODO: Check return types, especially for errors
export async function deleteCart(): Promise<"error" | "success"> {
  try {
    const cartId = cookies().get("cartId")?.value
    if (!cartId) return "error"

    noStore()
    const deletedCart = await psDeleteCartById.execute({ cartId })

    revalidatePath("/")
    return deletedCart ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error deleting cart")
  }
}

// TODO: Check return types, especially for errors
export async function updateCartItem(
  rawInput: UpdateCartItemInput
): Promise<"invalid-input" | "error" | CartItem[]> {
  try {
    const validatedInput = updateCartItemSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const cartId = cookies().get("cartId")?.value
    if (!cartId) return "error"

    const cart = await psGetCartById.execute({ cartId })
    if (!cart || !cart.items) return "error"

    const cartItem = cart.items?.find(
      (item) => item.productId === validatedInput.data.productId
    )
    if (!cartItem) return "error"

    if (validatedInput.data.quantity === 0) {
      cart.items =
        cart.items?.filter(
          (item) => item.productId !== validatedInput.data.productId
        ) ?? []
    } else {
      cartItem.quantity = validatedInput.data.quantity
    }

    const updatedCart = await db
      .update(carts)
      .set({
        items: cart.items,
      })
      .where(eq(carts.id, cartId))
      .returning()

    revalidatePath("/")
    return updatedCart ? cart.items : []
  } catch (error) {
    console.error(error)
    throw new Error("Error updating cart item")
  }
}

// TODO: Check return types, especially for errors
export async function getCartItems(
  rawInput: GetCartItemsInput
): Promise<"invalid-input" | CartItem[]> {
  try {
    const validatedInput = getCartItemsSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    if (!validatedInput.data.cartId) return []

    noStore()
    const cart = await psGetCartById.execute({
      cartId: validatedInput.data.cartId,
    })

    return cart?.items ?? []
  } catch (error) {
    console.error(error)
    throw new Error("Error getting cart items")
  }
}

// TODO: Check return types, especially on errors ([])
export async function deleteCartItems(
  rawInput: DeleteCartItemsInput
): Promise<"invalid-input" | "error" | CartItem[]> {
  try {
    const validatedInput = deleteCartItemsSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const cartId = cookies().get("cartId")?.value
    if (!cartId) return "error"

    noStore()
    const cart = await psGetCartById.execute({ cartId })
    if (!cart) return "error"

    cart.items =
      cart.items?.filter(
        (item) => !validatedInput.data.productIds.includes(item.productId)
      ) ?? []

    const updatedCart = await db.update(carts).set({
      items: cart.items,
    })

    revalidatePath("/")
    return updatedCart ? cart.items : []
  } catch (error) {
    console.error(error)
    throw new Error("Error deleting cart items")
  }
}
