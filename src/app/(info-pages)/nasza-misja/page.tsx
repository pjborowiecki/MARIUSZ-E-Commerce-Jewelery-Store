import type { Metadata } from "next"

import { env } from "@/env.mjs"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Nasza misja",
  description: "Odkryj czym się kierujemy oraz co jest dla nas naprawdę ważne",
}

export default function OurMissionPage(): JSX.Element {
  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      Nasza Misja (TODO: Strona w budowie)
    </div>
  )
}
