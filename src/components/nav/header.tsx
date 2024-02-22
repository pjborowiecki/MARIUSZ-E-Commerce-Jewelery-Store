import Link from "next/link"
import { auth } from "@/auth"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { SignOutButton } from "@/components/auth/signout-button"

export async function Header(): Promise<JSX.Element> {
  const session = await auth()

  return (
    <header className="flex h-16 items-center justify-between">
      <div>{siteConfig.name}</div>
      <div>
        {session ? (
          <SignOutButton />
        ) : (
          <Link href="/logowanie" className={cn(buttonVariants(), "")}>
            sign In
          </Link>
        )}
      </div>
    </header>
  )
}
