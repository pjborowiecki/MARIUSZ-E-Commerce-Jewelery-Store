import type { Metadata } from "next"

import { env } from "@/env.mjs"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Najczęściej zadawane pytania",
  description: "Poznaj odpowiedzi na najczęściej zadawane pytania",
}

export default function FaqPage(): JSX.Element {
  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      Najczęściej zadawane pytania (TODO: Stona w budowie)
    </div>
  )
}
