import { eq, sql } from "drizzle-orm"

import { db } from "@/config/db"
import { categories } from "@/db/schema"

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
  .prepare("psDeleteAllCategories")

export const psCheckIfCategoryNameTaken = db.query.categories
  .findFirst({
    columns: {
      id: true,
    },
    where: eq(categories.name, sql.placeholder("name")),
  })
  .prepare("psCheckIfCategoryNameTaken")

export const psCheckIfCategoryExists = db.query.categories
  .findFirst({
    columns: {
      id: true,
    },
    where: eq(categories.id, sql.placeholder("id")),
  })
  .prepare("psCheckIfCategoryExists")
