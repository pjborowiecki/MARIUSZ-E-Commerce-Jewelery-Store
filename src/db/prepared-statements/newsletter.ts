import { newsletterSubscribers } from "@/db/schema"
import { eq, sql } from "drizzle-orm"

import { db } from "@/config/db"

export const psGetNewsletterSubscriberByEmail = db
  .select()
  .from(newsletterSubscribers)
  .where(eq(newsletterSubscribers.email, sql.placeholder("email")))
  .prepare("psGetNewsletterSubscriberByEmail")
