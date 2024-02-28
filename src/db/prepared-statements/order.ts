import { eq, sql } from "drizzle-orm"

import { db } from "@/config/db"
import { orders } from "@/db/schema"

export const psGetOrderById = db
  .select()
  .from(orders)
  .where(eq(orders.id, sql.placeholder("id")))
  .prepare("psGetOrderById")
