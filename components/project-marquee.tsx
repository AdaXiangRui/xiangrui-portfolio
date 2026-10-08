"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from "framer-motion"
import { useHomeScroll } from "./home-motion"

export function ProjectMarquee({ images }: { images: string[] }) {
  const ref = useRef<HTMLElement>(null)
  const top = useMotionValue(0), height = useMotionValue(0)
  const { scrollY } = useHomeScroll()
  const reduced = useReducedMotion()
  const inView = useInView(ref)
  const [copiesPerSet, setCopiesPerSet] = useState(1)
  const [active, setActive] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useMotionValueEvent(scrollY, "change", () => {
    if (reduced || !inView) return
    setActive(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setActive(false), 150)
  })
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const measure = () => { top.set(element.getBoundingClientRect().top + window.scrollY); height.set(window.innerHeight); setCopiesPerSet(Math.max(1, Math.ceil(window.innerWidth / (Math.ceil(images.length / 2) * 432)))) }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(document.documentElement)
    window.addEventListener("resize", measure, { passive: true })
    return () => { observer.disconnect(); window.removeEventListener("resize", measure) }
  }, [top, height, images.length])
  const offset = useTransform(() => reduced ? 0 : (scrollY.get() - top.get() + height.get()) * .3)
  const rows = [0, 1].map(parity => Array.from({ length: copiesPerSet }, () => images.filter((_, index) => index % 2 === parity)).flat())
  const width = rows[0].length * 432
  // Reset by a complete repeated set; the visible sequence remains identical.
  const left = useTransform(offset, value => -width - ((value % width) + width) % width)
  const right = useTransform(offset, value => -width + (((value + 222) % width) + width) % width)
  return <motion.section ref={ref} aria-hidden="true" className="relative overflow-hidden bg-[#0a0f1e] py-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: .1 }} transition={{ duration: .5 }}>
    <div className="flex flex-col gap-3">
      {[left, right].map((x, row) => <motion.div key={row} className="flex w-max gap-3" style={{ x: reduced ? 0 : x, willChange: active && inView && !reduced ? "transform" : "auto" }}>
        {[0, 1, 2].flatMap(copy => rows[row].map((src, tileIndex) => <div key={`${copy}-${tileIndex}-${src}`} className="relative w-[420px] shrink-0 overflow-hidden rounded-2xl" style={{ height: row === 0 ? 270 : 230 }}>
          <Image src={src} alt="" fill sizes="420px" loading="lazy" className="object-cover" />
        </div>))}
      </motion.div>)}
    </div>
  </motion.section>
}
