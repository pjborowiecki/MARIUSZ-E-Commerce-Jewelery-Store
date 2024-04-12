import { type Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getOrderById, getOrderLineItems } from "@/actions/order"
import { auth } from "@/auth"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"

import { formatId, formatPrice } from "@/lib/utils"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Zamówienie",
  description: "Zobacz szczegóły zamówienia",
}

interface AdminOrderPageProps {
  params: {
    orderId: string
  }
}

export default async function AdminOrderPage({ params }: AdminOrderPageProps) {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  const order = await getOrderById({ id: params.orderId })
  if (!order) notFound()

  const orderLineItems = await getOrderLineItems({
    items: String(order.items),
  })

  return (
    <Card className="rounded-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">
          Zamówienie {formatId(order.id)}
        </CardTitle>
        <CardDescription>Zobacz szczegóły zamówienia</CardDescription>
      </CardHeader>
      <CardContent className="flex w-full flex-col space-y-2.5">
        {orderLineItems.map((item) => (
          <Link
            aria-label={`View ${item.name}`}
            key={item.id}
            href={`/product/${item.id}`}
            className="rounded-md bg-muted px-4 py-2.5 hover:bg-muted/70"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col space-y-1 self-start">
                  <span className="line-clamp-1 text-sm font-medium">
                    {item.name}
                  </span>
                  <span className="line-clamp-1 text-xs text-muted-foreground">
                    Qty {item.quantity}
                  </span>
                </div>
              </div>
              <div className="flex flex-col space-y-1 font-medium">
                <span className="ml-auto line-clamp-1 text-sm">
                  {formatPrice((Number(item.price) * item.quantity).toFixed(2))}
                </span>
                <span className="line-clamp-1 text-xs text-muted-foreground">
                  {formatPrice(item.price)} each
                </span>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
