import { redirect } from "next/navigation"

interface ProductPreviewPageProps {
  params: {
    productId: string
  }
}

export default function ProductPreviewPage({
  params,
}: Readonly<ProductPreviewPageProps>) {
  const productId = Number(params.productId)

  redirect(`/produkty/${productId}`)
}
