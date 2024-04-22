import { type Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getPromoById } from "@/actions/promo"
import { auth } from "@/auth"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"

interface AdminPromoPageProps {
  params: {
    promoId: string
  }
}

export default async function AdminPromoPage({
  params,
}: AdminPromoPageProps): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  const promo = getPromoById({ id: params.promoId })
  if (!promo) notFound()
  return <div>Hello</div>
}
