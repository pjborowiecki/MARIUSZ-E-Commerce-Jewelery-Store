"use server"

import crypto from "crypto"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { db } from "@/config/db"

export async function getPromoById() {
  return "TODO: Implement"
}
