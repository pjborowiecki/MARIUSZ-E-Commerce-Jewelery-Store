import Link from "next/link"
import { auth } from "@/auth"

import { siteConfig } from "@/config/site"
import { mainNavItems, sidebarNavItems } from "@/data/nav-items"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignOutButton } from "@/components/auth/signout-button"
import { CartSheet } from "@/components/checkout/cart-sheet"
import { MainNav } from "@/components/nav/main-nav"
import { MobileNav } from "@/components/nav/mobile-nav"
import { ProductsCommandMenu } from "@/components/products-command-menu"

export async function Header(): Promise<JSX.Element> {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between">
      <div className="flex items-center">
        <MainNav items={mainNavItems} />
        <MobileNav
          mainNavItems={mainNavItems}
          sidebarNavItems={sidebarNavItems}
        />
      </div>

      <div className="flex items-center gap-2">
        <ProductsCommandMenu />

        {session ? (
          <SignOutButton />
        ) : (
          <Link
            href="/logowanie"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-full"
            )}
          >
            Zaloguj się
          </Link>
        )}

        <CartSheet />
      </div>
    </header>
  )
}
