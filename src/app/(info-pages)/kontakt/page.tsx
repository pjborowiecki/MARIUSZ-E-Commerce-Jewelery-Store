import type { Metadata } from "next"

import { env } from "@/env.mjs"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Kontakt",
  description:
    "Dowiedz się, jak najlepiej się z nami skontaktować. Wyślij wiadomość lub zadzwoń",
}

export default function ContactPage(): JSX.Element {
  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      Kontakt (TODO: Strona w budowie)
    </div>
  )
}
