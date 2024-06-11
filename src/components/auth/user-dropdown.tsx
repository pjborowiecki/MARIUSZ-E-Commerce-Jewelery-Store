// TODO: Check the import
import * as React from "react"
import Link from "next/link"
import { type User } from "next-auth"

import { cn } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Button,
  buttonVariants,
  type ButtonProps,
} from "@/components/ui/button"
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
import { Icons } from "@/components/icons"

interface UserDropdownProps
  extends React.ComponentPropsWithRef<typeof DropdownMenuTrigger> {
  user: User | null
}

export function UserDropdown({
  user,
}: Readonly<UserDropdownProps>): JSX.Element {
  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "size-8 shrink-0 cursor-pointer"
            )}
          >
            <Avatar>
              <AvatarImage
                src={user.image ?? ""}
                alt={user.email ?? "current user's avatar"}
              />
              <AvatarFallback className="flex items-center justify-center bg-transparent">
                <Icons.user className="p-1" />
              </AvatarFallback>
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

            {user.role === "administrator" && (
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
    </>
  )
}
