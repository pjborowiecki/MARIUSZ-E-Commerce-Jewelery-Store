import * as z from "zod"

import { products } from "@/db/schema"

import { categoryNameSchema } from "./category"

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  from: z.string().optional(),
  to: z.string().optional(),
  sort: z.string().optional().default("createdAt.desc"),
})

export const productsSearchParamsSchema = searchParamsSchema
  .omit({ from: true, to: true })
  .extend({
    categories: z.string().optional(),
    subcategory: z.string().optional(),
    subcategories: z.string().optional(),
    price_range: z.string().optional(),
    active: z.string().optional().default("true"),
  })

export const getProductsSearchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional().default("createdAt.desc"),
  categoryName: categoryNameSchema.optional(),
  subcategoryName: categoryNameSchema.optional(),
  price_range: z.string().optional().nullable(),
  state: z.enum(products.state.enumValues).optional().default("aktywny"),
  importance: z
    .enum(products.importance.enumValues)
    .optional()
    .default("standardowy"),
})

export const storeProductsSearchParamsSchema = searchParamsSchema.extend({
  name: z.string().optional(),
  categoryName: z.string().optional(),
  subcategoryName: z.string().optional(),
})

export const storeSearchParamsSchema = searchParamsSchema
  .omit({
    sort: true,
    from: true,
    to: true,
  })
  .extend({
    sort: z.string().optional().default("productCount.desc"),
  })

export const purchasesSearchParamsSchema = searchParamsSchema
  .omit({ from: true, to: true })
  .extend({
    status: z.string().optional(),
  })

export const ordersSearchParamsSchema = searchParamsSchema.extend({
  customer: z.string().optional(),
  status: z.string().optional(),
})

export const customersSearchParamsSchema = searchParamsSchema.extend({
  email: z.string().optional(),
})

export const customerSearchParamsSchema = searchParamsSchema.extend({
  status: z.string().optional(),
})

export const productCategoriesSearchParamsSchema = searchParamsSchema
  .omit({
    from: true,
    to: true,
  })
  .extend({
    name: z.string().optional(),
  })

export const productSubcategoriesSearchParamsSchema =
  productCategoriesSearchParamsSchema

export const registeredUsersSearchParamsSchema = searchParamsSchema.extend({
  email: z.string().optional(),
})
