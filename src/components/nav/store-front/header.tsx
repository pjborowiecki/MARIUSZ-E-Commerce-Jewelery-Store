import Link from "next/link"
import { auth } from "@/auth"

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignOutButton } from "@/components/auth/signout-button"
import { CartSheet } from "@/components/checkout/cart-sheet"
import { CustomTooltip } from "@/components/custom-tooltip"
import { HeaderSearch } from "@/components/header-search"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/nav/store-front/main-nav"
import { MobileNav } from "@/components/nav/store-front/mobile-nav"

export async function Header(): Promise<JSX.Element> {
  const session = await auth()

  return (
    <header className="sticky top-0 z-[50] flex h-20 w-full items-center justify-between bg-background px-8">
      <div className="flex items-center">
        <MainNav items={mainNavItems} />
        <MobileNav navItems={mainNavItems} />
      </div>

      <div className="flex items-center gap-2">
        <HeaderSearch />

        <CustomTooltip text="Zawartość koszyka">
          <CartSheet />
        </CustomTooltip>

        {session ? (
          <DropdownMenu>
            <CustomTooltip text="Zarządzanie kontem">
              <DropdownMenuTrigger
                asChild
                className={cn(
                  buttonVariants({ variant: "user", size: "icon" }),
                  "transition-all duration-300 ease-in-out"
                )}
              >
                <Avatar className="size-8">
                  {session.user.image ? (
                    <AvatarImage
                      src={session.user.image}
                      alt={session.user.name ?? "user's profile picture"}
                      className="size-5 rounded-full border border-border"
                    />
                  ) : (
                    <AvatarFallback className="size-8 cursor-pointer border border-border bg-transparent p-1.5 hover:bg-secondary">
                      <Icons.user className="size-4 rounded-full" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </DropdownMenuTrigger>
            </CustomTooltip>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <p className="text-xs leading-none text-muted-foreground">
                  {session.user.email}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/panel-klienta/ustawienia/dane-osobowe">
                    <Icons.settings
                      className="mr-2 size-4 text-foreground/90"
                      aria-hidden="true"
                    />
                    Ustawienia
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/panel-klienta/zamowienia">
                    <Icons.package
                      className="mr-2 size-4 text-foreground/90"
                      aria-hidden="true"
                    />
                    Zamówienia
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/panel-klienta/ulubione">
                    <Icons.heart
                      className="mr-2 size-4 text-foreground/90"
                      aria-hidden="true"
                    />
                    Ulubione
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              {session?.user.role === "administrator" && (
                <div>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer bg-secondary"
                    >
                      <Link href="/admin/zamowienia" className="">
                        <Icons.dashboard className="mr-2 size-4" />
                        Panel administratora
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </div>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <SignOutButton
                  buttonStyles="border-none px-0 py-[1px] shadow-none tracking-tight h-auto font-medium text-foreground/90 text-[14px]"
                  iconStyles="text-foreground/80"
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
      </div>
    </header>
  )
}
