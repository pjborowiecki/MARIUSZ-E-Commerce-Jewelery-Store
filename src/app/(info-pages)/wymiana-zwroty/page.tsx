import type { Metadata } from "next"

import { env } from "@/env.mjs"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Wymiana i zwroty",
  description: "Poznaj zasady wymiany i zwrotu zakupów w naszym sklepie",
}

export default function ReturnsPage(): JSX.Element {
  return <div className="py-5">Wymiana i zwroty (TODO: Strona w budowie)</div>
}
