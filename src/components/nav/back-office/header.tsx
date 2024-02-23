import Link from "next/link"
import { auth } from "@/auth"

import { SignOutButton } from "@/components/auth/signout-button"
import { Icons } from "@/components/icons"

export async function Header(): Promise<JSX.Element> {
  const session = await auth()

  return (
    <header className="sticky top-0 z-[50] flex h-20 items-center justify-between gap-8 border-b bg-tertiary px-5">
      <div>Admin Dashboard Header</div>
      <div>
        {session?.user ? (
          <SignOutButton />
        ) : (
          <Link href="/logowanie">Zaloguj się</Link>
        )}
      </div>
    </header>
  )
}
