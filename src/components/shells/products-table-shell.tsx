"use client"

import * as React from "react"
import { deleteProduct } from "@/actions/product"
import type { ColumnDef } from "@tanstack/react-table"

import { type Product } from "@/db/schema"

import { useToast } from "@/hooks/use-toast"

import { Badge } from "@/components/ui/badge"
import { CheckBox } from "@/components/ui/checkbox"
import { Icons } from "@/components/icons"

type AwaitedProduct = Pick<
  Product,
  "id" | "name" | "category" | "price" | "inventory" | "createdAt"
>

interface ProductsTableShellProps {
  data: AwaitedProduct[]
  pageCount: number
}

export function ProductsTableShell({
  data,
  pageCount,
}: ProductsTableShellProps): JSX.Element {
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()
  const [selectedRowIds, setSelectedRowIds] = React.useState<number[]>([])

  return <div></div>
}
