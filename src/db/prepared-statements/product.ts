import { eq, sql } from "drizzle-orm"

import { db } from "@/config/db"
import { products } from "@/db/schema"

export const psGetProductById = db
  .select()
  .from(products)
  .where(eq(products.id, sql.placeholder("id")))
  .prepare("psGetProductById")

export const psGetProductByName = db
  .select()
  .from(products)
  .where(eq(products.name, sql.placeholder("name")))
  .prepare("psGetProductByName")

export const psGetAllProducts = db
  .select()
  .from(products)
  .prepare("psGetAllProducts")

// TODO
export const psGetAllProductsByCategoryId = db
  .select()
  .from(products)
  .prepare("psGetAllProductsByCategoryId")

// TODO
export const psGetAllProductsByCategoryName = db
  .select()
  .from(products)
  .prepare("psGetAllProductsByCategoryName")

export const psDeleteProductById = db
  .delete(products)
  .where(eq(products.id, sql.placeholder("id")))
  .prepare("psDeleteProductById")

export const psDeleteAllProducts = db
  .delete(products)
  .prepare("psDeleteAllProducts")

export const psCheckIfProductNameTaken = db.query.products
  .findFirst({
    columns: {
      id: true,
    },
    where: eq(products.name, sql.placeholder("name")),
  })
  .prepare("psCheckIfProductNameTaken")

export const psCheckIfProductExists = db.query.products
  .findFirst({
    columns: {
      id: true,
    },
    where: eq(products.id, sql.placeholder("id")),
  })
  .prepare("psCheckIfProductExists")

//   TODO: Get products by TagId, TagName, TagsIds, TagNames (array of arguments?)
