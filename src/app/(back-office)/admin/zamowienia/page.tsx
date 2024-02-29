import * as React from "react"
import type { Metadata } from "next"
import { unstable_noStore as noStore } from "next/cache"
import type { SearchParams } from "@/types"
import { endOfDay, startOfDay } from "date-fns"
import { and, asc, desc, gte, inArray, like, lte, sql } from "drizzle-orm"

import { env } from "@/env.mjs"
import { db } from "@/config/db"
import { orders, type Order } from "@/db/schema"
import { ordersSearchParamsSchema } from "@/validations/params"

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import { OrdersTableShell } from "@/components/shells/orders-table-shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Zamówienia",
  description: "Zarządzaj zamówieniami klientów",
}

interface AdminOrdersPageProps {
  searchParams: SearchParams
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps): Promise<JSX.Element> {
  const { page, per_page, sort, customer, status, from, to } =
    ordersSearchParamsSchema.parse(searchParams)

  const fallbackPage = isNaN(page) || page < 1 ? 1 : page
  const limit = isNaN(per_page) ? 10 : per_page
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0
  const fromDay = from ? startOfDay(new Date(from)) : undefined
  const toDay = to ? endOfDay(new Date(to)) : undefined

  const statuses = status ? status.split(".") : []

  const [column, order] = (sort.split(".") as [
    keyof Order | undefined,
    "asc" | "desc" | undefined,
  ]) ?? ["createdAt", "desc"]

  noStore()
  const data = await db
    .select({
      id: orders.id,
      quantity: orders.quantity,
      amount: orders.amount,
      paymentIntentId: orders.stripePaymentIntentId,
      status: orders.stripePaymentIntentStatus,
      customer: orders.email,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .limit(limit)
    .offset(offset)
    .where(
      and(
        customer ? like(orders.email, `%${customer}%`) : undefined,
        statuses.length > 0
          ? inArray(orders.stripePaymentIntentStatus, statuses)
          : undefined,
        fromDay && toDay
          ? and(gte(orders.createdAt, fromDay), lte(orders.createdAt, toDay))
          : undefined
      )
    )
    .orderBy(
      column && column in orders
        ? order === "asc"
          ? asc(orders[column])
          : desc(orders[column])
        : desc(orders.createdAt)
    )

  noStore()
  const count = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(orders)
    .where(
      and(
        customer ? like(orders.email, `%${customer}%`) : undefined,
        statuses.length > 0
          ? inArray(orders.stripePaymentIntentStatus, statuses)
          : undefined,
        fromDay && toDay
          ? and(gte(orders.createdAt, fromDay), lte(orders.createdAt, toDay))
          : undefined
      )
    )
    .execute()
    .then((res) => res[0]?.count ?? 0)

  const pageCount = Math.ceil(count / limit)

  return (
    <div>
      <div className="flex flex-col gap-2 border-b bg-tertiary p-4 sm:flex-row sm:items-center sm:justify-between md:min-h-20">
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">
          Zamówienia
        </h2>
        <DateRangePicker align="end" />
      </div>

      <div className="p-4">
        <React.Suspense fallback={<DataTableSkeleton columnCount={6} />}>
          <OrdersTableShell
            data={data ? data : []}
            pageCount={pageCount ? pageCount : 0}
          />
        </React.Suspense>
      </div>
    </div>
  )
}
