"use client"

import * as React from "react"
import Link from "next/link"
import type { NavItem } from "@/types"
import Balancer from "react-wrap-balancer"

import { siteConfig } from "@/config/site"

import { cn } from "@/lib/utils"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { MainNavItem } from "@/components/nav/store-front/main-nav-item"

interface MainNavProps {
  items: NavItem[]
}

export function MainNav({ items }: Readonly<MainNavProps>): JSX.Element {
  return (
    <div className="hidden w-full items-center gap-12 bg-background lg:flex">
      <Link
        href="/"
        className="text-2xl font-semibold uppercase tracking-tight"
      >
        {siteConfig.name}
      </Link>

      <NavigationMenu>
        <NavigationMenuList>
          {items.map((item) =>
            item?.subItems ? (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuTrigger className="h-auto capitalize tracking-tight text-muted-foreground">
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {item.subItems.map((subItem) => (
                      <MainNavItem
                        key={subItem.title}
                        title={subItem.title}
                        href={subItem.href}
                      >
                        {subItem.description}
                      </MainNavItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem key={item.title}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), "h-auto")}
                  >
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )
          )}

          {/* Last item (About us) */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="h-auto text-muted-foreground">
              O nas
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className="flex size-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        {siteConfig.name}
                      </div>
                      <p className="text-xs leading-tight text-muted-foreground">
                        <Balancer>{siteConfig.description}</Balancer>
                      </p>
                      <span className="sr-only">Home</span>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <MainNavItem title="Kim jesteśmy" href="/kim-jestesmy">
                  {
                    "Poznaj naszą historię i dowiedz się dlaczego warto u nas kupować"
                  }
                </MainNavItem>

                <MainNavItem title="Nasza misja" href="/misja">
                  {
                    "Odkryj czym się kierujemy oraz co jest dla nas naprawdę ważne"
                  }
                </MainNavItem>

                <MainNavItem title="Blog" href="/blog">
                  {
                    "Korzystaj z naszego cennego doświadczenia i obszernej wiedzy"
                  }
                </MainNavItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
