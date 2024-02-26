import Link from "next/link"
import type { User } from "next-auth"

import { siteConfig } from "@/config/site"
import { adminNavItems } from "@/data/nav-items"

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
import { CustomTooltip } from "@/components/custom-tooltip"
import { Icons } from "@/components/icons"

interface HeaderProps {
  user: User | null
}

export function Header({ user }: HeaderProps): JSX.Element {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-tertiary px-8">
      <Link href="/" className="text-xl font-semibold uppercase tracking-tight">
        {siteConfig.name}
      </Link>
      <div>
        {user ? (
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
                  {user.image ? (
                    <AvatarImage
                      src={user.image}
                      alt={user.name ?? "user's profile picture"}
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
      </div>
    </header>
  )
}
