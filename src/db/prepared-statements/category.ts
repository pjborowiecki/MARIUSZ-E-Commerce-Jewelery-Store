import { desc, eq, sql } from "drizzle-orm"

import { db } from "@/config/db"
import { categories, subcategories } from "@/db/schema"

export const psGetCategoryById = db
  .select()
  .from(categories)
  .where(eq(categories.id, sql.placeholder("id")))
  .prepare("psGetCategoryById")

export const psGetSubcategoryById = db
  .select()
  .from(subcategories)
  .where(eq(subcategories.id, sql.placeholder("id")))
  .prepare("psGetSubcategoryById")

export const psGetCategoryByName = db
  .select()
  .from(categories)
  .where(eq(categories.name, sql.placeholder("name")))
  .prepare("psGetCategoryByName")

export const psGetSubcategoryByName = db
  .select()
  .from(subcategories)
  .where(eq(subcategories.name, sql.placeholder("name")))
  .prepare("psGetSubcategoryByName")

export const psGetAllCategories = db
  .select()
  .from(categories)
  .orderBy(desc(categories.name))
  .prepare("psGetAllCategories")

export const psGetAllSubcategories = db
  .select()
  .from(subcategories)
  .orderBy(desc(subcategories.name))
  .prepare("psGetAllSubcategories")

export const psDeleteCategoryById = db
  .delete(categories)
  .where(eq(categories.id, sql.placeholder("id")))
  .prepare("psDeleteCategoryById")

export const psDeleteSubcategoryById = db
  .delete(subcategories)
  .where(eq(subcategories.id, sql.placeholder("id")))
  .prepare("psDeleteSubcategoryById")

export const psDeleteAllCategories = db
  .delete(categories)
  .prepare("psDeleteAllCategories")

export const psDeleteAllSubcategories = db
  .delete(subcategories)
  .prepare("psDeleteAllSubcategories")

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

export const psCheckIfSubcategoryExists = db.query.subcategories
  .findFirst({
    columns: {
      id: true,
    },
    where: eq(subcategories.id, sql.placeholder("id")),
  })
  .prepare("psCheckIfSubcategoryExists")
