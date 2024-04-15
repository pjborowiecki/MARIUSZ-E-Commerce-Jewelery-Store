"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { getCategories, getSubcategories } from "@/actions/category"
import { addProduct } from "@/actions/product"
import type { StoredFile } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { addProductSchema, type AddProductInput } from "@/validations/product"

// import { useToast } from "@/hooks/use-toast"
import { useUploadFile } from "@/hooks/use-upload-file"
import { getErrorMessage } from "@/lib/errors"
import { cn } from "@/lib/utils"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { FilesCard } from "@/components/cards/files-card"
import { FileUploader } from "@/components/file-uploader"
import { Icons } from "@/components/icons"

interface AddProductFormProps {
  promises: Promise<{
    categories: Awaited<ReturnType<typeof getCategories>>
    subcategories: Awaited<ReturnType<typeof getSubcategories>>
  }>
}

export function AddProductForm({ promises }: AddProductFormProps): JSX.Element {
  const router = useRouter()
  const { categories, subcategories } = React.use(promises)
  const [isLoading, setIsLoading] = React.useState(false)
  const { uploadFiles, progresses, uploadedFiles, isUploading } =
    useUploadFile("productImage")

  const form = useForm<AddProductInput>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      inventory: NaN,
      categoryId: "",
      subcategoryId: "",
      images: [],
    },
  })

  function onSubmit(input: AddProductInput) {
    setIsLoading(true)

    toast.promise(
      uploadFiles(input.images ?? []).then(() => {
        return addProduct({
          ...input,
          images: JSON.stringify(uploadedFiles) as unknown as StoredFile[],
        })
      }),
      {
        loading: "Adding product...",
        success: () => {
          form.reset()
          setIsLoading(false)
          return "Product"
        },
        error: (err) => {
          setIsLoading(false)
          return getErrorMessage(err)
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-2xl gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Type product name here." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type product description here."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full flex-col items-start gap-6 sm:flex-row md:w-4/5 xl:w-2/3">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Kategoria</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value: typeof field.value) =>
                    field.onChange(value)
                  }
                >
                  <FormControl>
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder={field.value} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((option) => (
                        <SelectItem
                          key={option.id}
                          value={option.id}
                          className="capitalize"
                        >
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subcategoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Podkategoria</FormLabel>
                <Select
                  value={field.value?.toString()}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz podkategorię" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {subcategories.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full flex-col items-start gap-6 sm:flex-row md:w-4/5 xl:w-2/3">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Cena</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Np. 499.99"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inventory"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Dostępność</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Ilość w magazynie"
                    value={Number.isNaN(field.value) ? "" : field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <div className="space-y-6">
              <FormItem className="mt-2.5 flex w-full flex-col gap-[5px] md:w-4/5 xl:w-2/3">
                <FormLabel>Zdjęcia</FormLabel>
                <FormControl>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Dodaj zdjęcia</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                      <DialogHeader>
                        <DialogTitle>Dodaj zdjęcia</DialogTitle>
                        <DialogDescription>
                          Drag and drop your files here or click to browse.
                        </DialogDescription>
                      </DialogHeader>
                      <FileUploader
                        value={field.value ?? []}
                        onValueChange={field.onChange}
                        maxFiles={5}
                        maxSize={5 * 1024 * 1024}
                        progresses={progresses}
                        disabled={isUploading}
                      />
                    </DialogContent>
                  </Dialog>
                </FormControl>
                <FormMessage />
              </FormItem>
              {uploadedFiles.length > 0 ? (
                <FilesCard files={uploadedFiles} />
              ) : null}
            </div>
          )}
        />

        <div className="flex items-center gap-2 pt-2">
          <Button
            onClick={() =>
              void form.trigger(["name", "description", "price", "inventory"])
            }
            className="w-fit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
                <span aria-hidden="true">Dodawanie...</span>
              </>
            ) : (
              <span>Dodaj</span>
            )}

            <span className="sr-only">Dodaj produkt</span>
          </Button>

          <Link
            href="/admin/produkty"
            className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
            aria-label="anuluj"
          >
            Anuluj
          </Link>
        </div>
      </form>
    </Form>
  )
}
