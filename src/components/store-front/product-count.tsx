import { Badge } from "@/components/ui/badge"

interface ProductCountProps {
  count: number
}

export async function ProductCount({
  count,
}: Readonly<ProductCountProps>): Promise<JSX.Element> {
  return (
    <Badge
      variant="secondary"
      className="pointer-events-none w-fit rounded font-medium"
    >
      {count}
    </Badge>
  )
}
