import * as React from "react"
import type { Metadata } from "next"
import { unstable_noStore as noStore } from "next/cache"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import type { SearchParams } from "@/types"

import { env } from "@/env.mjs"
import { db } from "@/config/db"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"

import { cn } from "@/lib/utils"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { RegisteredUsersTableShell } from "@/components/shells/registered-users-table-shell"

export async function AdminRegisteredUsers(): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "owner") redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  return <div></div>
}
