"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { updateSubcategory } from "@/actions/category"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { Subcategory } from "@/db/schema"
import {
  updateSubcategorySchema,
  type UpdateSubcategoryInput,
} from "@/validations/category"

import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  UncontrolledFormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"

interface UpdateSubcategoryFormProps {
  subcategory: Subcategory
}

export function UpdateSubcategoryForm({
  subcategory,
}: UpdateSubcategoryFormProps): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [isUpdating, startUpdateTransition] = React.useTransition()

  const form = useForm<UpdateSubcategoryInput>({
    resolver: zodResolver(updateSubcategorySchema),
    defaultValues: {
      id: subcategory.id,
      name: subcategory.name,
      description: subcategory.description ?? "",
      categoryName: subcategory.categoryName,
    },
  })

  function onSubmit(formData: UpdateSubcategoryInput) {
    startUpdateTransition(async () => {
      try {
        const message = await updateSubcategory({
          id: formData.id,
          name: formData.name,
          description: formData.description,
          categoryName: formData.categoryName,
        })

        console.log(message)

        switch (message) {
          case "invalid-input":
            toast({
              title: "Nieprawidłowy typ danych wejściowych",
              variant: "destructive",
            })
            break
          case "not-found":
            toast({
              title: "Nie znaleziono kategorii",
              description: "Szukana podkategoria nie istnieje",
              variant: "destructive",
            })
            break
          case "exists":
            toast({
              title:
                "Dla tej kategorii, podkategoria o podanej nazwie już istnieje",
              description: "Wybierz inną nazwę i spróbuj ponownie",
              variant: "destructive",
            })
            break
          case "success":
            toast({
              title: "Podkategoria została zaktualizowana",
            })
            router.push("/admin/podkategorie")
            break
          default:
            toast({
              title: "Nie udało się zaktualizować podkategorii",
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
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormItem className="w-full md:w-4/5 xl:w-2/3">
          <FormLabel>Id</FormLabel>
          <FormControl>
            <Input
              type="text"
              disabled
              defaultValue={subcategory.id}
              {...form.register("id")}
            />
          </FormControl>
        </FormItem>

        <FormItem className="w-full md:w-4/5 xl:w-2/3">
          <FormLabel>Kategoria</FormLabel>
          <FormControl>
            <Input
              type="text"
              disabled
              defaultValue={subcategory.categoryName}
              {...form.register("categoryName")}
            />
          </FormControl>
        </FormItem>

        <FormItem className="w-full md:w-4/5 xl:w-2/3">
          <FormLabel>Nazwa</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="Np. złote"
              defaultValue={subcategory.name}
              {...form.register("name")}
            />
          </FormControl>
          <UncontrolledFormMessage
            message={form.formState.errors.name?.message}
          />
        </FormItem>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full md:w-4/5 xl:w-2/3">
              <FormLabel>Opis</FormLabel>
              <FormControl className="min-h-[120px]">
                <Textarea
                  placeholder="Opis kategorii (opcjonalnie)"
                  defaultValue={subcategory.description ?? ""}
                  {...field}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.description?.message}
              />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-2 pt-2">
          <Button
            disabled={isUpdating}
            aria-label="zapisz zmiany"
            className="w-fit"
          >
            {isUpdating ? (
              <>
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
                <span>Zapisywanie...</span>
              </>
            ) : (
              <span>Zapisz zmiany</span>
            )}
            <span className="sr-only">Zapisz zmiany</span>
          </Button>

          <Link
            href="/admin/podkategorie"
            className={cn(buttonVariants({ variant: "ghost" }), "w-fit")}
            aria-label="anuluj"
          >
            Anuluj
          </Link>
        </div>
      </form>
    </Form>
  )
}
