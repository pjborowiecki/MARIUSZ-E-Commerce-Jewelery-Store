"use client"

import * as React from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import type { NavItem } from "@/types"

import { cn } from "@/lib/utils"

interface SidebarProps {
  navItems: NavItem[]
}

export function Sidebar({ navItems }: Readonly<SidebarProps>): JSX.Element {
  const segment = useSelectedLayoutSegment()

  return (
    <aside>
      <nav className="grid gap-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm text-muted-foreground",
              item.slug?.startsWith(String(segment)) &&
                "font-semibold text-primary"
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
