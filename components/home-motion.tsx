"use client"

import { type ReactNode } from "react"
import { motion, MotionConfig, useScroll } from "framer-motion"

export function useHomeScroll() { return useScroll() }
export function HomeMotion({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">
    <main className="portfolio-home min-h-screen">{children}</main>
    <motion.div aria-hidden className="pointer-events-none fixed inset-0 z-[200] bg-black" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: .4 }} />
  </MotionConfig>
}
