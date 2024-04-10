"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { updateCategory } from "@/actions/category"
import type { FileWithPreview } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Switch } from "@radix-ui/react-switch"
import { generateReactHelpers } from "@uploadthing/react/hooks"
import { useForm } from "react-hook-form"

import { categories, type Category } from "@/db/schema"
import {
  updateCategoryFormSchema,
  type UpdateCategoryFormInput,
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
  FormMessage,
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
import { Textarea } from "@/components/ui/textarea"
import { FileDialog } from "@/components/file-dialog"
import { Icons } from "@/components/icons"
import { Zoom } from "@/components/image-zoom"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

interface UpdateCategoryFormProps {
  category: Category
}

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export function UpdateCategoryForm({
  category,
}: UpdateCategoryFormProps): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)
  const [isUpdating, startUpdateTransition] = React.useTransition()

  React.useEffect(() => {
    if (category.images && category.images.length > 0) {
      setFiles(
        category.images.map((image) => {
          const file = new File([], image.name, {
            type: "image",
          })
          const fileWithPreview = Object.assign(file, {
            preview: image.url,
          })

          return fileWithPreview
        })
      )
    }
  }, [category])

  const { isUploading, startUpload } = useUploadThing("categoryImage")

  const form = useForm<UpdateCategoryFormInput>({
    resolver: zodResolver(updateCategoryFormSchema),
    defaultValues: {
      name: category.name,
      menuItem: category.menuItem,
      images: category.images,
    },
  })

  function onSubmit(formData: UpdateCategoryFormInput) {
    startUpdateTransition(async () => {
      try {
        const images = isArrayOfFile(formData.images)
          ? await startUpload(formData.images).then((res) => {
              const formattedImages = res?.map((image) => ({
                id: image.key,
                name: image.key.split("_")[1] ?? image.key,
                url: image.url,
              }))
              return formattedImages ?? null
            })
          : null

        const message = await updateCategory({
          id: product.id,
          name: formData.name,
          description: formData.description,
          menuItem: formData.menuItem,
          images: images ?? product.images,
        })

        switch (message) {
          case "success":
            toast({
              title: "Produkt został zaktualizowany",
            })
            setFiles(null)
            router.push("/admin/produkty")
            break
          case "not-found":
            toast({
              title: "Nie znaleziono produktu",
              description: "Produkt o podanym numerze Id nie istnieje",
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
              title: "Nie udało się zaktualizować produktu",
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
        <FormItem className="w-full md:w-4/5  xl:w-2/3">
          <FormLabel>Nazwa</FormLabel>
          <FormControl>
            <Input
              aria-invalid={!!form.formState.errors.name}
              type="text"
              placeholder="Np. kolczyki"
              defaultValue={category.name}
              {...form.register("name")}
            />
            <UncontrolledFormMessage
              message={form.formState.errors.name?.message}
            />
          </FormControl>
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
              disabled={isUpdating}
            />
          </FormControl>
          <UncontrolledFormMessage
            message={form.formState.errors.images?.message}
          />
        </FormItem>
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
