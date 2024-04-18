"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { updateCategory } from "@/actions/category"
import type { FileWithPreview } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { categories, type Category } from "@/db/schema"
import {
  updateCategorySchema,
  type UpdateCategoryInput,
} from "@/validations/category"

import { useToast } from "@/hooks/use-toast"
import { useUploadThing } from "@/hooks/use-uploadthing"
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

interface UpdateCategoryFormProps {
  category: Category
}

export function UpdateCategoryForm({
  category,
}: UpdateCategoryFormProps): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)
  const [isUpdating, startUpdateTransition] = React.useTransition()
  const { isUploading, startUpload } = useUploadThing("categoryImage")

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

  const form = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      id: category.id,
      name: category.name,
      description: category.description ?? "",
      visibility: category.visibility,
      images: category.images ?? [],
    },
  })

  function onSubmit(formData: UpdateCategoryInput) {
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
          id: formData.id,
          name: formData.name,
          description: formData.description,
          visibility: formData.visibility,
          images: images ?? category.images,
        })

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
              description: "Kategoria o podanym numerze Id nie istnieje",
              variant: "destructive",
            })
            break
          case "success":
            toast({
              title: "Kategoria została zaktualizowana",
            })
            router.push("/admin/kategorie")
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
        <FormItem className="w-full md:w-4/5 xl:w-2/3">
          <FormLabel>Id</FormLabel>
          <FormControl>
            <Input
              type="text"
              disabled
              defaultValue={category.id}
              {...form.register("id")}
            />
          </FormControl>
        </FormItem>

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
          name="visibility"
          render={({ field }) => (
            <FormItem className="w-full md:w-4/5 xl:w-2/3">
              <FormLabel>Widoczność w menu</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value: typeof field.value) =>
                    field.onChange(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={field.value} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(categories.visibility.enumValues).map(
                        (option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        )
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage className="sm:text-sm" />
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
