"use client"

import { signOut } from "next-auth/react"

import { DEFAULT_SIGNOUT_REDIRECT } from "@/config/defaults"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface SignOutButtonProps {
  buttonStyles?: string
  buttonSize?: string
  iconStyles?: string
}

export function SignOutButton({
  buttonStyles,
  iconStyles,
}: SignOutButtonProps): JSX.Element {
  return (
    <Button
      aria-label="Wyloguj się"
      variant="ghost"
      className={cn("w-full justify-start text-sm", buttonStyles)}
      onClick={() =>
        void signOut({
          callbackUrl: DEFAULT_SIGNOUT_REDIRECT,
          redirect: true,
        })
      }
    >
      <Icons.logout
        className={cn("mr-2 size-4", iconStyles)}
        aria-hidden="true"
      />
      Wyloguj się
    </Button>
  )
}
