import type { ReactNode } from 'react'

/**
 * Aura 整页 scroll-snap 由 `globals.css` 中
 * `html:has(main.aura-scroll-snap) body { … }` 驱动。
 */
export default function AuraProjectLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
}
