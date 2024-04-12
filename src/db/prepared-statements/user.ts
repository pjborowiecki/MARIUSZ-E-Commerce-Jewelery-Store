import { eq, sql } from "drizzle-orm"

import { db } from "@/config/db"
import { users } from "@/db/schema"

export const psGetUserById = db
  .select()
  .from(users)
  .where(eq(users.id, sql.placeholder("id")))
  .prepare("psGetUserById")

export const psGetUserByEmail = db
  .select()
  .from(users)
  .where(eq(users.email, sql.placeholder("email")))
  .prepare("psGetUserByEmail")

export const psGetUserByEmailVerificationToken = db
  .select()
  .from(users)
  .where(eq(users.emailVerificationToken, sql.placeholder("token")))
  .prepare("psGetUserByEmailVerificationToken")

export const psGetUserByResetPasswordToken = db
  .select()
  .from(users)
  .where(eq(users.resetPasswordToken, sql.placeholder("token")))
  .prepare("psGetUserByResetPasswordToken")

export const psCheckIfUserExists = db.query.users
  .findFirst({
    columns: {
      id: true,
    },
    where: eq(users.id, sql.placeholder("id")),
  })
  .prepare("psCheckIfUserExists")

export const psDeleteUserById = db
  .delete(users)
  .where(eq(users.id, sql.placeholder("id")))
  .prepare("psDeleteUserById")
