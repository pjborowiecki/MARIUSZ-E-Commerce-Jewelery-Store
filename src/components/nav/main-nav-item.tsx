"use client"

import * as React from "react"
import Link from "next/link"
import Balancer from "react-wrap-balancer"

import { cn } from "@/lib/utils"
import { NavigationMenuLink } from "@/components/ui/navigation-menu"

export const MainNavItem = React.forwardRef<
  React.ElementRef<"a">,
  {
    title: string
    href: string
    children?: React.ReactNode
    className?: string
  }
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            <Balancer>{children}</Balancer>
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})

MainNavItem.displayName = "MainNavItem"
