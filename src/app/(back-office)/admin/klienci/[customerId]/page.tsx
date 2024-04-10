import * as React from "react"
import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getUserById } from "@/actions/user"
import { auth } from "@/auth"
import type { SearchParams } from "@/types"
import { and, asc, desc, eq, gte, inArray, lte, sql } from "drizzle-orm"

import { env } from "@/env.mjs"
import { db } from "@/config/db"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"
import { orders, type Order } from "@/db/schema"
import { customerSearchParamsSchema } from "@/validations/params"

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import { OrdersTableShell } from "@/components/shells/orders-table-shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Dane i zamówienia klienta",
  description: "Zobacz i edytuj dane klienta oraz jego zamówienia",
}

interface AdminCustomerPage {
  params: {
    customerId: string
  }
  searchParams: SearchParams
}

export default async function AdminCustomerPage({
  params,
  searchParams,
}: AdminCustomerPage) {
  const session = await auth()
  if (session?.user.role !== "owner") redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  const user = await getUserById({ id: params.customerId })
  if (!user) notFound()

  const { page, per_page, sort, status, from, to } =
    customerSearchParamsSchema.parse(searchParams)

  return <div>Admin Customer Page</div>
}
