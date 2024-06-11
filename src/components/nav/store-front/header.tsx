import { mainNavItems } from "@/data/nav-items"

import auth from "@/lib/auth"

import { UserDropdown } from "@/components/auth/user-dropdown"
import { CartSheet } from "@/components/checkout/cart-sheet"
import { HeaderSearch } from "@/components/header-search"
import { MainNav } from "@/components/nav/store-front/main-nav"
import { MobileNav } from "@/components/nav/store-front/mobile-nav"

export async function Header(): Promise<JSX.Element> {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-between bg-background px-8">
      <div className="flex items-center">
        <MainNav items={mainNavItems} />
        <MobileNav navItems={mainNavItems} />
      </div>

      <div className="flex items-center gap-2 transition-all duration-300 ease-in-out">
        <HeaderSearch />
        <CartSheet />
        <UserDropdown user={session?.user || null} />
      </div>
    </header>
  )
}
