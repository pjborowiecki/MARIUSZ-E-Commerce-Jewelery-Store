import * as React from "react"
import type { Metadata, Metadatada } from "next"
import { orders, type Order } from "@/db/schema"
import { env } from "@/env.mjs"

import { db } from "@/config/db"
import { Breadcrumbs } from "@/components/breadcrumbs"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Twoi klienci",
  description: "Lista klientów sklepu",
}

export default function AdminCustomersPage(): JSX.Element {
  return (
    <div>
      <div className="flex h-16 w-full items-center border-b bg-tertiary px-4">
        <Breadcrumbs />
      </div>
    </div>
  )
}
