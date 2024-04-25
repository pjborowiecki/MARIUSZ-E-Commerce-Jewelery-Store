import { count, eq, sql } from "drizzle-orm"

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

// TODO (limit, order, etc. Perhaps move to category page to use search props)
export const psGetAllProductsByCategoryId = db
  .select()
  .from(products)
  .where(eq(products.categoryId, sql.placeholder("id")))
  .prepare("psGetAllProductsByCategoryId")

// TODO (limit, order, etc. Perhaps mote to category page to use search props)
export const psGetAllProductsByCategoryName = db
  .select()
  .from(products)
  .where(eq(products.categoryName, sql.placeholder("name")))
  .prepare("psGetAllProductsByCategoryName")

export const psGetProductCountByCategoryName = db
  .select({
    count: count(products.id),
  })
  .from(products)
  .where(eq(products.categoryName, sql.placeholder("name")))
  .prepare("psGetProductCountByCategoryName")

export const psGetProductCountByCategoryId = db
  .select({
    count: count(products.id),
  })
  .from(products)
  .where(eq(products.categoryId, sql.placeholder("id")))
  .prepare("psGetProductCountByCategoryId")

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
