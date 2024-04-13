import Link from "next/link"

import { Icons } from "@/components/icons"
import { Shell } from "@/components/shell"
import { CategoryCard } from "@/components/store-front/store-front"

interface StoreFrontProps {
  productsPromise: ReturnType<typeof getFuturedProducts>
}

export function StoreFront(): JSX.Element {
  return <div>Store Front</div>
}
