"use client"

import * as React from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import type { NavItem } from "@/types"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"

interface MobileNavProps {
  mainNavItems: NavItem[]
  sidebarNavItems: NavItem[]
}

export function MobileNav({
  mainNavItems,
  sidebarNavItems,
}: MobileNavProps): JSX.Element {
  const segment = useSelectedLayoutSegment()
  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  return <Sheet open={isOpen} onOpenChange={setIsOpen}></Sheet>
}
