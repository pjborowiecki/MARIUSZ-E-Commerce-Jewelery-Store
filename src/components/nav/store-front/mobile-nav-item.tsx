import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

interface MobileNavItemProps extends React.PropsWithChildren {
  children: React.ReactNode
  href: string
  disabled?: boolean
  segment: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function MobileNavItem({
  children,
  href,
  disabled,
  segment,
  setIsOpen,
}: REadonly<MobileNavItemProps>): JSX.Element {
  return (
    <Link
      href={href}
      className={cn(
        "text-foreground/70 transition-colors hover:text-foreground",
        href.includes(segment) && "text-foreground",
        disabled && "pointer-events-none opacity-60"
      )}
      onClick={() => setIsOpen(false)}
    >
      {children}
    </Link>
  )
}
