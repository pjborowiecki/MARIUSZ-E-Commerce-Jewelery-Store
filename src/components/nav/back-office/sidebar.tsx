"use client"

import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CustomTooltip } from "@/components/custom-tooltip"
import { Icons } from "@/components/icons"
import { SidebarNav } from "@/components/nav/back-office/sidebar-nav"

export function Sidebar(): JSX.Element {
  const [collapsed, setCollapsed] = React.useState<boolean>(false)

  return (
    <aside
      className={cn(
        "flex h-screen flex-col justify-between border-r bg-tertiary transition-all duration-300 ease-in-out",
        collapsed ? "w-fit" : "w-66 shrink-0"
      )}
    >
      <div>
        <div className="flex h-20 items-center">
          <Link
            href="/admin/start/panel"
            className="flex w-full items-center justify-center gap-2"
          >
            <Icons.gem className="size-5" aria-hidden="true" />
            <span
              className={cn(
                "whitespace-nowrap font-bold leading-none tracking-wide",
                collapsed && "hidden"
              )}
            >
              {siteConfig.name}
            </span>
          </Link>
        </div>

        <SidebarNav collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div>
        <div className="flex h-16 items-center justify-center border-t px-2">
          <CustomTooltip text={collapsed ? "Rozwiń menu" : "Zwiń menu"}>
            <Button
              variant="secondary"
              aria-label="Zwiń lub rozwiń menu"
              className="w-full transition-all duration-300 ease-in-out"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <Icons.chevronRight className="size-4" aria-hidden="true" />
              ) : (
                <Icons.chevronLeft className="size-4" aria-hidden="true" />
              )}
            </Button>
          </CustomTooltip>
        </div>
      </div>
    </aside>
  )
}
