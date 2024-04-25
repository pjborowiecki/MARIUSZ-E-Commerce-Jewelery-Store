"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { updateProduct } from "@/actions/product"
import type { FileWithPreview } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  products,
  subcategories,
  type Category,
  type Product,
  type Subcategory,
} from "@/db/schema"
import {
  updateProductSchema,
  type UpdateProductInput,
} from "@/validations/product"
import { getSubcategories } from "@/data/products"

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

interface UpdateProductFormProps {
  product: Product
  categories: Category[]
  subcategories: Subcategory[]
}

export function UpdateProductForm({
  product,
  categories,
  subcategories,
}: Readonly<UpdateProductFormProps>): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)

  const [filteredSubcategories, setFilteredSubcategories] = React.useState<
    Subcategory[]
  >(() => {
    return subcategories.filter(
      (subcategory) => subcategory.categoryName === product.categoryName
    )
  })

  const [isUpdating, startUpdateTransition] = React.useTransition()
  const { isUploading, startUpload } = useUploadThing("productImage")

  React.useEffect(() => {
    if (product.images && product.images.length > 0) {
      setFiles(
        product.images.map((image) => {
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
  }, [product])

  const form = useForm<UpdateProductInput>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      id: product.id,
      name: product.name,
      description: product.description ?? "",
      state: product.state,
      categoryName: product.categoryName,
      subcategoryName: product.subcategoryName,
      price: product.price,
      inventory: product.inventory,
      images: product.images,
    },
  })

  // TODO: Handle image update
  function onSubmit(formData: UpdateProductInput): void {
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

        const message = await updateProduct({
          id: product.id,
          name: formData.name,
          description: formData.description,
          state: formData.state,
          categoryName: formData.categoryName,
          subcategoryName: formData.subcategoryName,
          price: formData.price,
          inventory: formData.inventory,
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
        <FormItem className="w-full md:w-4/5 xl:w-2/3">
          <FormLabel>Id</FormLabel>
          <FormControl>
            <Input
              type="text"
              disabled
              defaultValue={product.id}
              {...form.register("id")}
            />
          </FormControl>
        </FormItem>

        <FormItem className="w-full md:w-4/5 xl:w-2/3">
          <FormLabel>Nazwa</FormLabel>
          <FormControl>
            <Input
              aria-invalid={!!form.formState.errors.name}
              placeholder="Nazwa produktu"
              defaultValue={product.name}
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
                  placeholder="Opis produktu (opcjonalnie)"
                  defaultValue={product.description ?? ""}
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
          name="state"
          render={({ field }) => (
            <FormItem className="w-full md:w-4/5 xl:w-2/3">
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value: typeof field.value) =>
                    field.onChange(value)
                  }
                  disabled={categories && categories.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={field.value || "Wybierz kategorię"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(products.state.enumValues).map(
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

              <UncontrolledFormMessage>
                {form.formState.errors.state?.message}
              </UncontrolledFormMessage>
            </FormItem>
          )}
        />

        <div className="flex w-full flex-col items-start gap-6 sm:flex-row md:w-4/5 xl:w-2/3">
          <FormField
            control={form.control}
            name="categoryName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Kategoria</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value: typeof field.value) => {
                      const filteredSubcategories = subcategories.filter(
                        (subcategory) => subcategory.categoryName === value
                      )
                      field.onChange(value)
                      setFilteredSubcategories(filteredSubcategories)
                      form.setValue("subcategoryName", "")
                    }}
                    disabled={categories?.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={field.value || "Wybierz kategorię"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>

                <UncontrolledFormMessage>
                  {form.formState.errors.categoryName?.message}
                </UncontrolledFormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subcategoryName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Podkategoria</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value: typeof field.value) =>
                      field.onChange(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={field.value || "Wybierz podkategorię"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {filteredSubcategories.map((subcategory) => (
                          <SelectItem
                            key={subcategory.id}
                            value={subcategory.name}
                          >
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>

                <UncontrolledFormMessage>
                  {form.formState.errors.subcategoryName?.message}
                </UncontrolledFormMessage>
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full flex-col items-start gap-6 sm:flex-row md:w-4/5 xl:w-2/3">
          <FormItem className="w-full">
            <FormLabel>Cena</FormLabel>
            <FormControl>
              <Input
                placeholder="Np. 499.99"
                defaultValue={product.price}
                {...form.register("price")}
              />
            </FormControl>
            <UncontrolledFormMessage
              message={form.formState.errors.price?.message}
            />
          </FormItem>

          <FormItem className="w-full">
            <FormLabel>Dostępność</FormLabel>
            <FormControl>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="Ilość w magazynie"
                {...form.register("inventory", {
                  valueAsNumber: true,
                })}
                defaultValue={product.inventory}
              />
            </FormControl>
            <UncontrolledFormMessage
              message={form.formState.errors.inventory?.message}
            />
          </FormItem>
        </div>

        <FormItem className="mt-2.5 flex w-full flex-col gap-[5px] md:w-4/5 xl:w-2/3">
          <FormLabel>Zdjęcia</FormLabel>
          {files?.length ? (
            <div className="flex items-center gap-2">
              {files.map((file, i) => {
                console.log(file.preview)
                return (
                  <Zoom key={i}>
                    <Image
                      src={file.preview}
                      alt={file.name}
                      className="size-20 shrink-0 rounded-md object-cover object-center"
                      width={80}
                      height={80}
                    />
                  </Zoom>
                )
              })}
            </div>
          ) : null}
          <FormControl>
            <FileDialog
              setValue={form.setValue}
              name="images"
              maxFiles={5}
              maxSize={1024 * 1024 * 2}
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
                <span>Zapisywanie ...</span>
              </>
            ) : (
              <span>Zapisz zmiany</span>
            )}
            <span className="sr-only">Zapisz zmiany</span>
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
