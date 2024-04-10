import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"

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
  title: "Tagi",
  description: "Zarządzaj tagami swoich produktów i kategorii",
}

export default async function AdminTagsPage(): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "owner") redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  const data = []

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      {data?.length === 0 ? (
        <Card className="flex h-[84vh] flex-1 flex-col items-center justify-center rounded-md border-2 border-dashed bg-accent/40 text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Brak tagów do wyświetlenia
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Dodaj pierwszy tag aby wyświetlić listę
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/tagi/dodaj-tag"
              aria-label="dodaj tag"
              className={cn(buttonVariants())}
            >
              Dodaj tag
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight md:text-2xl">
              Tagi
            </CardTitle>
          </CardHeader>
          <CardContent>Strona w budowie</CardContent>
        </Card>
      )}
    </div>
  )
}
