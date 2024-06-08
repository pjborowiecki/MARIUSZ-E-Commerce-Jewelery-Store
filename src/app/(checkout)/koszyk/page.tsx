import type { Metadata } from "next"

import { env } from "@/env.mjs"

import { cn } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"
import { CheckoutCard } from "@/components/checkout/checkout-card"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Koszyk na zakupy",
  description: "Zaloguj się aby zobaczyć zawartość koszyka",
}

export default function CartPage(): JSX.Element {
  // TODO: Style the headings and the shell
  return (
    <div id="shell">
      <div id="heading">
        <div>Finalizowanie zamówienia</div>
        <div>Przejdź do kasy by sfinalizować zamówienie</div>
      </div>

      {/* TODO: */}
      <CheckoutCard />

      {/* TODO: Empty card */}
      <section
        id="cart-page-empty-cart"
        aria-label="Koszk jest pusty"
        className="flex h-full flex-col items-center justify-center space-y-1"
      ></section>
    </div>
  )
}
