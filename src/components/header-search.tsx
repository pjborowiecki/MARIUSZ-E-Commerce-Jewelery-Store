"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { Product } from "@/db/schema"

import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Icons } from "@/components/icons"

interface ProductGroup {
  category: Product["category"]
  products: Pick<Product, "id" | "name" | "category">
}

export function HeaderSearch(): JSX.Element {
  const router = useRouter()
  const [data, setData] = React.useState<ProductGroup[] | null>(null)
  const [open, setOpen] = React.useState<boolean>(false)
  const [isPending, startTransition] = React.useTransition()
  const [query, setQuery] = React.useState<string>("")
  const debouncedQuery = useDebounce(query, 300)

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="flex size-8 shrink-0"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Icons.search
          aria-hidden="true"
          className="size-4 text-muted-foreground"
        />
        <span className="sr-only">Szukaj wśród naszych produktów</span>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open)
          if (!open) setQuery("")
        }}
      >
        <CommandInput
          placeholder="Szukaj..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>Brak wyników wyszukiwania</CommandEmpty>
          {/* {isPending ? (
            <div className="space-y-1 overflow-hidden px-1 py-2">
              <Skeleton className="h-4 w-10 rounded" />
              <Skeleton className="h-8 rounded-sm" />
              <Skeleton className="h-8 rounded-sm" />
            </div>
          ) : (
            data?.map((group) => (
              <CommandGroup
                key={group.category}
                className="capitalize"
                heading={group.category}
              >
                {group.products.map((item) => {
                  const CategoryIcon =
                    productCategories.find(
                      (category) => category.title === group.category
                    )?.icon ?? CircleIcon

                  return (
                    <CommandItem
                      key={item.id}
                      className="h-9"
                      value={item.name}
                      onSelect={() =>
                        handleSelect(() => router.push(`/product/${item.id}`))
                      }
                    >
                      <CategoryIcon
                        className="mr-2.5 size-3 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="truncate">{item.name}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))
          )} */}
        </CommandList>
      </CommandDialog>
    </>
  )
}
