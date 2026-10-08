"use client"
import { useEffect, useRef, useState } from "react"
import { animate, useInView, useReducedMotion } from "framer-motion"
export function CountUp({ value, suffix = "", decimals = 0, small = false }: { value: number; suffix?: string; decimals?: number; small?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  // Each statistic runs once for the lifetime of the page.
  const visible = useInView(ref, { once: true, amount: .5 })
  const reduced = useReducedMotion()
  const [number, setNumber] = useState(0)
  useEffect(() => {
    if (!visible) return
    if (reduced) {
      setNumber(value)
      return
    }
    const animation = animate(0, value, { duration: 1.2, ease: "easeOut", onUpdate: setNumber })
    return () => animation.stop()
  }, [visible, value, reduced])
  return <span ref={ref} className={small ? "ariel-numeral ariel-numeral-small" : "ariel-numeral"} aria-label={`${value.toFixed(decimals)}${suffix}`}><span aria-hidden>{number.toFixed(decimals)}{suffix}</span></span>
}
export function KeywordMarquee({ words }: { words: string[] }) {
  return <div className="ariel-keywords" aria-hidden="true"><div>{[0,1,2].map(copy => <span key={copy}>{words.map(word => <span key={word}>{word}</span>)}</span>)}</div></div>
}
