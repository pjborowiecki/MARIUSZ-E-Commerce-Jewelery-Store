import type { Metadata } from "next"

import { env } from "@/env.mjs"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Promocje",
  description: "Zarządzaj promocjami i kuponami promocyjnymi",
}

export default function AdminPromosPage(): JSX.Element {
  return (
    <div>
      <div className="flex items-center border-b bg-tertiary p-4 md:min-h-20">
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">
          Promocje
        </h2>
      </div>

      <div className="p-4">
        <p>Strona w budowie</p>
      </div>
    </div>
  )
}
