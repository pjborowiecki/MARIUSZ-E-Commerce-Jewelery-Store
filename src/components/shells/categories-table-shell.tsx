"use client"

import * as React from "react"
import Link from "next/link"
import { deleteCategory } from "@/actions/category"
import { type ColumnDef } from "@tanstack/react-table"

import { categories, type Category } from "@/db/schema"

import { useToast } from "@/hooks/use-toast"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Icons } from "@/components/icons"

type AwaitedCategory = Pick<
  Category,
  "id" | "name" | "description" | "menuItem" | "createdAt"
>

interface CategoriesTableShellProps {
  data: AwaitedCategories[]
  pageCount: number
}

export function CategoriesTableShell({
  data,
  pageCount,
}: CategoriesTableShellProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([])

  return (
    // <DataTable columns={columns} />

    <div>Categories table shell</div>
  )
}
