import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

interface MobileNavItemProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
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
  className,
  ...props
}: Readonly<MobileNavItemProps>): JSX.Element {
  return (
    <Link
      href={href}
      className={cn(
        "text-muted-foreground transition-all hover:text-foreground",
        href.includes(segment) && "text-foreground",
        disabled && "pointer-events-none opacity-60",
        className
      )}
      onClick={() => setIsOpen(false)}
      {...props}
    >
      {children}
    </Link>
  )
}
