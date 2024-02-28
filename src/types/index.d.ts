import type { Account, Profile, Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import type { FileWithPath } from "react-dropzone"
import type { Stripe } from "stripe"

export interface NavItem {
  href: string
  hrefPlus?: string
  title: string
  description?: string
  slug?: string
  disabled?: boolean
  external?: boolean
  image?: string
  icon?: keyof typeof Icons
  subItems?: NavItem[]
}

export interface FooterSubItem {
  title: string
  href: string
  external?: boolean
}

export interface NavItemFooter {
  title: string
  items: FooterSubItem[]
}

export interface SessionCallbackParams {
  session: Session
  token: JWT
  user: User
}

export interface JWTCallbackParams {
  token: JWT
  user?: User | undefined
  account?: Account | null | undefined
  profile?: Profile | undefined
  isNewUser?: boolean | undefined
}

export interface SearchParams {
  [key: string]: string | string[] | undefined
}
export interface BlogPostParamsProps {
  params: {
    slug: string[]
  }
}

export interface FrequentlyAskedQuestion {
  question: string
  answer: string
}

export interface Testimonial {
  title: string
  body: string
  name: string
  role: string
  avatar: string
}

export interface StoredFile {
  id: string
  name: string
  url: string
}

export type FileWithPreview = FileWithPath & {
  preview: string
}

export interface Option {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface DataTableSearchableColumn<TData> {
  id: keyof TData
  title: string
}

export interface DataTableFilterableColumn<TData>
  extends DataTableSearchableColumn<TData> {
  options: Option[]
}

export interface Category {
  title: Product["category"]
  image: string
  icon: React.ComponentType<{ className?: string }>
  subcategories: Subcategory[]
}

export interface Subcategory {
  title: string
  description?: string
  image?: string
  slug: string
}

export type StripePaymentStatus = Stripe.PaymentIntent.Status
