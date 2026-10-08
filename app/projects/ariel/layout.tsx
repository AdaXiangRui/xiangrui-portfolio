import type { ReactNode } from 'react'

/**
 * Ariel 整页 scroll-snap 由 `globals.css` 中
 * `html:has(main.ariel-scroll-snap) body { … }` 驱动。
 */
export default function ArielProjectLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
}
