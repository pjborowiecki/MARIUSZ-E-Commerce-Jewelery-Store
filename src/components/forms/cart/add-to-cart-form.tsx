"use client"

import * as React from "react"
import { addToCart } from "@/actions/cart"
import { zodResolver } from "@hookform/resolvers/zod"
import { MinusIcon, PlusIcon } from "lucide-react"
import { useForm } from "react-hook-form"

import {
  updateCartItemSchema,
  type UpdateCartItemInput,
} from "@/validations/cart"

import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"

interface AddToCartFormProps {
  productId: string
}

export function AddToCartForm({
  productId,
}: Readonly<AddToCartFormProps>): JSX.Element {
  const id = React.useId()
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<UpdateCartItemInput>({
    resolver: zodResolver(updateCartItemSchema),
    defaultValues: {
      quantity: 1,
    },
  })

  function onSubmit(formData: UpdateCartItemInput): void {
    startTransition(async () => {
      try {
        const message = await addToCart({
          productId,
          quantity: formData.quantity,
        })

        switch (message) {
          case "success":
            toast({
              title: "Produkt dodano do koszyka",
            })
            break
          case "out-of-stock":
            toast({
              title: "Produkt nie jest dostępny",
              description:
                "Przepraszamy, wybrany produkt nie jest już dostępny",
              variant: "destructive",
            })
            break
          default:
            toast({
              title: "Przepraszamy, coś poszło nie tak",
              description: "Spróbuj ponownie lub skontaktuj się z nami",
              variant: "destructive",
            })
        }
      } catch (error) {
        console.error(error)
        toast({
          title: "Przepraszamy, coś poszło nie tak",
          description: "Spróbuj ponownie lub skontaktuj się z nami",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className={cn("flex max-w-[260px] gap-4")}
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <div className="flex items-center">
          <Button
            id={`${id}-decrement`}
            type="button"
            variant="outline"
            size="icon"
            className="size-8 shrink-0 rounded-r-none"
            onClick={() =>
              form.setValue(
                "quantity",
                Math.max(0, form.getValues("quantity") - 1)
              )
            }
            disabled={isPending}
          >
            <MinusIcon className="size-3" aria-hidden="true" />
            <span className="sr-only">Zmniejsz ilość o jeden</span>
          </Button>
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="sr-only">Ilość</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    className="h-8 w-16 rounded-none border-x-0"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value
                      const parsedValue = parseInt(value, 10)
                      if (isNaN(parsedValue)) return
                      field.onChange(parsedValue)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            id={`${id}-increment`}
            type="button"
            variant="outline"
            size="icon"
            className="size-8 shrink-0 rounded-l-none"
            onClick={() =>
              form.setValue("quantity", form.getValues("quantity") + 1)
            }
            disabled={isPending}
          >
            <PlusIcon className="size-3" aria-hidden="true" />
            <span className="sr-only">Zwiększ ilość o jeden</span>
          </Button>
        </div>
        <div className="flex items-center space-x-2.5">
          <Button
            aria-label="Dodaj do koszyka"
            type="submit"
            size="sm"
            className="w-full rounded-full"
            disabled={isPending}
          >
            {isPending && (
              <Icons.spinner
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Dodaj do koszyka
          </Button>
        </div>
      </form>
    </Form>
  )
}
