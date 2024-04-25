import type { Metadata } from "next"

import { env } from "@/env.mjs"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Regulamin sklepu",
  description:
    "Poznaj zasady świadczenia oraz korzystania z usług naszego sklepu internetowego",
}

export default function TermsAndConditionsPage(): JSX.Element {
  return (
    <div className="py-5">
      Regulamin sklepu oraz korzystania z usługi (TODO: Strona w budowie)
    </div>
  )
}
