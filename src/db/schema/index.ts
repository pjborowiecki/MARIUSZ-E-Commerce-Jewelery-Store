import type { StoredFile } from "@/types"
import type { CartItem, CheckoutItem } from "@/validations/cart"
import type { AdapterAccount } from "@auth/core/adapters"
import { relations } from "drizzle-orm"
import {
  boolean,
  decimal,
  integer,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"

export const userRoleEnum = pgEnum("user_role", ["customer", "owner"])

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
  email: varchar("email", { length: 128 }).notNull().primaryKey(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
})

// TODO
export const tags = pgTable("tag", {
  id: text("id").notNull().primaryKey(),
  name: varchar("name", { length: 64 }).notNull(),
})

// TODO
// export const tagsRelations = relations(tags, ({ one, many }) => ({})

export const categories = pgTable("category", {
  id: text("id").notNull().primaryKey(),
  name: varchar("name", { length: 64 }).notNull(),
  description: text("description"),
  menuItem: boolean("menu_item").notNull().default(true),
  topLevel: boolean("main_category").notNull().default(true),
  parentId: text("parentId").references(() => addresses.id, {
    onDelete: "no action",
  }),
})

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  categories: many(categories),
}))

// TODO: Update category and subcategory types
export const products = pgTable("product", {
  id: text("id").notNull().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  images: json("images").$type<StoredFile[] | null>().default(null),
  // category: text("category").notNull(),
  category: json("categories").$type<string[] | null>().default(null),
  // subcategory: varchar("subcategory", {length: 255}),
  subcategory: json("subcategories").$type<string[] | null>().default(null),
  tags: json("tags").$type<string[] | null>().default(null),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  inventory: integer("inventory").notNull().default(0),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
})

// TODO
// export const productsRelations = relations(products, ({ one, many }) => ({
//   users: many(products),
// }))

export const orders = pgTable("order", {
  id: text("id").notNull().primaryKey(),
  items: json("items").$type<CheckoutItem[] | null>().default(null),
  quantity: integer("quantity"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull().default("0"),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", {
    length: 255,
  }).notNull(),
  stripePaymentIntentStatus: varchar("stripe_payment_intent_status", {
    length: 255,
  }).notNull(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  addressId: text("addressId")
    .notNull()
    .references(() => addresses.id, { onDelete: "no action" }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
})

// TODO
// export const ordersRelations = relations(orders, ({one, many}) => ({}))

export const addresses = pgTable("address", {
  id: text("id").notNull().primaryKey(),
  line1: varchar("street", { length: 128 }).notNull(),
  line2: varchar("line2", { length: 128 }),
  city: varchar("city", { length: 128 }).notNull(),
  postalCode: varchar("postal_code", { length: 128 }).notNull(),
  country: varchar("country", { length: 128 }).notNull().default("Poland"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
})

// TODO
// export const addressesRelations = relations(addresses, ({one, many}) => ({}))

// TODO
// export const favouriteItems = pgTable("favourite_items", {
//   id: text("id").notNull().primaryKey(),
// })

// TODO
// export const favouriteItemsRelations = relations(favouriteItems, ({one, many}) => ({}))

// TODO
export const carts = pgTable("cart", {
  id: text("id").notNull().primaryKey(),
  paymentIntentId: varchar("payment_intent_id", { length: 255 }),
  clientSecret: varchar("client_secret", { length: 255 }),
  items: json("items").$type<CartItem[] | null>().default(null),
  closed: boolean("closed").notNull().default(false),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  // updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
})

// TODO
// export const cartsRelations = relations(carts, ({one, many}) => ({}))

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
