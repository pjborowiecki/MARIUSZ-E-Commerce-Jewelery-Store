import type { Account, Profile, Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import type { FileWithPath } from "react-dropzone"

export interface NavItem {
  href: string
  hrefPlus?: string
  title: string
  description?: string
  slug: string
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
