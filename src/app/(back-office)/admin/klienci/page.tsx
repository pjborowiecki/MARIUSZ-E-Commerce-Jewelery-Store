import * as React from "react"
import type { Metadata } from "next"
import type { SearchParams } from "@/types"
import { and, asc, desc, gte, like, lte, sql } from "drizzle-orm"

import { env } from "@/env.mjs"
import { db } from "@/config/db"
import { orders } from "@/db/schema"
import { customersSearchParamsSchema } from "@/validations/params"

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import { CustomersTableShell } from "@/components/shells/customers-table-shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Twoi klienci",
  description: "Lista klientów sklepu",
}

interface CustomersPageProps {
  searchParams: SearchParams
}

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps): Promise<JSX.Element> {
  const { page, per_page, sort, email, from, to } =
    customersSearchParamsSchema.parse(searchParams)

  const fallbackPage = isNaN(page) || page < 1 ? 1 : page
  const limit = isNaN(per_page) ? 10 : per_page
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0
  const fromDay = from ? new Date(from) : undefined
  const toDay = to ? new Date(to) : undefined

  const data = await db
    .select({
      name: orders.name,
      email: orders.email,
      orderPlaced: sql<number>`count(*)`,
      totalSpent: sql<number>`sum(${orders.amount})`,
      createdAt: sql<string>`min(${orders.createdAt})`,
    })
    .from(orders)
    .limit(limit)
    .offset(offset)
    .where(
      and(
        email ? like(orders.email, `%${email}%`) : undefined,
        fromDay && toDay
          ? and(gte(orders.createdAt, fromDay), lte(orders.createdAt, toDay))
          : undefined
      )
    )
    .groupBy(orders.email, orders.name)
    .orderBy(
      sort === "name.asc"
        ? asc(orders.name)
        : sort === "name.desc"
          ? desc(orders.name)
          : sort === "email.asc"
            ? asc(orders.email)
            : sort === "email.desc"
              ? desc(orders.email)
              : sort === "totalSpent.asc"
                ? asc(sql<number>`sum(${orders.amount})`)
                : sort === "totalSpent.desc"
                  ? desc(sql<number>`sum(${orders.amount})`)
                  : sort === "orderPlaced.asc"
                    ? asc(sql<number>`count(*)`)
                    : sort === "orderPlaced.desc"
                      ? desc(sql<number>`count(*)`)
                      : sort === "createdAt.asc"
                        ? asc(sql<string>`min(${orders.createdAt})`)
                        : sort === "createdAt.desc"
                          ? desc(sql<string>`min(${orders.createdAt})`)
                          : sql<string>`min(${orders.createdAt})`
    )

  const count = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(orders)
    .where(
      and(
        email ? like(orders.email, `%${email}%`) : undefined,
        fromDay && toDay
          ? and(gte(orders.createdAt, fromDay), lte(orders.createdAt, toDay))
          : undefined
      )
    )
    .groupBy(orders.email, orders.name)
    .execute()
    .then((res) => res[0]?.count ?? 0)

  const pageCount = Math.ceil(count / limit)

  return (
    <div>
      <div className="flex flex-col gap-2 border-b bg-tertiary p-4 sm:flex-row sm:items-center sm:justify-between md:min-h-20">
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">
          Klienci
        </h2>

        <div className="w-full sm:w-fit">
          <DateRangePicker align="end" />
        </div>
      </div>

      <div className="p-4">
        <React.Suspense
          fallback={
            <DataTableSkeleton columnCount={5} filterableFieldCount={0} />
          }
        >
          <CustomersTableShell data={data} pageCount={pageCount} />
        </React.Suspense>
      </div>
    </div>
  )
}
