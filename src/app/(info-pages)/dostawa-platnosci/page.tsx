import type { Metadata } from "next"

import { env } from "@/env.mjs"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Dostawa i płatności",
  description:
    "Dowiedz się więcej na temat oopcji dostawy oraz form płatności, które obsługujemy",
}

export default function DeliveriesAndPaymentsPage(): JSX.Element {
  return <div className="">Dostawa i płatności (TODO: Strona w budowie)</div>
}
