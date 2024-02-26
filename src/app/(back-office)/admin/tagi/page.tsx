import type { Metadata } from "next"

import { env } from "@/env.mjs"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Tagi",
  description: "Zarządzaj tagami swoich produktów i kategorii",
}

export default function AdminTagsPage(): JSX.Element {
  return (
    <div>
      <div className="flex min-h-20 items-center border-b bg-tertiary p-4">
        <h2 className="text-2xl font-bold tracking-tight">Tagi</h2>
      </div>

      <div className="p-4">
        <p>Strona w budowie</p>
      </div>
    </div>
  )
}
