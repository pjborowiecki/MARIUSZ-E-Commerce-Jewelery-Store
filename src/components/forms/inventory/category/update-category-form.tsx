"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { updateCategory } from "@/actions/category"
import type { FileWithPreview } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { generateReactHelpers } from "@uploadthing/react/hooks"
import { useForm } from "react-hook-form"

import { categories, type Category } from "@/db/schema"
import {
  updateCategorySchema,
  type UpdateCategoryInput,
} from "@/validations/category"

import { useToast } from "@/hooks/use-toast"
import { cn, isArrayOfFile } from "@/lib/utils"

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"

interface UpdateCategoryFormProps {
  category: Category
}

export function UpdateCategoryForm({
  category,
}: UpdateCategoryFormProps): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [isUpdating, startUpdateTransition] = React.useTransition()

  const form = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: category.name,
      menuItem: category.menuItem,
      images: category.images,
    },
  })

  function onSubmit(formData: UpdateCategoryInput) {
    startUpdateTransition(async () => {
      try {
        switch (message) {
          case "success":
            toast({
              title: "Kategoria została zaktualizowana",
            })
            setFiles(null)
            router.push("/admin/kategorie")
            break
          case "not-found":
            toast({
              title: "Nie znaleziono kategorii",
              description: "Kategoria o podanym numerze Id nie istnieje",
              variant: "destructive",
            })
            break
          case "invalid-input":
            toast({
              title: "Nieprawidłowy typ danych wejściowych",
              variant: "destructive",
            })
            break
          default:
            toast({
              title: "Nie udało się zaktualizować kategorii",
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
        <FormItem></FormItem>

        <FormItem className="w-full md:w-4/5 xl:w-2/3">
          <FormLabel>Nazwa</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="Np. kolczyki"
              defaultValue={category.name}
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
                  defaultValue={category.description ?? ""}
                  {...field}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.description?.message}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="menuItem"
          render={({ field }) => (
            <FormItem className="mt-3 flex w-full items-center justify-between rounded-md border px-3 py-2.5 md:w-4/5 xl:w-2/3">
              <FormLabel>Widoczna w menu</FormLabel>
              <FormControl className="!my-0">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-readonly
                />
              </FormControl>
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
            href="/admin/kategorie"
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
