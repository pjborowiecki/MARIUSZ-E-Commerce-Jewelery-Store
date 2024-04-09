"use client"

import Link from "next/link"
import type { NavItem } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import type { User } from "next-auth"

import { adminNavItems } from "@/data/nav-items"

import { cn } from "@/lib/utils"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SignOutButton } from "@/components/auth/signout-button"
import { Icons } from "@/components/icons"

interface HeaderProps {
  user: User | undefined
  navItems: NavItem[]
}

export function Header({ user, navItems }: HeaderProps): JSX.Element {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="rounded-md sm:hidden"
          >
            <Icons.panelLeft className="size-[18px]" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-4 text-lg font-medium">
            {navItems?.map((item) => {
              const Icon = Icons[item.icon as keyof typeof Icons]
              return (
                <Link
                  href={item.href}
                  key={item.title}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Icon className="size-5" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="relative ml-auto flex-1 md:grow-0">
        <Icons.search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Szukaj..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className={cn(
              buttonVariants({ variant: "user", size: "icon" }),
              "transition-all duration-300 ease-in-out"
            )}
          >
            <Avatar className="cursor-pointer">
              {user.image ? (
                <AvatarImage
                  src={user.image}
                  alt={user.name ?? "user's profile picture"}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                    "rounded-md"
                  )}
                />
              ) : (
                <AvatarFallback
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                    "rounded-md"
                  )}
                >
                  <Icons.user className="size-4 rounded-full" />
                </AvatarFallback>
              )}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {adminNavItems.map((item) => {
                const Icon = Icons[item.icon as keyof typeof Icons]
                return (
                  <DropdownMenuItem key={item.title}>
                    <Icon className="mr-2 size-4 text-foreground/90" />
                    <Link href={item.href}>{item.title}</Link>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuGroup>
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
        <Link href="/logowanie" className={buttonVariants({ size: "sm" })}>
          Zaloguj się
        </Link>
      )}
    </header>
  )
}
