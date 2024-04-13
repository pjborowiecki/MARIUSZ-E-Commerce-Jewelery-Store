"use client"

import * as React from "react"
import Link from "next/link"
import { deleteCategory } from "@/actions/category"
import { deleteProduct } from "@/actions/product"
import { type ColumnDef } from "@tanstack/react-table"

import { categories, Product, products, type Category } from "@/db/schema"

import { useToast } from "@/hooks/use-toast"
import { formatDate, formatPrice } from "@/lib/utils"

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
  data: AwaitedCategory[]
  pageCount: number
}

export function CategoriesTableShell({
  data,
  pageCount,
}: CategoriesTableShellProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([])

  const columns = React.useMemo<ColumnDef<AwaitedCategory, unknown>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value)
              setSelectedRowIds((prev) =>
                prev.length === data.length ? [] : data.map((row) => row.id)
              )
            }}
            aria-label="Zaznacz wszystko"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value)
              setSelectedRowIds((prev) =>
                value
                  ? [...prev, row.original.id]
                  : prev.filter((id) => id !== row.original.id)
              )
            }}
            aria-label="Zaznacz rząd"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Nazwa" />
        ),
      },
      {
        accessorKey: "menuItem",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="W menu" />
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Data dodania" />
        ),
        cell: ({ cell }) => formatDate(cell.getValue() as Date),
        enableColumnFilter: false,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Rozwiń menu"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <Icons.dotsHorizontal className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/admin/kategorie/${row.original.id}`}>Edytuj</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  startTransition(async () => {
                    try {
                      row.toggleSelected(false)

                      const message = await deleteCategory({
                        id: row.original.id,
                      })

                      switch (message) {
                        case "success":
                          toast({
                            title: "Kategoria została usunięta",
                          })
                          break
                        default:
                          toast({
                            title: "Nie udało się usunąć kategorii",
                            description: "Spróbuj ponownie",
                            variant: "destructive",
                          })
                      }
                    } catch (error) {
                      console.error(error)
                      toast({
                        title: "Coś poszło nie tak",
                        description: "Spróbuj ponownie",
                        variant: "destructive",
                      })
                    }
                  })
                }}
                disabled={isPending}
              >
                Usuń
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [data, isPending, toast]
  )

  function deleteSelectedRows() {
    startTransition(async () => {
      const messages = await Promise.all(
        selectedRowIds.map((id) =>
          deleteProduct({
            id,
          }).catch((error) => {
            console.error(error)
            return "error"
          })
        )
      )

      const allSucceeded = messages.every((message) => message === "success")

      if (allSucceeded) {
        toast({
          title: "Wybrane kategorie zostały usunięte",
        })
      } else {
        toast({
          title: "Niektóre kategorie nie zostały usunięte",
          description: "Spróbuj ponownie",
          variant: "destructive",
        })
      }

      try {
      } catch (error) {
        console.error(error)
        toast({
          title: "Coś poszło nie tak",
          description: "Spróbuj ponownie",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      searchableColumns={[
        {
          id: "name",
          title: "nazwy kategorii",
        },
      ]}
      newRowLink={`/admin/kategorie/dodaj-kategorie`}
      deleteRowsAction={() => void deleteSelectedRows()}
    />
  )
}
