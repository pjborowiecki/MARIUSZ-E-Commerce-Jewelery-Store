import type { StripePaymentStatus } from "@/types"

import { cn } from "@/lib/utils"

export const stripePaymentStatuses: {
  label: string
  value: StripePaymentStatus
}[] = [
  { label: "Anulowano", value: "canceled" },
  { label: "Przetwarzanie", value: "processing" },
  { label: "Wymaga działania", value: "requires_action" },
  { label: "Wymaga zatwierdzenia", value: "requires_capture" },
  { label: "Wymaga potwierdzenia", value: "requires_confirmation" },
  { label: "Wymaga metody płatności", value: "requires_payment_method" },
  { label: "Zakończono sukcesem", value: "succeeded" },
]

export function getStripePaymentStatusColor({
  status,
  shade = 600,
}: {
  status: StripePaymentStatus
  shade?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
}) {
  const bg = `bg-${shade}`

  return cn({
    [`${bg}-red`]: status === "canceled",
    [`${bg}-yellow`]: [
      "processing",
      "requires_action",
      "requires_capture",
      "requires_confirmation",
      "requires_payment_method",
    ].includes(status),
    [`bg-green-${shade}`]: status === "succeeded",
  })
}
