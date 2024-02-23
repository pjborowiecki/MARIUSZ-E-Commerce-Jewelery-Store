import * as React from "react"

interface AdminInventoryLayoutProps {
  children: React.ReactNode
}

export default function AdminInventoryLayout({
  children,
}: AdminInventoryLayoutProps): JSX.Element {
  return <div>{children}</div>
}
