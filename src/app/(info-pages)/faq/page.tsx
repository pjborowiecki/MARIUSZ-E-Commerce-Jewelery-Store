import type { Metadata } from "next"

import { env } from "@/env.mjs"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Najczęściej zadawane pytania",
  description: "Poznaj odpowiedzi na najczęściej zadawane pytania",
}

export default function FaqPage(): JSX.Element {
  return (
    <div className="py-5">
      Najczęściej zadawane pytania (TODO: Stona w budowie)
    </div>
  )
}
