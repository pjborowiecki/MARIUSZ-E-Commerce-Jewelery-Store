"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { filterProducts } from "@/actions/product"

import { useDebounce } from "@/hooks/use-debounce"

import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Skeleton } from "@/components/ui/skeleton"
import { CustomTooltip } from "@/components/custom-tooltip"
import { Icons } from "@/components/icons"

type ProductGroup = NonNullable<
  Exclude<Awaited<ReturnType<typeof filterProducts>>, "invalid-input">["data"]
>[number]

export function HeaderSearch(): JSX.Element {
  const router = useRouter()
  const [open, setOpen] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [query, setQuery] = React.useState<string>("")
  const [data, setData] = React.useState<ProductGroup[] | null>(null)
  const debouncedQuery = useDebounce(query, 300)

  React.useEffect(() => {
    if (debouncedQuery.length <= 0) {
      setData(null)
      return
    }

    async function fetchData() {
      const result = await filterProducts({ query: debouncedQuery })

      if (result === "invalid-input" || result.error) {
        setLoading(false)
        return
      }
      setData(data)
      setLoading(false)
    }

    void fetchData()
  }, [debouncedQuery, data])

  const onSelect = React.useCallback((callback: () => unknown) => {
    setOpen(false)
    callback()
  }, [])

  return (
    <>
      <CustomTooltip text="Wyszukiwanie produktu">
        <Button
          variant="outline"
          size="icon"
          className="flex size-8 shrink-0"
          onClick={() => setOpen((prev) => !prev)}
        >
          <Icons.search aria-hidden="true" className="size-4" />
          <span className="sr-only">Szukaj wśród naszych produktów</span>
        </Button>
      </CustomTooltip>

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

          {loading ? (
            <div className="space-y-1 overflow-hidden px-1 py-2">
              <Skeleton className="h-4 w-10 rounded" />
              <Skeleton className="h-8 rounded-sm" />
              <Skeleton className="h-8 rounded-sm" />
            </div>
          ) : (
            data?.map((group) => (
              <CommandGroup
                key={group.name}
                className="capitalize"
                heading={group.name}
              >
                {group.products.map((item) => {
                  return (
                    <CommandItem
                      key={item.id}
                      className="h-9"
                      value={item.name}
                      onSelect={() =>
                        onSelect(() => router.push(`/product/${item.id}`))
                      }
                    >
                      <Icons.product
                        className="mr-2.5 size-3 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="truncate">{item.name}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
