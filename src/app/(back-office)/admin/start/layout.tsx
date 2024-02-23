import * as React from "react"

import { Subheader } from "@/components/nav/back-office/subheader"

interface AdminStartLayoutProps {
  children: React.ReactNode
}

export default function AdminStartLayout({
  children,
}: AdminStartLayoutProps): JSX.Element {
  return (
    <div>
      <Subheader />
      <div>{children}</div>
    </div>
  )
}
