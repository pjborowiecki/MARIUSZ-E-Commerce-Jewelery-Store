import type { Metadata } from "next"

import { env } from "@/env.mjs"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Polityka prywatności",
  description:
    "Poznaj zasady zarządzania danymi, którymi kierujemy się w celu realizacji naszych usług",
}

export default function PrivacyPolicyPage(): JSX.Element {
  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      Polityka prywatności (TODO: Strona w budowie)
    </div>
  )
}
