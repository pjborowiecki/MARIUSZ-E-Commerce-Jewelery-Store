import { eq, sql } from "drizzle-orm"

import { db } from "@/config/db"
import { carts } from "@/db/schema"

export const psGetCartById = db.query.carts
  .findFirst({ where: eq(carts.id, sql.placeholder("cartId")) })
  .prepare("psGetCartById")

export const psDeleteCartById = db
  .delete(carts)
  .where(eq(carts.id, sql.placeholder("cartId")))
  .prepare("psDeleteCartById")
