import * as React from "react"

interface ClientZoneLayoutProps {
  children: React.ReactNode
}

export default function ClientZoneLayout({
  children,
}: ClientZoneLayoutProps): JSX.Element {
  return <div>{children}</div>
}
