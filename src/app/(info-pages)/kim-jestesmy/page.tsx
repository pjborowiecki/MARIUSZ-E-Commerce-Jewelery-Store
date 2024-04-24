import type { Metadata } from "next"

import { env } from "@/env.mjs"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Kim jesteśmy",
  description:
    "Poznaj naszą historię i dowiedz się dlaczego warto u nas kupować",
}

export default function AboutUsPage(): JSX.Element {
  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      Kim jesteśmy (TODO: Strona w budowie)
    </div>
  )
}
