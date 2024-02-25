import Link from "next/link"
import { auth } from "@/auth"
import type { User } from "next-auth"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { SignOutButton } from "@/components/auth/signout-button"

interface HeaderProps {
  user: User | null
}

export function Header({ user }: HeaderProps): JSX.Element {
  return (
    <header className="sticky top-0 z-[50] flex h-20 items-center justify-between gap-8 border-b bg-tertiary px-4">
      <div></div>
      <div>
        {user ? (
          <SignOutButton />
        ) : (
          <Link
            href="/logowanie"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Zaloguj się
          </Link>
        )}
      </div>
    </header>
  )
}
