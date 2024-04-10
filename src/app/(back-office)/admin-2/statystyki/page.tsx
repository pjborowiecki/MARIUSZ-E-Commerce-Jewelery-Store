import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Statystyki",
  description: "Obserwuj statystyki i swoje wyniki sprzedażowe",
}

export default async function AdminStatsPage(): Promise<JSX.Element> {
  const session = auth()
  if (session?.user.role !== "owner") redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      <Card className="rounded-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight md:text-2xl">
            Dodaj nowy produkt
          </CardTitle>
          <CardDescription>
            Dodaj produkt do swojego asortymentu
          </CardDescription>
        </CardHeader>
        <CardContent>Strona w budowie</CardContent>
      </Card>
    </div>
  )
}
