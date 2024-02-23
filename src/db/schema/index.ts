import { type StoredFile } from "@/types"
import type { AdapterAccount } from "@auth/core/adapters"
import { relations } from "drizzle-orm"
import {
  decimal,
  integer,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const userRoleEnum = pgEnum("user_role", ["customer", "owner"])

// TODO
export const orderStatusEnum = pgEnum("order_status", [
  "nowe",
  "w trakcie realizacji",
  "oczekuje wysyłki",
  "wysłane",
  "dostarczone",
  "zamknięte",
])

// TODO
export const paymentStatus = pgEnum("payment_status", [
  "nieopłacone",
  "opłacone",
])

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  surname: text("surname"),
  username: text("username").unique(),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  emailVerificationToken: text("emailVerificationToken").unique(),
  passwordHash: text("passwordHash"),
  resetPasswordToken: text("resetPasswordToken").unique(),
  resetPasswordTokenExpiry: timestamp("resetPasswordTokenExpiry", {
    mode: "date",
  }),
  image: text("image"),
  role: userRoleEnum("customer"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
})

export const usersRelations = relations(users, ({ one, many }) => ({
  account: one(accounts, {
    fields: [users.id],
    references: [accounts.userId],
  }),
  session: many(sessions),
}))

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
)

export const newsletterSubscribers = pgTable("newsletterSubscriber", {
  email: text("email").notNull().primaryKey(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
})

export const products = pgTable("product", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  images: json("images").$type<StoredFile[] | null>().default(null),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  inventory: integer("inventory").notNull().default(0),
  tags: json("tags").$type<string[] | null>().default(null),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
})

// TODO
// export const productsRelations = relations(products, ({ one, many }) => ({
//   users: many(products),
// }))

// export const productCategories = pgTable("categories", {
//   id: text("id").notNull().primaryKey(),
//   name: text("name").notNull(),
//   slug: text("slug").notNull(),
//   createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
// })

// export const productSubcategories = pgTable("subCategories", {
//   id: text("id").notNull().primaryKey(),
// }

// TODO
// export const categoriesRelations = relations(categories, () => ({}))

// TODO
// export const subCategories = pgTable("subCategories", {
//   id: text("id").notNull().primaryKey(),
//   name: text("name").notNull(),
// })

// TODO
// export const subCategoriesRelations = relations(subCategories, () => ({}))

export const orders = pgTable("orders", {
  id: text("id").notNull().primaryKey(),
})

// TODO
// export const ordersRelations = relations(orders, ({one, many}) => ({}))

export const addresses = pgTable("addresses", {
  id: text("id").notNull().primaryKey(),
})

// TODO
// export const addressesRelations = relations(addresses, ({}) => ({}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Account = typeof accounts.$inferSelect
export type NewAccount = typeof accounts.$inferInsert

export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert

export type VerificationToken = typeof verificationTokens.$inferSelect
export type NewVerificationToken = typeof verificationTokens.$inferInsert

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert

export type Address = typeof addresses.$inferSelect
export type NewAddress = typeof addresses.$inferInsert
