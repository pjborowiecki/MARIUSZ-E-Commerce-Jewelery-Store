"use client"

import * as React from "react"
import Link from "next/link"
import { deleteProduct } from "@/actions/product"
import { type ColumnDef } from "@tanstack/react-table"

import { products, type Product } from "@/db/schema"

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

type AwaitedProduct = Pick<
  Product,
  | "id"
  | "name"
  | "state"
  | "categoryName"
  | "subcategoryName"
  | "price"
  | "inventory"
  | "createdAt"
  | "updatedAt"
>

interface ProductsTableShellProps {
  data: AwaitedProduct[]
  pageCount: number
}

export function ProductsTableShell({
  data,
  pageCount,
}: Readonly<ProductsTableShellProps>) {
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([])

  const columns = React.useMemo<ColumnDef<AwaitedProduct, unknown>[]>(
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
        accessorKey: "state",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ cell }) => {
          const states = Object.values(products.state.enumValues)
          const state = cell.getValue() as Product["state"]

          if (!states.includes(state)) return null

          return (
            <Badge variant="secondary" className="capitalize">
              {state}
            </Badge>
          )
        },
      },
      {
        accessorKey: "categoryName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Kategoria" />
        ),
      },
      {
        accessorKey: "subcategoryName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Podkategoria" />
        ),
      },
      // {
      //   accessorKey: "category",
      //   header: ({ column }) => (
      //     <DataTableColumnHeader column={column} title="Kategoria" />
      //   ),
      //   cell: ({ cell }) => {
      //     const categories = Object.values(products.category.enumValues)
      //     const category = cell.getValue() as Product["category"]

      //     if (!categories.includes(category)) return null

      //     return (
      //       <Badge variant="outline" className="capitalize">
      //         {category}
      //       </Badge>
      //     )
      //   },
      // },

      {
        accessorKey: "price",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Cena" />
        ),
        cell: ({ cell }) => formatPrice(cell.getValue() as number),
      },
      {
        accessorKey: "inventory",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Dostępność" />
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
                <Link href={`/admin/produkty/${row.original.id}`}>Edytuj</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  startTransition(async () => {
                    try {
                      row.toggleSelected(false)

                      const message = await deleteProduct({
                        id: row.original.id,
                      })

                      switch (message) {
                        case "success":
                          toast({
                            title: "Produkt został usunięty",
                          })
                          break
                        default:
                          toast({
                            title: "Nie udało się usunąć produktu",
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
          title: "Wybrane produkty zostały usunięte",
        })
      } else {
        toast({
          title: "Niektóre produkty nie zostały usunięte",
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
      // filterableColumns={[
      //   {
      //     id: "category",
      //     title: "Category",
      //     options: products.category.enumValues.map((category) => ({
      //       label: `${category.charAt(0).toUpperCase()}${category.slice(1)}`,
      //       value: category,
      //     })),
      //   },
      // ]}
      searchableColumns={[
        {
          id: "name",
          title: "names",
        },
      ]}
      newRowLink={`/admin/produkty/dodaj-produkt`}
      deleteRowsAction={() => void deleteSelectedRows()}
    />
  )
}
