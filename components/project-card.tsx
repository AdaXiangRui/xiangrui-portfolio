"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, type MouseEvent } from "react"
import { motion, useAnimationControls, useReducedMotion, useScroll, useTransform, useMotionValue } from "framer-motion"

interface ProjectCardProps { title: string; description: string; image: string; href: string; index: number; summary: string; total: number }
export function ProjectCard({ title, description, image, href, index, summary, total }: ProjectCardProps) {
  const reduced = useReducedMotion()
  const range = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [geometry, setGeometry] = useState({ navbar: 64, peek: 36, height: 330, minScale: .82 })
  const stickyTop = geometry.navbar + index * geometry.peek
  const { scrollY } = useScroll()
  const start = useMotionValue(0), end = useMotionValue(1)
  useEffect(() => {
    const measure = () => {
      if (!range.current) return
      const navbar = document.querySelector("main.portfolio-home > header")?.getBoundingClientRect().height ?? 64
      const footer = document.querySelector("main.portfolio-home > footer")?.getBoundingClientRect().height ?? 100
      const peek = Math.min(36, Math.max(16, (window.innerHeight - navbar - footer - 260) / Math.max(1, total - 1)))
      const height = Math.max(220, window.innerHeight - navbar - peek * (total - 1) - footer - 16)
      const minScale = Math.max(.72, Math.min(.86, 1 - (peek * (total - 1)) / Math.max(window.innerWidth, 1)))
      setGeometry(previous => previous.navbar === navbar && previous.peek === peek && previous.height === height && previous.minScale === minScale ? previous : { navbar, peek, height, minScale })
      start.set(range.current.getBoundingClientRect().top + window.scrollY - (navbar + index * peek))
      end.set(Math.max(start.get() + 1, document.documentElement.scrollHeight - window.innerHeight - 8))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    if (panel.current) observer.observe(panel.current)
    window.addEventListener("resize", measure, { passive: true })
    return () => { observer.disconnect(); window.removeEventListener("resize", measure) }
  }, [index, total, start, end])
  // Depth is counted from the front: the frontmost card is i=0.
  const depthIndex = total - 1 - index
  const targetScale = 1 - depthIndex * (1 - geometry.minScale) / Math.max(1, total - 1)
  const targetOpacity = 1 - depthIndex * .225 / Math.max(1, total - 1)
  const progress = useTransform(() => Math.max(0, Math.min(1,
    (scrollY.get() - start.get()) / Math.max(1, end.get() - start.get()))))
  const recedeScale = useTransform(progress, [0, 1], [1, reduced ? 1 : targetScale])
  const recedeOpacity = useTransform(progress, [0, 1], [1, targetOpacity])
  const router = useRouter()
  const controls = useAnimationControls()
  const [hovered, setHovered] = useState(false)
  const [leaving, setLeaving] = useState(false)
  useEffect(() => {
    if (!leaving) void controls.start(hovered ? "hover" : "rest")
  }, [hovered, leaving, controls])
  async function navigate(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    if (leaving) return
    setLeaving(true)
    await controls.start({ scale: reduced ? 1 : .98, opacity: .85, transition: { duration: .12, ease: "easeOut" } })
    router.push(href)
  }
  return <>
    <div ref={range} data-stack-origin={index} aria-hidden="true" />
    <div ref={panel} className="project-stack-card sticky" style={{ top: stickyTop, zIndex: index + 1, marginBottom: index === total - 1 ? 0 : 24 }}>
    <motion.div className="rounded-t-[32px] bg-[#0a0f1e]" style={{ scale: recedeScale, transformOrigin: "top center" }}>
    <motion.div style={{ opacity: recedeOpacity }}>
    <motion.div initial={{ opacity: .7, scale: reduced ? 1 : .96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .75 }} transition={{ duration: .5, ease: "easeOut" }} style={{ transformOrigin: "top center" }}>
      <Link href={href} className="block rounded-t-[32px] focus-visible:outline focus-visible:outline-white" onClick={navigate} onFocus={() => setHovered(true)} onBlur={() => setHovered(false)} onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true) }} onPointerLeave={() => setHovered(false)}>
        <motion.article animate={controls} initial="rest" variants={{ rest: { borderColor: "rgba(255,255,255,0.15)", boxShadow: "0 0 0px rgba(255,255,255,0)" }, hover: { borderColor: "rgba(255,255,255,0.4)", boxShadow: "0 0 28px rgba(255,255,255,0.10), 0 0 8px rgba(255,255,255,0.06)" } }} transition={{ duration: .225, ease: "easeOut" }} style={{ height: geometry.height, minHeight: 0 }} className="stack-card-surface flex flex-col gap-6 rounded-t-[32px] border border-white/15 bg-[#0a0f1e] px-6 py-8 lg:px-12">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-5 lg:gap-10">
              <span aria-hidden className="text-6xl font-extrabold tracking-tight lg:text-[88px]">{String(index + 1).padStart(2, "0")}</span>
              <div className="pt-2">
                <p className="text-[11px] uppercase leading-snug text-white/50">{description}</p>
                <h3 className="mt-2 text-2xl font-medium tracking-tight text-white lg:text-4xl">{title}</h3>
              </div>
            </div>
            <motion.span className="shrink-0 rounded-full border border-white/50 px-3 py-2 text-[10px] tracking-wide lg:px-5 lg:text-xs" animate={{ backgroundColor: hovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)", color: hovered ? "#0a0f1e" : "#ffffff" }} transition={{ duration: .2, ease: "easeOut" }}>VIEW PROJECT</motion.span>
          </div>
          <p className="max-w-3xl text-sm leading-relaxed text-white/50 lg:text-base">{summary}</p>
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
            {[image, image.replace(".png", "1.png")].map((src, imageIndex) => <div key={src} className="relative min-h-0 overflow-hidden rounded-2xl">
              <motion.div className="absolute inset-0" animate={{ scale: hovered && !reduced ? 1.03 : 1 }} transition={{ duration: .4, ease: "easeOut" }}>
                <Image src={src} alt={`${title} — ${imageIndex + 1}`} fill sizes="(max-width: 639px) 100vw, 50vw" loading="lazy" className="object-cover" />
              </motion.div>
            </div>)}
          </div>
        </motion.article>
      </Link>
    </motion.div>
    </motion.div>
    </motion.div>
  </div>
  </>
}
