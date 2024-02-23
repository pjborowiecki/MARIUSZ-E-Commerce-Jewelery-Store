import * as React from "react"

interface AdminSalesLayoutProps {
  children: React.ReactNode
}

export default function AdminSalesLayout({
  children,
}: AdminSalesLayoutProps): JSX.Element {
  return <div>{children}</div>
}
