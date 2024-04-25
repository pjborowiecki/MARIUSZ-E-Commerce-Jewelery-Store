import type { Metadata } from "next"
import type { SearchParams } from "@/types"

import { env } from "@/env.mjs"
import type { Product } from "@/db/schema"

interface SubcategoryPageProps {
  params: {
    categoryName: string
    subcategoryName: string
  }
  searchParams: SearchParams
}
