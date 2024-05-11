import * as React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import type { SearchParams } from "@/types"
import { endOfDay, startOfDay } from "date-fns"
import { and, asc, desc, gte, like, lte, sql } from "drizzle-orm"

import { env } from "@/env.mjs"
import { db } from "@/config/db"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"
import { orders } from "@/db/schema"
import { customersSearchParamsSchema } from "@/validations/params"

import auth from "@/lib/auth"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import { CustomersTableShell } from "@/components/shells/customers-table-shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Klienci",
  description: "Zarządzaj danymi swoich klientów",
}

interface CustomersPageProps {
  searchParams: SearchParams
}

export default async function CustomersPage({
  searchParams,
}: Readonly<CustomersPageProps>): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  const { page, per_page, sort, email, from, to } =
    customersSearchParamsSchema.parse(searchParams)

  const fallbackPage = isNaN(page) || page < 1 ? 1 : page
  const limit = isNaN(per_page) ? 10 : per_page
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0
  const fromDay = from ? startOfDay(new Date(from)) : undefined
  const toDay = to ? endOfDay(new Date(to)) : undefined

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
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      {data?.length === 0 ? (
        <Card className="flex h-[84vh] flex-1 flex-col items-center justify-center rounded-md border-2 border-dashed bg-accent/40 text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Brak klientów do wyświetlenia
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Gdy tylko się pojawią, zobaczysz tutaj listę klientów
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <div className="text-xl font-bold tracking-tight md:text-2xl">
                Klienci
              </div>
              <DateRangePicker align="end" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <React.Suspense
              fallback={
                <DataTableSkeleton columnCount={5} filterableColumnCount={0} />
              }
            >
              <CustomersTableShell
                data={data ? data : []}
                pageCount={pageCount ? pageCount : 0}
              />
            </React.Suspense>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
