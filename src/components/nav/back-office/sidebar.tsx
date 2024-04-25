"use client"

import * as React from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import type { NavItem } from "@/types"

import { cn } from "@/lib/utils"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"

interface SidebarProps {
  navItems: NavItem[]
}

export function Sidebar({ navItems }: Readonly<SidebarProps>): JSX.Element {
  const segment = useSelectedLayoutSegment()

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-[18px]">
        <TooltipProvider>
          {navItems?.map((item) => {
            const Icon = Icons[item.icon as keyof typeof Icons]

            return (
              <Tooltip key={item.title}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    aria-label={item.title}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg text-muted-foreground md:size-8",
                      "transition-colors hover:bg-accent hover:text-foreground",
                      item.slug?.startsWith(String(segment)) &&
                        "bg-accent text-accent-foreground"
                    )}
                  >
                    <Icon className="size-5" />
                    <span className="sr-only">{item.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </nav>

      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/admin/ustawienia"
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:size-8"
              >
                <Icons.settings className="size-5" />
                <span className="sr-only">Ustawienia</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Ustawienia</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  )
}
