"use client"

import * as React from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"

import { adminSidebarNavItems } from "@/data/nav-items"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

export function Sidebar(): JSX.Element {
  const segment = useSelectedLayoutSegment()

  return (
    <div className="flex w-full flex-col gap-2">
      {adminSidebarNavItems.map((item, index) => {
        const Icon = Icons[item.icon as keyof typeof Icons]

        return item.href ? (
          <Link
            aria-label={item.title}
            key={index}
            href={item.href}
            target={item.external ? "_blank" : ""}
            rel={item.external ? "noreferrer" : ""}
          >
            <span
              className={cn(
                "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:bg-muted hover:text-foreground",
                item.href.includes(String(segment))
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground",
                item.disabled && "pointer-events-none opacity-60"
              )}
            >
              <Icon className="mr-2 size-4" aria-hidden="true" />
              <span>{item.title}</span>
            </span>
          </Link>
        ) : (
          <span
            key={index}
            className="flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground hover:underline"
          >
            {item.title}
          </span>
        )
      })}
    </div>
  )
}
