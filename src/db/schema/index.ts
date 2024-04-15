import type { StoredFile } from "@/types"
import type { AdapterAccount } from "@auth/core/adapters"
import { relations, sql } from "drizzle-orm"
import {
  boolean,
  decimal,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"

import type { CartItem, CheckoutItem } from "@/validations/cart"

export const userRoleEnum = pgEnum("user_role", ["klient", "administrator"])

export const productCategoryEnum = pgEnum("product_category", [
  "naszyjniki",
  "kolczyki",
  "pierścionki",
  "inne",
])

export const productStatusEnum = pgEnum("product_status", [
  "roboczy",
  "aktywny",
  "zarchiwizowany",
])

export const accounts = pgTable(
  "accounts",
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

export const sessions = pgTable("sessions", {
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

export const users = pgTable("users", {
  id: text("id").notNull().primaryKey(),
  role: userRoleEnum("role").notNull().default("klient"),
  name: varchar("name", { length: 128 }),
  surname: varchar("surname", { length: 128 }),
  email: varchar("email", { length: 128 }).unique().notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  emailVerificationToken: text("emailVerificationToken").unique(),
  passwordHash: text("passwordHash"),
  resetPasswordToken: text("resetPasswordToken").unique(),
  resetPasswordTokenExpiry: timestamp("resetPasswordTokenExpiry", {
    mode: "date",
  }),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).default(
    sql`current_timestamp`
  ),
})

export const usersRelations = relations(users, ({ one, many }) => ({
  account: one(accounts, {
    fields: [users.id],
    references: [accounts.userId],
  }),
  session: many(sessions),
}))

export const verificationTokens = pgTable(
  "verificationTokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
)

export const newsletterSubscribers = pgTable("newsletterSubscribers", {
  email: varchar("email", { length: 128 }).notNull().primaryKey(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).default(
    sql`current_timestamp`
  ),
})

export const products = pgTable(
  "products",
  {
    id: text("id").notNull().primaryKey(),
    name: varchar("name", { length: 128 }).notNull(),
    description: text("description"),
    images: json("images").$type<StoredFile[] | null>().default(null),
    status: productStatusEnum("status").notNull().default("roboczy"),
    tags: json("tags").$type<string[] | null>().default(null),
    price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
    inventory: integer("inventory").notNull().default(0),
    categoryId: text("category_id").notNull(),
    subcategoryId: text("subcategory_id")
      .notNull()
      .references(() => subcategories.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).default(
      sql`current_timestamp`
    ),
  },
  (table) => ({
    categoryIdIdx: index(`store_products_category_id_idx`).on(table.categoryId),
    subcategoryIdIdx: index(`store_products_subcategory_id_idx`).on(
      table.subcategoryId
    ),
  })
)

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [products.subcategoryId],
    references: [subcategories.id],
  }),
}))

export const categories = pgTable("categories", {
  id: text("id").notNull().primaryKey(),
  name: varchar("name", { length: 32 }).notNull().unique(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  description: text("description"),
  menuItem: boolean("menu_item").notNull().default(false),
  images: json("images").$type<StoredFile[] | null>().default(null),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).default(
    sql`current_timestamp`
  ),
})

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
  subcategories: many(subcategories),
}))

export const subcategories = pgTable(
  "subcategories",
  {
    id: text("id").notNull().primaryKey(),
    name: varchar("name", { length: 32 }).notNull().unique(),
    slug: varchar("slug", { length: 64 }).notNull().unique(),
    description: text("description"),
    menuItem: boolean("menu_item").notNull().default(false),
    categoryId: text("category_id")
      .references(() => categories.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).default(
      sql`current_timestamp`
    ),
  },
  (table) => ({
    subcategoriesCategoryIdIdx: index(`store_subcategories_category_id_idx`).on(
      table.categoryId
    ),
  })
)

export const subcategoriesRelations = relations(subcategories, ({ one }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id],
  }),
}))

export const carts = pgTable("carts", {
  id: text("id").notNull().primaryKey(),
  paymentIntentId: varchar("payment_intent_id", { length: 256 }),
  clientSecret: varchar("client_secret", { length: 256 }),
  items: json("items").$type<CartItem[] | null>().default(null),
  closed: boolean("closed").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
})

export const orders = pgTable(
  "orders",
  {
    id: text("id").notNull().primaryKey(),
    items: json("items").$type<CheckoutItem[] | null>().default(null),
    quantity: integer("quantity"),
    amount: decimal("amount", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    stripePaymentIntentId: varchar("stripe_payment_intent_id", {
      length: 256,
    }).notNull(),
    stripePaymentIntentStatus: varchar("stripe_payment_intent_status", {
      length: 256,
    }).notNull(),
    name: varchar("name", { length: 256 }),
    email: varchar("email", { length: 256 }),
    addressId: text("address_id")
      .notNull()
      .references(() => addresses.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).default(
      sql`current_timestamp`
    ),
  },
  (table) => ({
    idIdx: index(`store_orders_id_idx`).on(table.id),
    addressIdIdx: index(`store_orders_address_id_idx`).on(table.addressId),
  })
)

export const payments = pgTable(
  "payments",
  {
    id: text("id").notNull().primaryKey(),
    stripeAccountId: varchar("stripe_account_id", { length: 256 }).notNull(),
    stripeAccountCreatedAt: integer("stripe_account_created_at"),
    stripeAccountExpiresAt: integer("stripe_account_expires_at"),
    detailsSubmitted: boolean("details_submitted").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).default(
      sql`current_timestamp`
    ),
  },
  (table) => ({
    idIdx: index(`store_payments_id_idx`).on(table.id),
  })
)

export const addresses = pgTable("addresses", {
  id: text("id").notNull().primaryKey(),
  line1: varchar("line_1", { length: 128 }).notNull(),
  line2: varchar("line_2", { length: 128 }),
  city: varchar("city", { length: 128 }).notNull(),
  postalCode: varchar("postal_code", { length: 128 }).notNull(),
  country: varchar("country", { length: 128 }).default("Poland"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).default(
    sql`current_timestamp`
  ),
})

export const emailPreferences = pgTable("emailPreferences", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id"),
  email: varchar("email", { length: 256 }).notNull(),
  token: varchar("token", { length: 256 }).notNull(),
  newsletter: boolean("newsletter").notNull().default(false),
  marketing: boolean("marketing").notNull().default(false),
  transactional: boolean("transactional").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).default(
    sql`current_timestamp`
  ),
})

export const notifications = pgTable("notifications", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  token: varchar("token", { length: 256 }).notNull().unique(),
  referredBy: varchar("referred_by", { length: 256 }),
  newsletter: boolean("newsletter").default(false).notNull(),
  marketing: boolean("marketing").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).default(
    sql`current_timestamp`
  ),
})

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

export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert

export type Subcategory = typeof subcategories.$inferSelect
export type NewSubcategory = typeof subcategories.$inferInsert

export type Cart = typeof carts.$inferSelect
export type NewCart = typeof carts.$inferInsert

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert

export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert

export type Address = typeof addresses.$inferSelect
export type NewAddress = typeof addresses.$inferInsert

export type EmailPreferences = typeof emailPreferences.$inferSelect
export type NewEmailPreferences = typeof emailPreferences.$inferInsert

export type Notificaton = typeof notifications.$inferSelect
export type NewNotificaton = typeof notifications.$inferInsert
