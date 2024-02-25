import * as React from "react"
import type { Metadata } from "next"
import { unstable_noStore as noStore } from "next/cache"
import { notFound, useSelectedLayoutSegments } from "next/navigation"
import { orders, type Order } from "@/db/schema"
import { env } from "@/env.mjs"
import type { SearchParams } from "@/types"
import { customerSearchParamsSchema } from "@/validations/params"
import { and, asc, desc, eq, gte, inArray, lte, sql } from "drizzle-orm"

import { db } from "@/config/db"
import { DatabTableSkeleton } from "@/components/data-table/data-table-skeleton"
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
  const limit = isNaN(per_page) ? 10 : page
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0
  const fromDay = from ? new Date(from) : undefined
  const toDay = to ? new Date(to) : undefined

  // const emailParts
  // const email

  const statuses = status ? status.split(".") : []
  const [column, order] = (sort?.split(".") as [
    keyof Order | undefined,
    "asc" | "desc" | undefined,
  ]) ?? ["createdAt", "desc"]

  //   noStore()

  return (
    <div className="p-5">
      {/* TODO: Replace with subheader of subsubheader */}
      <div className="xs:flex-row xs:items-center xs:justify-between flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Historia zamówień klienta
        </h2>
        <DateRangePicker align="end" />
      </div>
    </div>
  )
}
