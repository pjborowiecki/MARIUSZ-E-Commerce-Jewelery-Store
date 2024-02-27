import * as React from "react"
import type { Metadata } from "next"
import type { SearchParams } from "@/types"
import { and, asc, desc, eq, gte, inArray, lte, sql } from "drizzle-orm"

import { env } from "@/env.mjs"
import { db } from "@/config/db"
import { orders, type Order } from "@/db/schema"
import { customerSearchParamsSchema } from "@/validations/params"

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import { OrdersTableShell } from "@/components/shells/orders-table-shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Zamówienia klienta",
  description: "Zobacz historię i szczegóły zamówień klienta",
}

interface AdminCustomerPageProps {
  params: {
    customerId: string
  }
  searchParams: SearchParams
}

export default async function AdminCustomerPage({
  params,
  searchParams,
}: AdminCustomerPageProps): Promise<JSX.Element> {
  const { page, per_page, sort, status, from, to } =
    customerSearchParamsSchema.parse(searchParams)

  const fallbackPage = isNaN(page) || page < 1 ? 1 : page
  const limit = isNaN(per_page) ? 10 : per_page
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0
  const fromDay = from ? new Date(from) : undefined
  const toDay = to ? new Date(to) : undefined

  const statuses = status ? status.split(".") : []

  const [column, order] = (sort?.split(".") as [
    keyof Order | undefined,
    "asc" | "desc" | undefined,
  ]) ?? ["createdAt", "desc"]

  //   const emailParts = params.customerId.split("-")
  //   const email = `${emailParts[0]}@${emailParts[2]}.com`

  const data = await db
    .select()
    .from(orders)
    .limit(limit)
    .offset(offset)
    .where()
    .orderBy()

  const count = await db
    .select()
    .from(orders)
    .where()
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
          <OrdersTableShell
            data={data}
            pageCount={pageCount}
            isSearchable={false}
          />
        </React.Suspense>
      </div>
    </div>
  )
}
