import { categories, products, tags } from "@/db/schema"
import { eq, sql } from "drizzle-orm"

import { db } from "@/config/db"

export const psGetCategoryById = db
  .select()
  .from(categories)
  .where(eq(categories.id, sql.placeholder("id")))
  .prepare("psGetCategoryById")

export const psGetCategoryByName = db
  .select()
  .from(categories)
  .where(eq(categories.name, sql.placeholder("name")))
  .prepare("psGetCategoryByName")

export const psGetAllCategories = db
  .select()
  .from(categories)
  .prepare("psGetAllCategories")

export const psDeleteCategoryById = db
  .delete(categories)
  .where(eq(categories.id, sql.placeholder("id")))
  .prepare("psDeleteCategoryById")

export const psDeleteAllCategories = db
  .delete(categories)
  .prepare("psDeleteAllProducts")

export const psGetTagById = db
  .select()
  .from(tags)
  .where(eq(tags.id, sql.placeholder("id")))
  .prepare("psGetTagById")

export const psGetTagByName = db
  .select()
  .from(tags)
  .where(eq(tags.name, sql.placeholder("name")))
  .prepare("psGetTagByName")

export const psGetAllTags = db.select().from(tags).prepare("psGetAllTags")

export const psDeleteTagById = db
  .delete(tags)
  .where(eq(tags.id, sql.placeholder("id")))
  .prepare("psDeleteTagById")

export const psDeleteAllTags = db.delete(tags).prepare("psDeleteAllTags")

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

export const psDeleteProductById = db
  .delete(products)
  .where(eq(products.id, sql.placeholder("id")))
  .prepare("psDeleteProductById")

export const psDeleteAllProducts = db
  .delete(products)
  .prepare("psDeleteAllProducts")

//   TODO: Get products by TagId, TagName, TagsIds, TagNames (array of arguments?)
