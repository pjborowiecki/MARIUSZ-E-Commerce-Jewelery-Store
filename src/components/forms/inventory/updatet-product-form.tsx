"use client"

import * as React from "react"
import { updateProduct } from "@/actions/product"
import {useRouter} from "next/navigation"
import Image from "next/image"
import {products, type Product} from "@/db/schema"
import type {FileWithPreview} from "@/types"
import {zodResolver} from "@hookform/resolvers/zod"
import type { Product } from "@/db/schema"
import {
  updateProductSchema,
  type UpdateProductInput,
} from "@/validations/product"
import {generateReactHelpers} from "@uploadthing/react/hooks"
import { useToast } from "@/hooks/use-toast"
import {useForm} from "react-hook-form"
import { Button } from "@/components/ui/button"
import {getSubcategories} from "@/data/products"
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

interface UpdateProductFormProps {
  product: Product
}

const {useUploadThing} = generateReactHelpers<OurFileRouter>()

export function UpdateProductForm({
  product,
}: UpdateProductFormProps): JSX.Element {
  const { toast } = useToast()
  const router = useRouter()
  const [files, setFiles] = React.useState<OurFileRouter[] | null>(null)
  const [isUpdating, startUpdateTransition] = React.useTransition()
  const [isDeleting, startDeleteTransition] = React.useTransition()

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
      category: product.category,
      subcategory: product.subcategory
    }
  })

  const subcategories = getSubcategories(form.watch("category"))


  return (
    <Form {...form}>
      <form className=""></form>
    </Form>
  )
}
