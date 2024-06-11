"use client"

import Link from "next/link"
import type { NavItem } from "@/types"
import type { User } from "next-auth"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserDropdown } from "@/components/auth/user-dropdown"
import { Icons } from "@/components/icons"

interface HeaderProps {
  user: User | null
  navItems: NavItem[]
}

export function Header({ user, navItems }: Readonly<HeaderProps>): JSX.Element {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
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

      <UserDropdown user={user} />
    </header>
  )
}
