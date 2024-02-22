import type { Account, Profile, Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
  description?: string
  items?: NavItem[]
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
