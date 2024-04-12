"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { addCategory } from "@/actions/category"
import type { FileWithPreview } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { generateReactHelpers } from "@uploadthing/react/hooks"
import { useForm } from "react-hook-form"

import { categorySchema, type AddCategoryInput } from "@/validations/category"

import { useToast } from "@/hooks/use-toast"
import { cn, isArrayOfFile } from "@/lib/utils"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { FileDialog } from "@/components/file-dialog"
import { Icons } from "@/components/icons"
import { Zoom } from "@/components/image-zoom"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export function AddCategoryForm(): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)
  const { isUploading, startUpload } = useUploadThing("categoryImage")

  const form = useForm<AddCategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      menuItem: true,
      images: [],
    },
  })

  function onSubmit(formData: AddCategoryInput) {
    startTransition(async () => {
      try {
        let message = null

        if (isArrayOfFile(formData.images)) {
          const uploadResults = await startUpload(formData.images)
          const formattedImages =
            uploadResults?.map((image) => ({
              id: image.key,
              name: image.key.split("_")[1] ?? image.key,
              url: image.url,
            })) ?? null

          message = await addCategory({
            ...formData,
            images: formattedImages,
          })
        } else {
          message = await addCategory({
            ...formData,
          })
        }

        switch (message) {
          case "exists":
            toast({
              title: "Podana kategoria już istnieje",
              description: "Użyj innej nazwy",
              variant: "destructive",
            })
            break
          case "success":
            toast({
              title: "Kategoria została dodana",
            })
            router.push("/admin/kategorie")
            router.refresh()
            break
          default:
            toast({
              title: "Błąd przy dodawaniu kategorii",
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full md:w-4/5 xl:w-2/3">
              <FormLabel>Nazwa</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Np. kolczyki" {...field} />
              </FormControl>
              <FormMessage className="pt-2 sm:text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full md:w-4/5 xl:w-2/3">
              <FormLabel>Opis</FormLabel>

              <FormControl className="min-h-[120px]">
                <Textarea
                  placeholder="Opis kategorii (opcjonalnie)"
                  {...field}
                />
              </FormControl>
              <FormMessage className="pt-2 sm:text-sm" />
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

        <FormItem className="mt-2.5 flex w-full flex-col gap-[5px] md:w-4/5 xl:w-2/3">
          <FormLabel>Zdjęcia</FormLabel>
          {files?.length ? (
            <div className="flex items-center gap-2">
              {files.map((file, i) => (
                <Zoom key={i}>
                  <Image
                    src={file.preview}
                    alt={file.name}
                    className="size-20 shrink-0 rounded-md object-cover object-center"
                    width={80}
                    height={80}
                  />
                </Zoom>
              ))}
            </div>
          ) : null}
          <FormControl>
            <FileDialog
              setValue={form.setValue}
              name="images"
              maxFiles={1}
              maxSize={1024 * 1024 * 4}
              files={files}
              setFiles={setFiles}
              isUploading={isUploading}
              disabled={isPending}
            />
          </FormControl>
          <UncontrolledFormMessage
            message={form.formState.errors.images?.message}
          />
        </FormItem>
        <div className=" flex items-center gap-2 pt-2">
          <Button
            disabled={isPending}
            aria-label="Dodaj kategorię"
            className="w-fit"
          >
            {isPending ? (
              <>
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
                <span>Dodawanie...</span>
              </>
            ) : (
              <span>Dodaj</span>
            )}
            <span className="sr-only">Dodaj kategorię</span>
          </Button>

          <Link
            href="/admin/kategorie"
            className={cn(buttonVariants({ variant: "ghost" }), "w-fit")}
          >
            Anuluj
          </Link>
        </div>
      </form>
    </Form>
  )
}
