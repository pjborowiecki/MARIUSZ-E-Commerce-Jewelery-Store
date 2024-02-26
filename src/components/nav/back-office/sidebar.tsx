"use client"

import * as React from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"

import { adminNavItems } from "@/data/nav-items"

import { cn } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Icons } from "@/components/icons"

export function Sidebar(): JSX.Element {
  const segment = useSelectedLayoutSegment()

  return (
    <aside className="hidden h-full w-56 overflow-y-auto border-r bg-tertiary pl-4 md:sticky md:block">
      <ScrollArea className="py-6">
        <div className="flex w-full flex-col gap-2">
          {adminNavItems.map((item) => {
            const Icon = Icons[item.icon as keyof typeof Icons]
            return (
              <Link
                key={item.title}
                href={item.href}
                aria-label={item.title}
                target={item.external ? "_blank" : ""}
                rel={item.external ? "noreferrer" : ""}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-full justify-start",
                  item.href.includes(String(segment)) &&
                    cn(
                      buttonVariants({ variant: "secondary" }),
                      "justify-start"
                    )
                )}
              >
                <Icon className="mr-2 size-4" aria-hidden="true" />
                {item.title}
              </Link>
            )
          })}
        </div>
      </ScrollArea>
    </aside>
  )
}
