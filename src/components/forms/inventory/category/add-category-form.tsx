"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { addCategory } from "@/actions/category"
import type { StoredFile } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  addCategorySchema,
  type AddCategoryInput,
} from "@/validations/category"

import { useToast } from "@/hooks/use-toast"
import { useUploadFile } from "@/hooks/use-upload-file"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { FilesCard } from "@/components/cards/files-card"
import { FileUploader } from "@/components/file-uploader"
import { Icons } from "@/components/icons"

export function AddCategoryForm(): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()
  const { uploadFiles, progresses, uploadedFiles, isUploading } =
    useUploadFile("categoryImage")

  const form = useForm<AddCategoryInput>({
    resolver: zodResolver(addCategorySchema),
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
        const message = await uploadFiles(formData.images ?? []).then(() => {
          return addCategory({
            name: formData.name.toLowerCase(),
            description: formData.description,
            menuItem: formData.menuItem,
            images:
              uploadedFiles.length > 0
                ? (JSON.stringify(uploadedFiles) as unknown as StoredFile[])
                : null,
          })
        })

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
              <FormMessage className="sm:text-sm" />
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
              <FormMessage className="sm:text-sm" />
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
              <FormMessage className="sm:text-sm" />
            </FormItem>
          )}
        />

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
                        <DialogTitle>Dodawanie zdjęć</DialogTitle>
                        <DialogDescription>
                          Maksymalnie jedno zdjęcie o wielkości do 2MB
                        </DialogDescription>
                      </DialogHeader>
                      <FileUploader
                        value={field.value ?? []}
                        onValueChange={field.onChange}
                        maxFiles={1}
                        maxSize={2 * 1024 * 1024}
                        progresses={progresses}
                        disabled={isUploading}
                      />
                    </DialogContent>
                  </Dialog>
                </FormControl>
                <FormMessage className="sm:text-sm" />
              </FormItem>
              {uploadedFiles.length > 0 ? (
                <FilesCard files={uploadedFiles} />
              ) : null}
            </div>
          )}
        />

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
