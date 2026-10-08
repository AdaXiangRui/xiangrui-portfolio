import type { ReactNode } from 'react'

/**
 * Quipu 整页 scroll-snap 由 `globals.css` 中
 * `html:has(main.quipu-scroll-snap) body { … }` 驱动。
 */
export default function QuipuProjectLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
}
