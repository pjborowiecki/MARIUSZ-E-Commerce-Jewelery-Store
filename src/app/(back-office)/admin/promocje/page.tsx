import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"

import auth from "@/lib/auth"
import { cn } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Promocje",
  description: "Zarządzaj promocjami i kuponami promocyjnymi",
}

export default async function AdminPromosPage(): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  const data = []
  const pageCount = 0

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      {data?.length === 0 ? (
        <Card className="flex h-[84vh] flex-1 flex-col items-center justify-center rounded-md border-2 border-dashed bg-accent/40 text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Brak promocji do wyświetlenia
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Dodaj pierwszą promocję aby wyświetlić listę
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/promocje/dodaj-promocje"
              aria-label="dodaj promocję"
              className={cn(buttonVariants(), "")}
            >
              Dodaj promocję
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight md:text-2xl">
              Promocje
            </CardTitle>
          </CardHeader>
          <CardContent>Strona w budowie</CardContent>
        </Card>
      )}
    </div>
  )
}
