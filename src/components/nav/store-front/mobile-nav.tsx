"use client"

import * as React from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import type { NavItem } from "@/types"

import { siteConfig } from "@/config/site"

import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button, buttonVariants } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"
import { MobileNavItem } from "@/components/nav/store-front/mobile-nav-item"

interface MobileNavProps {
  navItems: NavItem[]
}

export function MobileNav({
  navItems,
}: Readonly<MobileNavProps>): JSX.Element | null {
  const segment = useSelectedLayoutSegment()
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  if (isDesktop) return null

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-5 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <Icons.menu aria-hidden="true" />
          <span className="sr-only">Rozwiń menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="w-full px-7">
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <Icons.gem className="mr-2 size-4" aria-hidden="true" />
            <span className="font-bold">{siteConfig.name}</span>
            <span className="sr-only">Strona główna</span>
          </Link>
        </div>

        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div>
            <Accordion type="multiple" className="w-full">
              {navItems.map((item, index) => (
                <AccordionItem key={index} value={item.title}>
                  <AccordionTrigger className="text-sm capitalize">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-2">
                      {item.subItems?.map((subItem, index) =>
                        subItem.href ? (
                          <MobileNavItem
                            key={index}
                            href={subItem.href}
                            segment={String(segment)}
                            setIsOpen={setIsOpen}
                            disabled={subItem.disabled}
                            className="m-1"
                          >
                            {subItem.title}
                          </MobileNavItem>
                        ) : (
                          <div
                            key={index}
                            className="text-muted-foreground transition-all"
                          >
                            {item.title}
                          </div>
                        )
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
