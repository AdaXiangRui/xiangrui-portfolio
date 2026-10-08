'use client'

import {Localize} from "@/components/site-language"
import { ChapterRail } from "@/components/chapter-rail"
import { useState, useRef, useEffect, useLayoutEffect, type CSSProperties } from 'react'
import { CountUp } from "./polish-motion"
import "./polish.css"
import "./case-refresh.css"
import Image from "next/image"
import Link from "next/link"

const navItems = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
]

const keywords = [
  "Ocean Plastic",
  "Circular Economy",
  "Eco-fashion",
  "Sustainability",
]

const PAGE_NAV_SECTIONS = [
  { title: 'Start' },
  { title: 'Marine Plastic' },
  { title: "What's Been Tried" },
  { title: 'Existing Gaps' },
  { title: 'Field Research' },
  { title: 'System Restructure' },
  { title: 'Stakeholder Map' },
  { title: 'The Solution' },
  { title: 'Products & Services' },
  { title: 'Future Plan' },
  { title: 'The End' },
] as const

/** 每逻辑页 = 固定一视口高；仅本块参与 snap，避免块内再出现第二个吸附缝 */
const ARIEL_PAGE_SNAP: CSSProperties = {
  minHeight: '760px', height: 'auto', boxSizing: 'border-box', overflow: 'visible', scrollMarginTop: '88px',
}

// ── Interview data ──
const INTERVIEW_PEOPLE = [
  {
    char: '刘', name: 'Miss Liu', age: 24, role: 'Student',
    avatarBg: 'rgba(242,168,168,0.15)', avatarColor: '#c47a7a',
    accentColor: '#DFA6AA', accentDark: '#c47a7a',
    illustration: '/ariel/person.png',
    bio: 'A local student and an environmentalist. She hopes more people will engage in responsible tourism, minimizing their impact on the natural environment.',
    topic: 'Regarding Ocean Literacy',
    quote: "Most modern individuals are aware of marine pollution. However, it's challenging to take practical measures. She thinks ocean literacy is insufficient, and that 80% of people have not taken practical actions.",
    hl: 'ocean literacy is insufficient',
  },
  {
    char: '王', name: 'Mr Wang', age: 48, role: 'Fisherman',
    avatarBg: 'rgba(76,175,140,0.15)', avatarColor: '#2d8a6a',
    accentColor: '#579C87', accentDark: '#2d8a6a',
    illustration: '/ariel/wind.png',
    bio: 'A local fisherman who has worked on the sea for over 20 years. He is deeply aware of the changes in the marine environment.',
    topic: 'Regarding Ocean Literacy',
    quote: "There's a fishing ban from May to September. Trash from fishing goes to a remote garbage station. Some trash can be sold but the price is low — better collection prices could provide extra income.",
    hl: 'better collection prices',
  },
  {
    char: '陈', name: 'Mrs Chen', age: 36, role: 'Traveler',
    avatarBg: 'rgba(120,169,152,0.2)', avatarColor: '#47796A',
    accentColor: '#78A998', accentDark: '#47796A',
    illustration: '/ariel/beach.png',
    bio: 'A mother of two who travels frequently with her family. She values educational experiences and environmental awareness for her children.',
    topic: 'Regarding Ocean Literacy',
    quote: "Beach is her family's most frequent travel destination. Beach cleaning sounds interesting if safety and fun are guaranteed — could be a great educational family activity.",
    hl: 'safety and fun',
  },
]

// ── Emotion Map 顶层组件 ──
const EM_STAGES = [
  { key: 'prep',  label: 'Preparation',   bg: '#579C87', light: 'rgba(76,175,140,0.06)',  cols: 3 },
  { key: 'clean', label: 'Cleaning',       bg: '#E8897A', light: 'rgba(232,137,122,0.06)', cols: 5 },
  { key: 'after', label: 'After Cleaning', bg: '#78A998', light: 'rgba(120,169,152,0.06)', cols: 4 },
]
const EM_NODES = [
  { stage: 0, slot: 0, of: 2, emoji: '😍', color: '#579C87', title: 'Wow, beautiful!',      text: 'WOW! Beautiful Beach! First impression of arriving at Yusha Bay Park.',           curveY: 35 },
  { stage: 0, slot: 1, of: 2, emoji: '😬', color: '#579C87', title: 'Oops, forgot gear',     text: 'Forgot slippers and trash-picking gear. Unprepared for the actual task.',         curveY: 72 },
  { stage: 1, slot: 0, of: 4, emoji: '😅', color: '#E8897A', title: 'Hesitation',            text: 'Dirty trash… Will people think weird? Psychological barrier at the start.',       curveY: 88 },
  { stage: 1, slot: 1, of: 4, emoji: '🤔', color: '#E8897A', title: 'Feels like scavenging', text: 'Find garbage, feels like scavenging. Awkward but curious.',                       curveY: 48 },
  { stage: 1, slot: 2, of: 4, emoji: '🏆', color: '#E8897A', title: 'Competition kicks in',  text: 'Compete who collects the most — WINNER! Gamified motivation takes over.',         curveY: 22 },
  { stage: 1, slot: 3, of: 4, emoji: '😮‍💨', color: '#E8897A', title: 'Tired but rewarded', text: 'A bit tired but harvest is rewarding. Physical fatigue, emotional satisfaction.', curveY: 58 },
  { stage: 2, slot: 0, of: 2, emoji: '😮', color: '#78A998', title: "Where's the bin?!",     text: 'Where on earth is the trash can?! Frustration after collecting garbage.',         curveY: 70 },
  { stage: 2, slot: 1, of: 2, emoji: '😎', color: '#78A998', title: 'Victory photo',         text: 'Found a trash can, took a photo of spoils. Pride and accomplishment.',           curveY: 52 },
]

function InterviewCards({ onShowInsight, onAccentChange }: { onShowInsight: () => void; onAccentChange: (color: string) => void }) {
  const [flipped, setFlipped] = useState<number | null>(null)

  const cardImages = [
    { front: '/ariel/tu1.png', back: '/ariel/tu2.png' },
    { front: '/ariel/tu3.png', back: '/ariel/tu4.png' },
    { front: '/ariel/tu5.png', back: '/ariel/tu6.png' },
  ]

  return (
    <Localize><div>
      <style>{`
        .flip-card { perspective: 1400px; }
        .flip-inner {
          transition: transform 0.7s cubic-bezier(.4,0,.2,1);
          transform-style: preserve-3d;
          position: relative; width: 96.3%; height: 84%;
        }
        .flip-inner.flipped { transform: rotateY(180deg); }
        .flip-face {
          position: absolute; inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 10px;
          overflow: hidden;
        }
        .flip-back { transform: rotateY(180deg); }
      `}</style>

      {/* 顶部标题栏 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <h3 style={{ fontSize: 'var(--ariel-subtitle)', fontWeight: 600, color: '#1a1a1a', margin: 0 }}>Interview</h3>
          <div style={{ height: 1, width: 60, background: '#e0e0e0' }} />
          <div style={{ fontSize: 12, color: '#579C87', fontWeight: 600 }}>📍 Windmill Island</div>
        </div>
        <span style={{ fontSize: 12, color: '#bbb', fontStyle: 'italic' }}>Click a card to flip</span>
      </div>

      {/* 三张卡片，平分一行 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {cardImages.map((imgs, i) => (
          <div
            key={i}
            className="flip-card"
            onMouseEnter={() => onAccentChange(INTERVIEW_PEOPLE[i].accentColor)}
            style={{
              aspectRatio: '3/4',
              cursor: 'pointer',
              position: 'relative',
              // 3D 翻转后几何会盖住相邻格；翻开的那张沉底，其余在上，才能连续点别的卡
              zIndex: flipped !== null && flipped !== i ? 2 : 1,
            }}
            onClick={() => { setFlipped(flipped === i ? null : i); onAccentChange(INTERVIEW_PEOPLE[i].accentColor) }}
          >
            <div className={`flip-inner${flipped === i ? ' flipped' : ''}`}>
              {/* 正面 */}
              <div className="flip-face">
                <img loading="lazy" decoding="async"
                  src={imgs.front}
                  alt={`person-${i + 1}-front`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              {/* 背面 */}
              <div className="flip-face flip-back">
                <img loading="lazy" decoding="async"
                  src={imgs.back}
                  alt={`person-${i + 1}-back`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div></Localize>
  )
}

// ── InsightPage: 现在接收 onBack，由外部决定回到哪里 ──
function InsightPage({ onBack, backLabel = 'Back to Field Research' }: { onBack: () => void; backLabel?: string }) {
  return (
    <Localize><div className="sub-slide-right wave-in" style={{ overflow: 'visible' }}>

      {/* 顶部：标题左，back按钮右 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#579C87', marginBottom: 8 }}>What We Found</div>
          <h2 style={{ fontSize: 'var(--ariel-title)', fontWeight: 800, color: '#1a1a1a', margin: 0, lineHeight: 1.2 }}>Cross-Stakeholder Insights</h2>
        </div>
        <button onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#335e51', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, color: 'white', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
        >← {backLabel}</button>
      </div>

      {/* 三栏 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 40 }}>

        {/* 栏一：渔民 */}
        <div style={{ background: 'rgba(76,175,140,0.08)', border: '1px solid rgba(76,175,140,0.25)', borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <img loading="lazy" decoding="async" src="/ariel/new-assets/fishermen icon.svg" alt="" style={{ width: 26, height: 26, objectFit: 'contain' }} />
            <div style={{ fontSize: 11, color: '#579C87', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Fisherman</div>
          </div>
          <div style={{ fontSize: 10, color: '#aaa', marginBottom: 20, fontStyle: 'italic' }}>Source: Interview at Windmill Island</div>
          {[
            { tag: 'Economics Drive Behavior', desc: 'Better collection prices would immediately change daily behavior — economic incentive is the strongest lever.' },
            { tag: 'Idle Periods = Opportunity', desc: 'The fishing ban (May–Sep) creates idle time. Fishermen could participate in cleanup if a structured system existed.' },
            { tag: 'No Disposal Infrastructure', desc: 'Trash hauled ashore during fishing season has nowhere to go — piles up randomly into unmanaged garbage mountains.' },
            { tag: 'Low Gear Recycling Rate', desc: 'Abandoned fishing gear and foam plastics are major debris types with no current recycling pathway.' },
          ].map((item, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: 'inline-block', background: 'rgba(76,175,140,0.15)', color: '#2d8a6a', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20, marginBottom: 6 }}>{item.tag}</div>
              <div style={{ fontSize: 12, color: '#555', lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* 栏二：净滩观察 */}
        <div style={{ background: 'rgba(232,137,122,0.08)', border: '1px solid rgba(232,137,122,0.25)', borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <img loading="lazy" decoding="async" src="/ariel/new-assets/tourist icon.svg" alt="" style={{ width: 26, height: 26, objectFit: 'contain' }} />
            <div style={{ fontSize: 11, color: '#E8897A', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Beach Observation · Field Study</div>
          </div>
          <div style={{ fontSize: 10, color: '#aaa', marginBottom: 20, fontStyle: 'italic' }}>Source: 1km cleanup at Yusha Bay Park + Emotion Map</div>
          {[
            { tag: 'Trash Hotspot Identified', desc: 'Crushed stone section has the highest trash concentration — primarily tourist-generated plastic and food packaging.' },
            { tag: 'Gear Gap', desc: 'No suitable equipment or waste bins on-site. Sharp stones and broken shells make unequipped cleanup unsafe.' },
            { tag: 'Psychological Barrier', desc: "Hesitation at the start — 'will people think I'm scavenging?' Gamification broke the barrier and turned it competitive." },
            { tag: 'No Disposal Point', desc: "After collecting, participants couldn't find a bin. Post-cleaning frustration undermined the sense of accomplishment." },
          ].map((item, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: 'inline-block', background: 'rgba(232,137,122,0.15)', color: '#c47a7a', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20, marginBottom: 6 }}>{item.tag}</div>
              <div style={{ fontSize: 12, color: '#555', lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* 栏三：公众认知 */}
        <div style={{ background: 'rgba(242,168,168,0.08)', border: '1px solid rgba(242,168,168,0.28)', borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <img loading="lazy" decoding="async" src="/ariel/new-assets/tourist icon.svg" alt="" style={{ width: 26, height: 26, objectFit: 'contain' }} />
            <div style={{ fontSize: 14, color: '#C97884', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Public Awareness · Interviews</div>
          </div>
          <div style={{ fontSize: 10, color: '#aaa', marginBottom: 20, fontStyle: 'italic' }}>Source: student and traveler interviews</div>
          {[
            { tag: 'Awareness ≠ Action', src: 'Miss Liu', desc: "Most people know about ocean pollution but 80% have never taken practical action. Knowledge alone doesn't convert." },
            { tag: 'Ocean Literacy Gap', src: 'Miss Liu', desc: 'Depth of understanding is low — people need direct experience, not just information, to truly engage.' },
            { tag: 'Safety + Fun = Engagement', src: 'Mrs Chen', desc: 'Beach cleaning becomes appealing when framed as safe and enjoyable — especially as a family activity.' },
            { tag: 'Education Through Action', src: 'Mrs Chen', desc: 'Families see cleanup as a meaningful educational experience for children, with strong social sharing potential.' },
          ].map((item, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ display: 'inline-block', background: 'rgba(242,168,168,0.18)', color: '#B46570', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20 }}>{item.tag}</div>
                <div style={{ fontSize: 10, color: '#aaa' }}>{item.src}</div>
              </div>
              <div style={{ fontSize: 12, color: '#555', lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>

      </div>

    </div></Localize>
  )
}

function EmotionMapInner({ onShowResult }: { onShowResult: () => void }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const [visibleEmojis, setVisibleEmojis] = useState<boolean[]>(new Array(EM_NODES.length).fill(false))
  const [animationProgress, setAnimationProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const s0Ref = useRef<HTMLDivElement>(null)
  const s1Ref = useRef<HTMLDivElement>(null)
  const s2Ref = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const animFrameRef = useRef<number | null>(null)
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([])
  const [svgPath, setSvgPath] = useState('')
  const [circles, setCircles] = useState<{ cx: number; cy: number; color: string }[]>([])
  const [svgW, setSvgW] = useState(0)
  const [pathLength, setPathLength] = useState(0)
  const H = 220
  const gridCols = EM_STAGES.map(s => `${s.cols}fr`).join(' ')
  const ANIM_DURATION = 2200 // ms

  const compute = () => {
    if (!containerRef.current || !s0Ref.current || !s1Ref.current || !s2Ref.current) return
    const cRect = containerRef.current.getBoundingClientRect()
    const sRects = [s0Ref, s1Ref, s2Ref].map(r => r.current!.getBoundingClientRect())
    const pts = EM_NODES.map(n => {
      const slotW = sRects[n.stage].width / n.of
      return {
        x: sRects[n.stage].left - cRect.left + slotW * n.slot + slotW / 2,
        y: 10 + (n.curveY / 100) * (H - 20),
      }
    })
    const catmull = (pts: { x: number; y: number }[]) => {
      let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]
        d += ` C ${(p1.x+(p2.x-p0.x)/6).toFixed(1)} ${(p1.y+(p2.y-p0.y)/6).toFixed(1)},${(p2.x-(p3.x-p1.x)/6).toFixed(1)} ${(p2.y-(p3.y-p1.y)/6).toFixed(1)},${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
      }
      return d
    }
    setPositions(pts)
    setSvgPath(catmull(pts))
    setCircles(pts.map((p, i) => ({ cx: p.x, cy: p.y, color: EM_NODES[i].color })))
    setSvgW(cRect.width)
  }

  // 计算 pathLength 并启动动画
  useEffect(() => {
    if (!svgPath || !pathRef.current) return
    const len = pathRef.current.getTotalLength()
    setPathLength(len)

    // 重置
    setAnimationProgress(0)
    setVisibleEmojis(new Array(EM_NODES.length).fill(false))

    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / ANIM_DURATION, 1)
      setAnimationProgress(progress)

      // 检查哪些 emoji 该出现了
      if (pathRef.current && len > 0) {
        const drawnLength = progress * len
        // 对每个节点，算它在路径上的近似 x 位置对应的路径长度
        setVisibleEmojis(prev => {
          const next = [...prev]
          positions.forEach((pos, i) => {
            if (next[i]) return // 已经显示了就不用再算
            // 用二分法找到路径上 x 最接近 pos.x 的点对应的长度
            let lo = 0, hi = len
            for (let iter = 0; iter < 24; iter++) {
              const mid = (lo + hi) / 2
              const pt = pathRef.current!.getPointAtLength(mid)
              if (pt.x < pos.x) lo = mid
              else hi = mid
            }
            const nodeLen = (lo + hi) / 2
            if (drawnLength >= nodeLen) next[i] = true
          })
          return next
        })
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(tick)
      }
    }
    animFrameRef.current = requestAnimationFrame(tick)
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current) }
  }, [svgPath, positions.length])

  useEffect(() => {
    const t = setTimeout(compute, 80)
    window.addEventListener('resize', compute)
    return () => { clearTimeout(t); window.removeEventListener('resize', compute) }
  }, [])

  useEffect(() => {
    const hide = () => setActiveIdx(null)
    window.addEventListener('click', hide)
    return () => window.removeEventListener('click', hide)
  }, [])

  return (
    <Localize><div className="sub-slide-right wave-in">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#579C87', marginBottom: '6px' }}>Beach Cleaning Experience</div>
          <h3 style={{ fontSize: 'var(--ariel-subtitle)', fontWeight: 600, color: '#1a1a1a', margin: 0 }}>Emotion Map</h3>
          <p style={{fontSize:'12px',color:'#c47a7a',margin:'8px 0 0'}}>Click an emotion to read the moment behind it.</p>
        </div>
        <button
          onClick={onShowResult}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#335e51', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
        >Results Statistics →</button>
      </div>

      <div style={{ borderRadius: '16px', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
        {/* 表头 */}
        <div style={{ display: 'grid', gridTemplateColumns: `80px ${gridCols}` }}>
          <div style={{ background: '#f7f7f7', padding: '14px 16px' }} />
          {EM_STAGES.map(st => (
            <div key={st.key} style={{ background: st.bg, padding: '16px', fontSize: '15px', fontWeight: 900, color: 'white', textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.25)', position: 'relative' }}>
              {st.label}
            </div>
          ))}
        </div>

        {/* Emoji + 曲线行 */}
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', borderTop: '1px solid #f0f0f0' }}>
          <div style={{ padding: '0 12px', fontSize: '10px', fontWeight: 600, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #f0f0f0' }}>
            <span style={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap' }}>emotions</span>
          </div>
          <div ref={containerRef} style={{ position: 'relative', height: `${H}px`, overflow: 'visible' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: gridCols, pointerEvents: 'none' }}>
            <div ref={s0Ref} style={{ background: EM_STAGES[0].light }} />
            <div ref={s1Ref} style={{ background: EM_STAGES[1].light, borderLeft: '1px solid #f0f0f0' }} />
            <div ref={s2Ref} style={{ background: EM_STAGES[2].light, borderLeft: '1px solid #f0f0f0' }} />
            </div>
            {svgPath && (
              <svg width={svgW} height={H} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="emGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#579C87" />
                    <stop offset="40%" stopColor="#E8897A" />
                    <stop offset="100%" stopColor="#78A998" />
                  </linearGradient>
                </defs>
                <path
                  ref={pathRef}
                  d={svgPath}
                  fill="none"
                  stroke="url(#emGrad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={pathLength || 9999}
                  strokeDashoffset={pathLength ? pathLength * (1 - animationProgress) : 9999}
                  style={{ transition: 'none' }}
                />
                {/* 只在动画完成后才显示 dot，或者跟随线的进度 */}
                {circles.map((c, i) => (
                  visibleEmojis[i] && (
                    <circle
                      key={i}
                      cx={c.cx} cy={c.cy} r="5"
                      fill={c.color} stroke="white" strokeWidth="2.5"
                      style={{ opacity: visibleEmojis[i] ? 1 : 0, transition: 'opacity 0.2s' }}
                    />
                  )
                ))}
              </svg>
            )}
            {positions.map((pos, i) => {
              const node = EM_NODES[i]
              const isActive = activeIdx === i
              const popupAbove = pos.y > H * 0.5
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute', left: `${pos.x}px`, top: `${pos.y}px`,
                    zIndex: isActive ? 50 : 10,
                    opacity: visibleEmojis[i] ? 1 : 0,
                    transform: visibleEmojis[i]
                      ? 'translate(-50%,-50%) scale(1)'
                      : 'translate(-50%,-50%) scale(0.3)',
                    transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(.22,.8,.36,1)',
                  }}
                >
                  <div
                    onClick={e => { e.stopPropagation(); setActiveIdx(isActive ? null : i) }}
                    style={{ fontSize: '28px', lineHeight: 1, cursor: 'pointer', userSelect: 'none', transition: 'transform 0.15s', display: 'block' }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.transform = 'scale(1.15)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
                  >{node.emoji}</div>
                  {isActive && (
                    <div
                      onClick={e => e.stopPropagation()}
                      style={{
                        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                        ...(popupAbove ? { bottom: 'calc(100% + 12px)' } : { top: 'calc(100% + 12px)' }),
                        background: 'white', border: `2px solid ${node.color}`, borderRadius: '12px',
                        padding: '12px 16px', width: '180px', zIndex: 200,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)', whiteSpace: 'normal', pointerEvents: 'auto',
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: 600, color: node.color, marginBottom: '6px' }}>{node.emoji} {node.title}</div>
                      <div style={{ fontSize: '12px', color: '#555', lineHeight: 1.65 }}>{node.text}</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Chance 行 */}
        <div style={{ display: 'grid', gridTemplateColumns: `80px ${gridCols}`, background: '#fafafa', borderTop: '1px solid #f0f0f0' }}>
          <div style={{ padding: '0 12px', fontSize: '10px', fontWeight: 600, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #f0f0f0' }}>
            <span style={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap' }}>chance</span>
          </div>
          {[
            { color: '#579C87', items: [
              { bold: 'sandals', pre: 'Provide ', post: ' for those who forgot to bring beach sandals.' },
              { bold: 'equipment & training', pre: 'Provide ', post: ' for people cleaning the beach.' },
            ]},
            { color: '#E8897A', items: [
              { bold: 'reward system', pre: 'A ', post: ' to overcome psychological barriers and encourage picking up the first piece of trash.' },
              { bold: 'background knowledge', pre: 'Enhance with a certain level of ', post: ', delve into and optimize the entire process of beach cleaning.' },
            ]},
            { color: '#78A998', items: [
              { bold: 'garbage cans', pre: 'Set the number and location of ', post: ' reasonably.' },
              { bold: 'achievements', pre: 'Electronic or physical environmental protection ', post: '.' },
            ]},
          ].map((col, ci) => (
            <div key={ci} style={{ borderLeft: '1px solid #f0f0f0', padding: '20px 16px' }}>
              {col.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '10px', fontSize: '12px', color: '#555', lineHeight: 1.6 }}>
                  <span style={{ color: col.color, flexShrink: 0, marginTop: '3px', fontSize: '10px' }}>●</span>
                  <span>{item.pre}<strong style={{ color: '#1a1a1a' }}>{item.bold}</strong>{item.post}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div></Localize>
  )
}

function DiagramWithHighlight({ src, highlightIds, nodes, color, label }: {
  src: string
  highlightIds: string[]
  nodes: { id: string; x: number; y: number; size: number }[]
  color: string
  label: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imgLoaded, setImgLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = src
    img.onload = () => {
      imgRef.current = img
      setImgLoaded(true)
    }
  }, [src])

  useEffect(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return

    requestAnimationFrame(() => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
    
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  const rect = canvas.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  canvas.width = Math.round(rect.width * dpr)
  canvas.height = Math.round(rect.height * dpr)
  ctx.scale(dpr, dpr)
    
      const w = rect.width
      const h = rect.height
    
      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(img, 0, 0, w, h)
    
      if (highlightIds.length > 0) {
        ctx.save()
        ctx.fillStyle = 'rgba(255,255,255,0.72)'
        ctx.fillRect(0, 0, w, h)
        ctx.restore()
    
        ctx.save()
        ctx.beginPath()
        nodes.filter(n => highlightIds.includes(n.id)).forEach(node => {
          const cx = (node.x / 100) * w
          const cy = (node.y / 100) * h
          const r = node.size / 2 + 12
          ctx.moveTo(cx + r, cy)
          ctx.arc(cx, cy, r, 0, Math.PI * 2)
        })
        ctx.clip()
        ctx.drawImage(img, 0, 0, w, h)
        ctx.restore()
      }
    })
  }, [imgLoaded, highlightIds, nodes, color])

  return (
    <Localize><div style={{ position: 'relative', width: '100%' }}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ width: '100%', aspectRatio: '1', display: 'block', borderRadius: '16px' }}
      />

      {highlightIds.length > 0 && nodes.filter(n => highlightIds.includes(n.id)).map(node => (
        <div key={node.id} style={{
          position: 'absolute',
          left: `${node.x}%`,
          top: `${node.y}%`,
          width: `${node.size + 20}px`,
          height: `${node.size + 20}px`,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: `3px solid ${color}`,
          boxShadow: `0 0 0 3px ${color}18, 0 0 10px ${color}22`,
          animation: 'pulse 1.5s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 10,
        }} />
      ))}

      {nodes.map(node => (
        <div
          key={`hover-${node.id}`}
          style={{
            position: 'absolute',
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: `${node.size}px`,
            height: `${node.size}px`,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            cursor: 'pointer',
            zIndex: 20,
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translate(-50%,-50%) scale(1.35)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translate(-50%,-50%) scale(1)'}
        />
      ))}
    </div></Localize>
  )
}

type StakeholderTab = 'all' | 'support' | 'returns' | 'science' | 'services' | 'core'

function StakeholderMap({ activeTab }: { activeTab: StakeholderTab }) {
  return (
    <Localize><div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, background: 'transparent' }}>
      <StakeholderSVG activeTab={activeTab} />
    </div></Localize>
  )
}

function StakeholderSVG({ activeTab }: { activeTab: StakeholderTab }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgLoadedRef = useRef(false)

  useEffect(() => {
    if (svgLoadedRef.current) return
    svgLoadedRef.current = true

    fetch(`${window.location.origin}/ariel/stakeholder-map.svg`)
      .then(r => r.text())
      .then(text => {
        if (!containerRef.current) return
        const clean = text.replace(/<\?xml[^?]*\?>/g, '').trim()
        containerRef.current.innerHTML = clean

        const svg = containerRef.current.querySelector('svg')
        if (svg) {
          svg.style.width = '100%'
          svg.style.height = '100%'
          svg.style.display = 'block'
          svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
          svg.removeAttribute('width')
          svg.removeAttribute('height')
        }
        containerRef.current.style.background = 'transparent'
        containerRef.current.dispatchEvent(new CustomEvent('svgloaded'))
      })
      .catch(err => console.error('fetch error:', err))
  }, [])

  useEffect(() => {
    const apply = () => {
      if (!containerRef.current) return
      const svg = containerRef.current.querySelector('svg')
      if (!svg) return

      const allCatEls = svg.querySelectorAll('[data-cat]')
      if (allCatEls.length === 0) return

      allCatEls.forEach(el => {
        const cat = el.getAttribute('data-cat')
        const svgEl = el as SVGElement
        svgEl.style.transition = 'opacity 0.35s ease'
        svgEl.style.opacity = (activeTab === 'all' || cat === activeTab) ? '1' : '0.06'
      })
    }

    apply()
    const container = containerRef.current
    container?.addEventListener('svgloaded', apply)
    return () => container?.removeEventListener('svgloaded', apply)
  }, [activeTab])

  return (
    <Localize><div
      ref={containerRef}
      style={{ width: '100%', height: '100%', minHeight: '100%', display: 'block' }}
    /></Localize>
  )
}


export default function ArielProjectPage() {
  const [interviewAccent, setInterviewAccent] = useState("#DFA6AA")
  const [activeImpact, setActiveImpact] = useState<number|null>(null)
  const [activeDetail, setActiveDetail] = useState<string | null>(null)
  const [cleaningView, setCleaningView] = useState<'emotion' | 'result'>('emotion')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showImpacts, setShowImpacts] = useState(false)
  const [triedView, setTriedView] = useState<null | 'government' | 'products' | 'cleaning'>(null)
  const [systemTab, setSystemTab] = useState<'fishermen' | 'tourists' | 'enterprise' | 'original'>('original')
  const [cleaningSlide, setCleaningSlide] = useState(0);
  const [cleaningPaused, setCleaningPaused] = useState(false);
  const [showLineDetail, setShowLineDetail] = useState(false)
  const [lineTab, setLineTab] = useState<'tourist' | 'fisherman'>('tourist')
  const [futurePlanView, setFuturePlanView] = useState<'cobranding' | 'coliving' | 'physicalsite'>('cobranding')
  const [activeSpot, setActiveSpot] = useState<string | null>(null)
  const [stakeTab, setStakeTab] = useState<StakeholderTab>('all')
  const [activeUi, setActiveUi] = useState(0)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const [currentSection, setCurrentSection] = useState(0)

  const sectionVisibilityRef = useRef<Map<number, number>>(new Map())

  const setSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el
    if (el) {
      el.dataset.sectionIndex = String(index)
      el.id = `ariel-chapter-${index}`
      const tints = ["transparent", "#F4F7F6", "#F6F3EE", "#F6F3EE", "#fff", "#F0F6F2", "#F0F6F2", "#F0F8F4", "#F0F8F4", "#F5F6F3", "transparent"]
      el.style.setProperty("--chapter-tint", tints[index])
      if (index === 4) el.style.setProperty("--chapter-tint", `color-mix(in srgb, ${interviewAccent} 6%, white)`)
      if (index === 9) el.style.setProperty("--chapter-tint", futurePlanView === "coliving" ? "#F0F6F2" : futurePlanView === "physicalsite" ? "#FCF4F3" : "#F0F8F4")
      el.dataset.active = String(index === currentSection)
    }
  }


  useEffect(() => {
    if (cleaningPaused) return;
    const timer = setInterval(() => {
      setCleaningSlide(s => (s + 1) % 3);
    }, 2000);
    return () => clearInterval(timer);
  }, [cleaningPaused]);


  useLayoutEffect(() => {
    const visibility = sectionVisibilityRef.current

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const idx = Number((entry.target as HTMLElement).dataset.sectionIndex)
          if (Number.isNaN(idx)) return
          if (entry.isIntersecting) {
            visibility.set(idx, entry.intersectionRatio)
            ;(entry.target as HTMLElement).dataset.revealed = "true"
          } else {
            visibility.delete(idx)
          }
        })

        let bestIdx = -1
        let bestRatio = 0
        visibility.forEach((ratio, idx) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestIdx = idx
          }
        })
        if (bestIdx >= 0) setCurrentSection(bestIdx)
      },
      { threshold: 0, rootMargin: '-40% 0px -40% 0px' },
    )

    const observeSections = () => {
      // sectionRefs[i] must match PAGE_NAV_SECTIONS[i] (0 Start … 7 The Solution … 10 The End)
      PAGE_NAV_SECTIONS.forEach((_, i) => {
        const el = sectionRefs.current[i]
        if (el) observer.observe(el)
      })
    }

    observeSections()
    return () => {
      observer.disconnect()
      visibility.clear()
    }
  }, [])

  return (
    <Localize><main className="ariel-scroll-snap ariel-case min-h-screen bg-white text-black" style={{ scrollSnapType: 'none' }}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(255,255,255,0.7)] backdrop-blur-[16px]">
        <nav className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-sm font-medium tracking-tight text-black hover:text-black/60 transition-colors">
              Xiangrui Zhou
            </Link>
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-black/70 hover:text-black transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* ── HERO ── */}
      <section id="ariel-chapter-0" className="ariel-case-hero" ref={setSectionRef(0)}>
        <div className="ariel-case-hero-copy"><span className="ariel-case-label">01 / Service Design · Brand</span><h1>Ariel</h1><p>Focusing on ocean plastic waste, we connect with locals, tourists, and fishermen, offering an exchange service for marine debris for recycled products.</p><a href="#ariel-chapter-1" className="ariel-case-cta">Explore the project ↓</a></div>
        <img decoding="async" fetchPriority="high" className="ariel-cover-background" src="/optimized/ariel-cover.jpg" alt="Ariel ocean plastic collection and exchange station"/>
      <div className="ariel-case-meta"><div><small>Area</small><p>Service Design, Brand</p></div><div><small>Duration</small><p>2023.09–2024.02</p></div><div><small>Designers</small><p>Xiangrui Zhou, Wenjia Shi, Yuqing Wu</p></div><div><small>Keywords</small><p>{keywords.join(' · ')}</p></div></div></section>
      <ChapterRail>{PAGE_NAV_SECTIONS.slice(1,-1).map((item,i)=><a key={item.title} href={`#ariel-chapter-${i+1}`}>{String(i + 1).padStart(2, '0')} / {item.title}</a>)}</ChapterRail>

      <section id="ariel-chapter-1" ref={setSectionRef(1)} style={{ 
        ...ARIEL_PAGE_SNAP,
        display: 'flex',
        flexDirection: 'column',
        padding: '80px 80px 80px 80px',
        background: '#fff',
      }}>
        <span className="ariel-section-kicker">01 / Research</span>
        {/* 标题 */}
        <h2 style={{ fontSize: 'var(--ariel-title)', fontWeight: 800, color: '#DFA6AA', marginBottom: '32px', flexShrink: 0 }}>Marine Plastic</h2>

        {/* 主视图 / Impacts 视图 切换 */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>

          {!showImpacts && (
            <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '1.8fr 0.8fr', gap: '48px', alignItems: 'start' }}>
              {/* 左：地图 */}
              <div style={{ height: '100%', paddingRight: '8px' }}>
                <p style={{fontSize: '16px', color: '#555', lineHeight: 1.75, marginBottom: '20px'}}>
                  Marine debris is a critical environmental issue. Millions of tons of garbage enter the oceans annually, endangering marine ecosystems and human health. Urgent action is needed to address this escalating problem.
                </p>
                <p style={{fontSize: '15px', color: '#aaa', marginBottom: '12px', fontStyle: 'italic'}}>Hover each point to see data.</p>
                <div style={{position: 'relative'}}>
                  <img loading="lazy" decoding="async" src="/ariel/world-map.png" alt="Map of documented marine-debris concentrations" style={{width: '100%', display: 'block'}} />
                  {[
                    {name: 'North Pacific Plastic Island', left: '60%', top: '40%', data: '1.6M km²', detail: '1.8 trillion plastics · 80,000 tonnes'},
                    {name: 'North Atlantic Plastic Island', left: '94%', top: '48%', data: 'Unknown size', detail: '7,220 units/km²'},
                    {name: 'South Pacific Plastic Island', left: '74%', top: '78%', data: '2.6M km²', detail: '400,000 particles per mi²'},
                    {name: 'Indian Ocean Plastic Island', left: '28%', top: '66%', data: '2.1–5.0 km²', detail: 'Deaths of sea turtles and birds'},
                    {name: 'South Atlantic Plastic Island', left: '5%', top: '70%', data: '0.7 km²', detail: '2,860 tonnes of plastic'},
                  ].map((island, i) => (
                    <div className="legacy-map-point" key={i} style={{position: 'absolute', left: island.left, top: island.top, transform: 'translate(-50%, -50%)', zIndex: 10, cursor: 'pointer'}}
                      onMouseEnter={e => { const t = e.currentTarget.querySelector('.tooltip') as HTMLElement; if(t) t.style.opacity = '1' }}
                      onMouseLeave={e => { const t = e.currentTarget.querySelector('.tooltip') as HTMLElement; if(t) t.style.opacity = '0' }}>
                      <div style={{width: '14px', height: '14px', borderRadius: '50%', background: '#E8897A', border: '2px solid white', boxShadow: '0 0 0 4px rgba(232,137,122,0.3)'}} />
                      <div className="tooltip" style={{position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: '#335e51', color: 'white', padding: '10px 14px', borderRadius: '8px', width: '180px', fontSize: '11px', lineHeight: 1.6, opacity: 0, transition: 'opacity 0.2s', pointerEvents: 'none', whiteSpace: 'normal'}}>
                        <div style={{fontWeight: 600, marginBottom: '3px', color: '#DFA6AA'}}>{island.name}</div>
                        <div style={{marginBottom: '2px'}}>{island.data}</div>
                        <div style={{color: '#aaa'}}>{island.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 右：按钮 + 数据卡片 */}
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                <button
                  onClick={() => setShowImpacts(true)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', background: '#335e51', color: 'white', border: 'none', borderRadius: '12px', padding: '14px 24px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginBottom: '24px' }}
                ><span>✦</span> View Detrimental Impacts <span style={{opacity: 0.6}}>→</span></button>

                {[
                  { front: {num: '79%', label: 'ends up in landfill or directly in nature', sub: 'Only 9% is recycled'}, back: {type: 'bar', title: 'Where does plastic go?', items: [{pct: 79, label: 'Landfill / in nature', color: '#DFA6AA'},{pct: 12, label: 'Incineration', color: '#579C87'},{pct: 9, label: 'Recycling', color: '#579C87'}]} },
                  { front: {num: '1000M', label: 'tons of plastic waste in the ocean', sub: '≈ 50 pyramids of Giza'}, back: {type: 'impacts', title: 'Three Major Impacts', items: [{pct: 0, label: 'Biota & Ecosystem — 451 species affected', color: '#DFA6AA'},{pct: 0, label: 'Social Life — $414M tourism revenue lost', color: '#579C87'},{pct: 0, label: 'Economic — US$279M annual damage cost', color: '#888'}]} },
                  { front: {num: '83%', label: 'of marine debris is plastic', sub: 'Source: UNEP'}, back: {type: 'pie', title: 'Marine Debris Composition', items: [{pct: 83, label: 'Plastic', color: '#DFA6AA'},{pct: 17, label: 'Others', color: '#579C87'}]} },
                ].map((card, i) => (
                  <div className="marine-stat-card" key={i} style={{height: '143px', flexShrink: 0, position: 'relative'}}>
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                      <div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                        <div style={{fontSize: '36px', fontWeight: 900, color: '#DFA6AA', lineHeight: 1}}><CountUp value={parseFloat(card.front.num)} suffix={card.front.num.replace(/[0-9.]/g, "")} /></div>
                        <div style={{fontSize: '12px', color: '#666', marginTop: '6px', lineHeight: 1.4}}>{card.front.label}</div>
                        <div style={{fontSize: '11px', color: '#aaa', marginTop: '3px', fontStyle: 'italic'}}>{card.front.sub}</div>
                      </div>
                      <div aria-hidden="true" style={{display:'none'}}>
                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid #f5f5f5', paddingRight: '12px', height: '100%'}}>
                          <div style={{fontSize: '10px', fontWeight: 600, color: '#c47a7a', textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1.4, marginBottom: 'auto'}}>{card.back.title}</div>
                          <div style={{fontSize: '9px', color: '#ccc', marginTop: '8px'}}>↩ flip back</div>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px'}}>
                          {card.back.type === 'bar' && card.back.items.map((item, j) => (
                            <div key={j} style={{marginBottom: '7px'}}>
                              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '3px'}}>
                                <div style={{fontSize: '10px', color: '#555'}}>{item.label}</div>
                                <div style={{fontSize: '10px', fontWeight: 600, color: item.color}}>{item.pct}%</div>
                              </div>
                              <div style={{height: '4px', background: '#f0f0f0', borderRadius: '2px'}}>
                                <div style={{width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: '2px'}} />
                              </div>
                            </div>
                          ))}
                          {card.back.type === 'pie' && (
                            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                              <svg width="56" height="56" viewBox="0 0 56 56">
                                <circle cx="28" cy="28" r="21" fill="none" stroke="#DFA6AA" strokeWidth="12" strokeDasharray={`${83 * 1.319} ${100 * 1.319}`} strokeDashoffset="0" transform="rotate(-90 28 28)" />
                                <circle cx="28" cy="28" r="21" fill="none" stroke="#579C87" strokeWidth="12" strokeDasharray={`${17 * 1.319} ${100 * 1.319}`} strokeDashoffset={`${-(83 * 1.319)}`} transform="rotate(-90 28 28)" />
                                <circle cx="28" cy="28" r="15" fill="white" />
                              </svg>
                              <div>
                                {card.back.items.map((item, j) => (
                                  <div key={j} style={{display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px'}}>
                                    <div style={{width: '6px', height: '6px', borderRadius: '50%', background: item.color}} />
                                    <div style={{fontSize: '11px', color: '#555'}}>{item.label} {item.pct}%</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {card.back.type === 'impacts' && card.back.items.map((item, j) => (
                            <div key={j} style={{display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'flex-start'}}>
                              <div style={{width: '5px', height: '5px', borderRadius: '50%', background: item.color, marginTop: '5px', flexShrink: 0}} />
                              <div style={{fontSize: '10px', color: '#555', lineHeight: 1.4}}>{item.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showImpacts && (
            <div style={{ height: '100%'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px'}}>
                <div>
                  <p style={{fontSize: '11px', letterSpacing: '0.15em', color: '#DFA6AA', textTransform: 'uppercase', marginBottom: '8px'}}>Consequences</p>
                  <h3 style={{fontSize: 'var(--ariel-subtitle)', fontWeight: 600, margin: 0, lineHeight: 1.1}}>The Detrimental Impacts</h3>
                  <p style={{fontSize: '15px', color: '#888', marginTop: '6px', fontStyle: 'italic'}}>of The North Pacific Plastic Island</p>
                </div>
                <button
                  onClick={() => setShowImpacts(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#335e51', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
                >← Back</button>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px'}}>
                {[
                  { icon: '/ariel/new-assets/bio&ecosystem.svg', title: 'Bio', bg: 'rgba(76,175,140,0.07)', border: 'rgba(76,175,140,0.25)', items: [
                    {emoji: '🌡️', title: 'Greenhouse Gas', desc: 'Disposable plastics emit greenhouse gases such as ethylene and methane when decomposed in the sun.'},
                    {emoji: '🐢', title: 'Biodiversity Decline', desc: '>43,000 individuals representing 451 species have encountered issues related to ingestion and entanglement by macroplastic fragments.'},
                  ]},
                  { icon: '/ariel/new-assets/social life icon.svg', title: 'Social Life', bg: 'rgba(76,175,140,0.07)', border: 'rgba(76,175,140,0.25)', items: [
                    {emoji: '🏖️', title: 'Beach Tourism Industry', desc: 'Doubling marine debris on Orange County beaches led to a loss of $414M in tourism revenue and nearly 4,300 jobs.'},
                    {emoji: '🎣', title: 'Livelihoods of Coastal Residents', desc: 'Diverse socio-economic impacts, affecting commercial fishery (loss of fishing time and extra expenses) and shipping.'},
                  ]},
                  { icon: '/ariel/new-assets/economic icon.svg', title: 'Economic Operation', bg: 'rgba(76,175,140,0.07)', border: 'rgba(76,175,140,0.25)', items: [
                    {emoji: '📉', title: 'Economic Losses', desc: 'The annual cost of damage from debris, including plastic litter on shipping, is US$279 million.'},
                    {emoji: '🧹', title: 'Cleanup Costs', desc: 'Daily cost of cleaning the Pacific garbage patch ranges from $5,000 to $20,000, with an annual cost of $122M to $489M.'},
                  ]},
                ].map((card, i) => (
                  <div key={i} style={{ background: card.bg, border: `1px solid ${card.border}`, borderRadius: '16px', padding: '32px', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(76,175,140,0.15)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px'}}>
                      <div style={{width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(76,175,140,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><img loading="lazy" decoding="async" src={card.icon} alt="" style={{width:'23px',height:'23px',objectFit:'contain'}} /></div>
                      <div style={{fontSize: '17px', fontWeight: 600, color: '#1a1a1a'}}>{card.title}</div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                      {card.items.map((item, j) => (
                        <div key={j} style={{background: 'white', borderRadius: '10px', padding: '16px', border: `1px solid ${card.border}`}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px'}}>
                            <div style={{fontSize: '13px', fontWeight: 600, color: '#333'}}>{item.title}</div>
                          </div>
                          <div style={{fontSize: '13px', color: '#666', lineHeight: 1.6}}>{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>


        {/* ── WHAT'S BEEN TRIED ── */}
        <section id="ariel-chapter-2" ref={setSectionRef(2)} style={{ ...ARIEL_PAGE_SNAP, background: '#fff', display: 'flex', flexDirection: 'column', padding: '20px 80px 80px 80px' }}>

        {/* 主视图：三张卡片 */}
        {triedView === null && (
          <div className="wave-in" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ marginBottom: '48px' }}>
              <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#579C87', textTransform: 'uppercase', marginBottom: '12px' }}>02 / Context</p>
              <h2 style={{ fontSize: 'var(--ariel-title)', fontWeight: 800, lineHeight: 1.1, margin: 0 }}>What&apos;s Been Tried</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', flex: 1, minHeight: 0 }}>
              {[
                {
                  key: 'government',
                  icon: '🏛️',
                  title: 'Government Policy',
                  subtitle: 'International Regulatory Instruments',
                  desc: 'Global conventions and initiatives aimed at reducing marine plastic pollution — and why they fall short.',
                  color: '#579C87',
                  bg: 'rgba(76,175,140,0.06)',
                  border: 'rgba(76,175,140,0.2)',
                  tag: 'Policy',
                },
                {
                  key: 'products',
                  icon: '♻️',
                  title: 'Recycled Products',
                  subtitle: 'From Waste to Value',
                  desc: 'Creative projects turning ocean plastic into products — from speakers to skateboard wheels.',
                  color: '#DFA6AA',
                  bg: 'rgba(242,168,168,0.06)',
                  border: 'rgba(242,168,168,0.2)',
                  tag: 'Industry',
                },
                {
                  key: 'cleaning',
                  icon: '🏖️',
                  title: 'Beach Cleaning',
                  subtitle: 'Community-Led Initiatives',
                  desc: 'Volunteer-driven beach cleanups — the scale of impact and the challenge of sea blindness.',
                  color: '#78A998',
                  bg: 'rgba(120,169,152,0.06)',
                  border: 'rgba(120,169,152,0.2)',
                  tag: 'Community',
                },
              ].map(card => (
                <div
                  key={card.key}
                  onClick={() => setTriedView(card.key as any)}
                  style={{ background: card.bg, border: `1px solid ${card.border}`, borderRadius: '20px', padding: '40px 36px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.25s, box-shadow 0.25s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 48px ${card.border}` }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
                >
                  <div>
                    <div style={{ fontSize: '48px', marginBottom: '24px' }}>{card.icon}</div>
                    <div style={{ fontSize: '11px', color: card.color, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>{card.subtitle}</div>
                    <h3 style={{ fontSize: 'var(--ariel-subtitle)', fontWeight: 600, color: '#1a1a1a', margin: '0 0 16px' }}>{card.title}</h3>
                    <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.75, margin: 0 }}>{card.desc}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '32px' }}>
                    <div style={{ background: card.bg, border: `1px solid ${card.border}`, color: card.color, fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px' }}>{card.tag}</div>
                    <div style={{ fontSize: '13px', color: card.color, fontWeight: 600 }}>Explore →</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Government Policy 子页面 */}
        {triedView === 'government' && (
        <div className="sub-slide-right wave-in" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* ── Header ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexShrink: 0 }}>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#579C87', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>What&apos;s Been Tried · Policy</p>
              <h2 style={{ fontSize: 'var(--ariel-title)', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>International Regulatory Instruments</h2>
            </div>
            <button
              onClick={() => setTriedView(null)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#335e51', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', color: 'white', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
            >← Back</button>
          </div>

          {/* ── Main layout ── */}
          <div className="policy-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: '28px', flex: 1, overflow: 'hidden' }}>

            {/* ════ LEFT: Timeline + Root Causes ════ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', paddingRight: '4px' }}>

              {/* Timeline */}
              <div>
                <p style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#579C87', textTransform: 'uppercase', fontWeight: 600, marginBottom: '16px' }}>Policy timeline</p>
                <div style={{ position: 'relative' }}>
                  {[
                    { year: '1982', title: 'UNCLOS — Art. 210', soft: false, quote: '"prevent, reduce and control pollution of the marine environment by dumping"' },
                    { year: '1988', title: 'MARPOL Annex V', soft: false, quote: 'Prohibited discharge at sea — but enforcement left entirely to flag states with no independent audit.' },
                    { year: '2012', title: 'Honolulu Strategy', soft: true, quote: 'A global framework for marine debris — voluntary, no binding targets, no penalty structure.' },
                    { year: '2017', title: 'UNEP Draft Resolution', soft: true, quote: '"all countries… to make responsible use of plastic… endeavoring to reduce unnecessary plastic use."' },
                    { year: '2019–22', title: 'PACPOL & Regional Programs', soft: true, quote: '"promotion of public-private partnerships… dissemination of outcomes" — language-heavy, sanction-light.' },
                    { year: '2024', title: 'Global Plastics Treaty (draft)', soft: true, quote: 'Negotiations at INC-5; binding production targets remain contested between producer and consumer nations.' },
                  ].map((item, i) => (
                    <details open className="policy-item" key={i} style={{ position: 'relative', marginBottom: '16px' }}>
<summary>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: item.soft ? '#c47a7a' : '#579C87', letterSpacing: '0.08em', marginBottom: '2px' }}>{item.year}</div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a1a', marginBottom: '3px' }}>{item.title}</div>
                      </summary><div style={{ fontSize: '11.5px', color: '#666', lineHeight: 1.65, fontStyle: 'italic', borderLeft: `2px solid ${item.soft ? 'rgba(242,168,168,0.4)' : 'rgba(76,175,140,0.3)'}`, paddingLeft: '10px' }}>{item.quote}</div>
                    </details>
                  ))}
                </div>
              </div>

              {/* Root Causes — under timeline */}
                <div className="root-causes-legacy" style={{ background: 'rgba(242,168,168,0.06)', border: '1px solid rgba(242,168,168,0.18)', borderRadius: '14px', padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <p style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Root causes of failure</p>
                    <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.1em', padding: '2px 8px', borderRadius: '20px', background: 'rgba(242,168,168,0.15)', color: '#b05050', border: '1px solid rgba(242,168,168,0.28)', textTransform: 'uppercase' }}>Analysis</span>
                  </div>
                  <p style={{ fontSize: '16px', color: '#c47a7a', lineHeight: 1.75, margin: 0, fontStyle: 'italic' }}>
                    Existing instruments lack legal enforcement — predominantly symbolic, relying on slogans rather than penalties.
                  </p>
                </div>

            </div>

            {/* ════ RIGHT: SWOT only — fills full height ════ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <p style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a1a' }}>Strategic analysis</p>
                <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.12em', padding: '2px 9px', borderRadius: '20px', background: 'rgba(76,175,140,0.1)', color: '#3a8a6a', border: '1px solid rgba(76,175,140,0.22)', textTransform: 'uppercase' }}>SWOT</span>
              </div>

              <div className="root-causes-card" style={{ background: 'rgba(242,168,168,0.06)', border: '1px solid rgba(242,168,168,0.18)', borderRadius: '14px', padding: '14px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Root causes of failure</p>
                  <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.1em', padding: '2px 8px', borderRadius: '20px', background: 'rgba(242,168,168,0.15)', color: '#b05050', border: '1px solid rgba(242,168,168,0.28)', textTransform: 'uppercase' }}>Analysis</span>
                </div>
                <p style={{ fontSize: '13px', color: '#a85f67', lineHeight: 1.55, margin: 0, fontStyle: 'italic' }}>
                  Existing instruments lack legal enforcement — predominantly symbolic, relying on slogans rather than penalties.
                </p>
              </div>

              {/* 2×2 grid fills remaining space */}
              <div className="policy-swot" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '4px', flex: 1 }}>

                {/* S */}
                <div style={{ position: 'relative', background: 'rgba(76,175,140,0.07)', border: '1px solid rgba(76,175,140,0.2)', borderRadius: '14px 3px 3px 3px', padding: '18px 18px 16px', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', right: '12px', bottom: '8px', fontSize: '64px', fontWeight: 900, color: 'rgba(76,175,140,0.11)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>S</div>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#3a8a6a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Strengths</div>
                  {['Global political recognition', 'Shared baseline definitions', 'Forum for state negotiation'].map((pt, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '16px', color: '#2d6e50', lineHeight: 1.6, marginBottom: '8px' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#579C87', flexShrink: 0, marginTop: '6px' }} />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>

                {/* O */}
                <div style={{ position: 'relative', background: 'rgba(120,169,152,0.07)', border: '1px solid rgba(120,169,152,0.2)', borderRadius: '3px 14px 3px 3px', padding: '18px 18px 16px', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', right: '12px', bottom: '8px', fontSize: '64px', fontWeight: 900, color: 'rgba(120,169,152,0.14)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>O</div>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#4a6ee0', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Opportunities</div>
                  {['2024 Global Treaty window', 'Extended producer responsibility', 'Trade-linked conditionality'].map((pt, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '16px', color: '#3a52b0', lineHeight: 1.6, marginBottom: '8px' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#78A998', flexShrink: 0, marginTop: '6px' }} />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>

                {/* W */}
                <div style={{ position: 'relative', background: 'rgba(242,168,168,0.07)', border: '1px solid rgba(242,168,168,0.22)', borderRadius: '3px 3px 3px 14px', padding: '18px 18px 16px', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', right: '12px', bottom: '8px', fontSize: '64px', fontWeight: 900, color: 'rgba(242,168,168,0.18)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>W</div>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#b05050', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Weaknesses</div>
                  {['No binding enforcement', 'Flag-state self-policing', 'Slow adoption cycles', 'No impact measurement'].map((pt, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '16px', color: '#8a4040', lineHeight: 1.6, marginBottom: '8px' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#DFA6AA', flexShrink: 0, marginTop: '6px' }} />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>

                {/* T */}
                <div style={{ position: 'relative', background: 'rgba(249,199,79,0.07)', border: '1px solid rgba(249,199,79,0.28)', borderRadius: '3px 3px 14px 3px', padding: '18px 18px 16px', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', right: '12px', bottom: '8px', fontSize: '64px', fontWeight: 900, color: 'rgba(249,199,79,0.22)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>T</div>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#8a6a00', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Threats</div>
                  {['Industry lobbying at INC-5', 'Producer vs consumer divide', 'Greenwashing of pledges', 'Microplastics blind spot'].map((pt, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '16px', color: '#6a4e00', lineHeight: 1.6, marginBottom: '8px' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#f9c74f', flexShrink: 0, marginTop: '6px' }} />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}



        {/* Recycled Products 子页面 */}
        {triedView === 'products' && (
          <div className="sub-slide-right wave-in" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexShrink: 0 }}>
              <div>
                <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#DFA6AA', textTransform: 'uppercase', marginBottom: '8px' }}>What&apos;s Been Tried · Industry</p>
                <h2 style={{ fontSize: 'var(--ariel-title)', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Recycled Plastic Products</h2>
              </div>
              <button onClick={() => setTriedView(null)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#335e51', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', color: 'white', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
              >← Back</button>
            </div>

            {/* 流程图 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '32px', flexShrink: 0 }}>
              {['Plastics', 'Chips', 'Fiber', 'Yarn', 'Fabric'].map((step, i, arr) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid #DFA6AA', color: '#DFA6AA', fontSize: '12px', fontWeight: 600, background: 'rgba(242,168,168,0.06)' }}>{step}</div>
                  {i < arr.length - 1 && <div style={{ color: '#DFA6AA', fontSize: '14px' }}>→</div>}
                </div>
              ))}
            </div>

            {/* 四张图片 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', flex: 1, minHeight: 0 }}>
              {[
                { img: '/ariel/gomi.jpg', name: 'Gomi Wireless Mag Charger', desc: 'UK-based studio Gomi created a Bluetooth speaker made entirely from non-recyclable plastic waste.' },
                { img: '/ariel/rum.jpg', name: 'Sustainable Rum Label', desc: "Fitzroy crafted the world's first sustainable rum label from discarded Coca-Cola bottle caps." },
                { img: '/ariel/precious.jpg', name: 'Precious Plastics', desc: 'Dave Hakkens launched a project transforming plastic waste into valuable items through open-source machines.' },
                { img: '/ariel/skateboard.jpg', name: 'Skateboard Wheels', desc: 'Hugo Maupetit and Vivian Fischer converted discarded chewing gum into vibrant recycled plastic skateboard wheels.' },
              ].map((item, i) => (
                <div key={i} style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }}
                  onMouseEnter={e => { const o = e.currentTarget.querySelector('.case-overlay') as HTMLElement; if(o) o.style.opacity = '1' }}
                  onMouseLeave={e => { const o = e.currentTarget.querySelector('.case-overlay') as HTMLElement; if(o) o.style.opacity = '0' }}>
                  <img loading="lazy" decoding="async" src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div className="case-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)', opacity: 0, transition: 'opacity 0.3s ease', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'white', marginBottom: '6px' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {triedView === 'cleaning' && (
          <div className="sub-slide-right wave-in" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexShrink: 0 }}>
              <div>
                <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#78A998', textTransform: 'uppercase', marginBottom: '6px' }}>What&apos;s Been Tried · Community</p>
                <h2 style={{ fontSize: 'var(--ariel-title)', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Beach Cleaning Activity</h2>
              </div>
              <button onClick={() => setTriedView(null)}
                style={{ background: '#335e51', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', color: 'white', fontWeight: 600, cursor: 'pointer' }}
              >← Back</button>
            </div>

            {/* Main 2-col */}
            <div style={{ display: 'grid', gridTemplateColumns: '600px 1fr', gap: '36px', flex: 1, minHeight: 0 }}>

              {/* LEFT: 轮播 + 数据 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <div
                  style={{ height: '390px', borderRadius: '16px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}
                  onMouseEnter={() => setCleaningPaused(true)}
                  onMouseLeave={() => setCleaningPaused(false)}
                >
                  {['/ariel/beach-clean.png', '/ariel/beach-clean.jpg', '/ariel/beach-clean1.jpg'].map((src, i) => (
                    <img loading="lazy" decoding="async" key={i} src={src} alt={`beach cleaning ${i + 1}`} style={{
                      position: 'absolute', inset: 0, width: '100%', height: '100%',
                      objectFit: 'cover', objectPosition: 'center 35%',
                      opacity: cleaningSlide === i ? 1 : 0,
                      transition: 'opacity 0.6s ease',
                    }} />
                  ))}
                  <button onClick={() => setCleaningSlide(s => (s - 1 + 3) % 3)}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
                  <button onClick={() => setCleaningSlide(s => (s + 1) % 3)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
                  <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                    {[0,1,2].map(i => (
                      <div key={i} onClick={() => setCleaningSlide(i)}
                        style={{ width: cleaningSlide === i ? '18px' : '6px', height: '6px', borderRadius: '3px', background: cleaningSlide === i ? 'white' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.3s' }} />
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#78A998', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>#SeatheChange 2022</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[
                      { num: '469,482',    label: 'Volunteers' },
                      { num: '15,519,392', label: 'Items Collected' },
                      { num: '24,958',     label: 'Kilometers Covered' },
                      { num: '3,700,589',  label: 'Kilograms Removed' },
                    ].map((stat, i) => (
                      <div key={i} style={{ background: 'rgba(120,169,152,0.07)', border: '1px solid rgba(120,169,152,0.18)', borderRadius: '12px', padding: '18px 16px' }}>
                        <div style={{ fontSize: '24px', fontWeight: 900, color: '#1a1a1a', lineHeight: 1, letterSpacing: '-0.02em' }}><CountUp value={Number(stat.num.replaceAll(',', ''))} small /></div>
                        <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: Ocean Literacy + 左下角小插图 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'auto' }}>

                {/* 标题 + 引用 */}
                <div>
                  <div style={{ fontSize: '10px', color: '#DFA6AA', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>People&apos;s Awareness</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#1a1a1a', marginBottom: '10px' }}>Ocean Literacy</div>
                  <p style={{ fontSize: '15px', color: '#888', fontStyle: 'italic', lineHeight: 1.75, borderLeft: '3px solid #DFA6AA', paddingLeft: '12px', margin: 0 }}>
                    &quot;the understanding of our individual and collective impact on the Ocean and its impact on our lives and wellbeing&quot;
                  </p>
                </div>

                {/* 60% 数据 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(242,168,168,0.07)', borderRadius: '14px', padding: '10px 10px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'baseline', background: 'rgba(242,168,168,0.18)', borderRadius: '10px', padding: '6px 10px', flexShrink: 0 }}>
                    <span style={{ fontSize: '36px', fontWeight: 900, color: '#1a1a1a', lineHeight: 1 }}><CountUp value={60} suffix="%" /></span>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a' }}>of population lives inland</div>
                    <div style={{ fontSize: '11px', color: '#888', marginTop: '5px', lineHeight: 1.5 }}>Inland people generally have <strong style={{ color: '#1a1a1a' }}>lower ocean literacy</strong> than coastal residents</div>
                  </div>
                </div>


              {/* 底部：左边插图，右边文字内容 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start', flex: 1 }}>

              {/* 左：插图 */}
              <div style={{ borderRadius: '14px', overflow: 'hidden' }}>
                <img loading="lazy" decoding="async"
                  src="/ariel/sea-blindness.png"
                  alt="sea blindness"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
                />
              </div>

              {/* 右：Assessment + Global Action 叠放 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>

                {/* Assessment */}
                <div style={{ background: '#fafafa', borderRadius: '14px', padding: '16px 18px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a', marginBottom: '3px' }}>Ocean Literacy Assessment</div>
                  <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '10px' }}>723 students age 12–18, Nova Scotia</div>
                  {[
                    { text: 'Knowledge level was low but interest in the ocean was high.', strong: true },
                    { text: 'Greater engagement was positively linked to knowledge.', strong: true },
                    { text: 'Higher knowledge linked to interest in ocean careers.', strong: false },
                    { text: 'Improved ocean literacy can enhance marine citizenship and has economic benefits.', strong: false },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '7px', alignItems: 'flex-start' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.strong ? '#DFA6AA' : '#ddd', flexShrink: 0, marginTop: '5px' }} />
                      <div style={{ fontSize: '11px', color: item.strong ? '#333' : '#bbb', lineHeight: 1.6, fontWeight: item.strong ? 600 : 400 }}>{item.text}</div>
                    </div>
                  ))}
                </div>

                {/* Global Action */}
                <div style={{ background: 'rgba(76,175,140,0.06)', border: '1px solid rgba(76,175,140,0.2)', borderRadius: '14px', padding: '16px 18px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#1a1a1a', marginBottom: '6px' }}>Global Action</div>
                  <p style={{ fontSize: '11px', color: '#555', lineHeight: 1.75, margin: 0 }}>
                    EMSEA have been pivotal in promoting Ocean Literacy across Europe, embedded into the <strong style={{ color: '#579C87' }}>UN Decade of Ocean Science (2021–2030)</strong>.
                  </p>
                </div>

                </div>
                </div>
              </div>
            </div>
          </div>
        )}


        </section>
{/* Existing Gaps */}
<section id="ariel-chapter-3" ref={setSectionRef(3)} style={{ ...ARIEL_PAGE_SNAP, paddingTop: '20px', background: '#fafafa', display: 'flex', flexDirection: 'column' }}>
  <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '20px 80px 80px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
  <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

    {/* 标题 */}
    <div style={{ textAlign: 'center', marginBottom: '56px' }}>
      <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#579C87', textTransform: 'uppercase', marginBottom: '12px' }}>03 / Why It&apos;s Not Enough</p>
      <h2 style={{ fontSize: 'var(--ariel-title)', fontWeight: 800, marginBottom: '0' }}>Existing Gaps</h2>
    </div>

    {/* 4张卡片：左2绿，右2粉 */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
      {[
        {
          icon: '⚖️',
          tag: 'Policy',
          title: 'Regulatory Inefficiency',
          desc: 'International instruments lack enforcement. Convention non-compliance is common with flag states often failing their responsibilities.',
          points: ['No binding enforcement', 'Flag-state self-policing', 'Slow adoption cycles'],
          color: '#579C87',
          bg: 'rgba(76,175,140,0.05)',
          shadow: 'rgba(76,175,140,0.2)',
          border: 'rgba(76,175,140,0.15)',
          hoverBorder: 'rgba(76,175,140,0.35)',
          dotColor: '#579C87',
        },
        {
          icon: '👁️',
          tag: 'Awareness',
          title: 'Low Public Awareness',
          desc: 'Most people are aware of marine pollution but few take practical action — sea blindness keeps the issue abstract for inland populations.',
          points: ['60% population lives inland', 'Sea blindness effect', 'Knowledge ≠ action'],
          color: '#579C87',
          bg: 'rgba(76,175,140,0.05)',
          shadow: 'rgba(76,175,140,0.2)',
          border: 'rgba(76,175,140,0.15)',
          hoverBorder: 'rgba(76,175,140,0.35)',
          dotColor: '#579C87',
        },
        {
          icon: '💸',
          tag: 'Industry',
          title: 'High Cost of Recycling',
          desc: 'Recycled plastic products are sustainable but costly to produce, limiting commercial scale and long-term viability without subsidies.',
          points: ['Limits commercial scale', 'Low market demand', 'Infrastructure gaps'],
          color: '#579C87',
          bg: 'rgba(76,175,140,0.05)',
          shadow: 'rgba(76,175,140,0.25)',
          border: 'rgba(76,175,140,0.18)',
          hoverBorder: 'rgba(76,175,140,0.4)',
          dotColor: '#579C87',
        },
        {
          icon: '🧩',
          tag: 'System',
          title: 'Disconnected Stakeholders',
          desc: 'Fishermen, tourists, and businesses operate in silos with no unified incentive structure to coordinate participation in cleanup.',
          points: ['Fishermen work in isolation', 'No unified incentive', 'Tourist behavior uncaptured'],
          color: '#579C87',
          bg: 'rgba(76,175,140,0.05)',
          shadow: 'rgba(76,175,140,0.25)',
          border: 'rgba(76,175,140,0.18)',
          hoverBorder: 'rgba(76,175,140,0.4)',
          dotColor: '#579C87',
        },
      ].map((card, i) => (
        <div
          key={i}
          style={{
            background: card.bg,
            border: `1px solid ${card.border}`,
            borderRadius: '20px',
            padding: '36px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
            cursor: 'default',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'translateY(-6px)';
            el.style.boxShadow = `0 20px 48px ${card.shadow}`;
            el.style.borderColor = card.hoverBorder;
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'translateY(0)';
            el.style.boxShadow = 'none';
            el.style.borderColor = card.border;
          }}
        >
          {/* Icon + tag */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            
            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: card.color, background: `${card.shadow}`, padding: '3px 10px', borderRadius: '20px', border: `1px solid ${card.border}` }}>{card.tag}</span>
          </div>

          {/* Title */}
          <h3 style={{ fontSize: 'var(--ariel-subtitle)', fontWeight: 600, color: '#1a1a1a', margin: 0, lineHeight: 1.2 }}>{card.title}</h3>

          {/* Desc */}
          <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.75, margin: 0 }}>{card.desc}</p>

          {/* Divider */}
          <div style={{ height: '1px', background: card.border }} />

          {/* Bullet points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {card.points.map((pt, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: card.dotColor, flexShrink: 0 }} />
                <span style={{ fontSize: '12.5px', color: '#555' }}>{pt}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
  </div>
</section>

      {/* ── FIELD RESEARCH ── */}
      <section id="ariel-chapter-4" ref={setSectionRef(4)} style={{ ...ARIEL_PAGE_SNAP, background: '#fff', paddingTop: '80px', display: 'flex', flexDirection: 'column' }}>
        <style>{`
          @keyframes ping { 0% { transform: scale(1); opacity: 0.4; } 100% { transform: scale(2.5); opacity: 0; } }
          @keyframes slideOutLeft { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-80px); opacity: 0; } }
          @keyframes slideInRight { from { transform: translateX(80px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
          @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(80px); opacity: 0; } }
          @keyframes slideInLeft { from { transform: translateX(-80px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
          @keyframes waveIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes subSlideInRight { from { transform: translateX(60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
          .slide-out-left  { animation: slideOutLeft  0.38s cubic-bezier(.4,0,.2,1) forwards; }
          .slide-in-right  { animation: slideInRight  0.38s cubic-bezier(.4,0,.2,1) forwards; }
          .slide-out-right { animation: slideOutRight 0.38s cubic-bezier(.4,0,.2,1) forwards; }
          .slide-in-left   { animation: slideInLeft   0.38s cubic-bezier(.4,0,.2,1) forwards; }
          .wave-in         { animation: waveIn 0.5s cubic-bezier(.22,.8,.36,1) forwards; }
          .sub-slide-right { animation: subSlideInRight 0.38s cubic-bezier(.4,0,.2,1) forwards; }
        `}</style>

        <div style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden' }}>

          {/* 主视图 */}
          <div
            key={activeDetail ? 'hidden' : 'main'}
            className={`ariel-field-overview ${activeDetail && activeDetail !== 'location' ? 'slide-out-left' : ''}`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          >
            <div className="field-map-layer">
              <img loading="lazy" decoding="async" className="field-map-image" src="/ariel/new-assets/map with red circle.png" alt="Quanzhou field-research location map" />

              {/* 泉州红点：与底图红圈中心使用相同百分比坐标 */}
              <div className="field-map-hotspot" style={{ position: 'absolute', left: '41.94%', top: '49.37%', zIndex: 10 }}>
              <button type="button" className="field-map-dot" aria-label="Open Quanzhou field-site details" aria-expanded={activeDetail === 'location'} onClick={() => setActiveDetail(activeDetail === 'location' ? null : 'location')}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#DFA6AA', opacity: 0.4, animation: 'ping 1.5s ease-out infinite' }} />
                <div className="field-map-dot-core" />
              </button>
              {activeDetail === 'location' && (
                <div className="field-map-popover" style={{ position: 'absolute', top: '-100px', left: '40px', width: '350px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 18px 56px rgba(30,58,49,0.2)', padding: '20px', zIndex: 200, animation: 'slideInRight 0.35s cubic-bezier(.22,.8,.36,1)' }}>
                  <button onClick={(e) => { e.stopPropagation(); setActiveDetail(null) }} style={{ position: 'absolute', top: '10px', right: '12px', background: 'none', border: 'none', fontSize: '16px', color: '#bbb', cursor: 'pointer', lineHeight: 1 }}>✕</button>
                  <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#579C87', marginBottom: '8px' }}>Field Site</div>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#1a1a1a', marginBottom: '2px' }}>Quanzhou, China</div>
                  <div style={{ fontSize: '11px', color: '#579C87', marginBottom: '12px' }}>24°N, 118°E</div>
                  <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.75, marginBottom: '12px' }}>Quanzhou was China&apos;s major port from the 11th–14th centuries, visited by both Marco Polo and Ibn Battuta — one of the most prosperous cities in the world.</p>
                  {[
                    { name: 'Windmill Island', desc: 'Fishermen interviews & abandoned waste observation' },
                    { name: 'Yusha Bay Park', desc: '1km beach clean-up & emotion mapping' },
                  ].map((loc) => (
                    <div key={loc.name} style={{ background: 'rgba(76,175,140,0.06)', border: '1px solid rgba(76,175,140,0.2)', borderRadius: '8px', padding: '10px 12px', marginBottom: '8px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a1a', marginBottom: '2px' }}>{loc.name}</div>
                      <div style={{ fontSize: '11px', color: '#888', lineHeight: 1.5 }}>{loc.desc}</div>
                    </div>
                  ))}
                </div>
              )}
              </div>
            </div>

            {/* 左下角文字 + 按钮 */}
            <div className="ariel-field-intro" style={{ position: 'absolute', left: '80px', top: '16px', zIndex: 2, maxWidth: '380px' }}>
              <span className="ariel-section-kicker">04 / Field Research</span>
              <h2 style={{ fontSize: 'var(--ariel-title)', fontWeight: 800, color: '#1a1a1a', marginBottom: '16px' }}>Field Research</h2>
              <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.75, marginBottom: '400px' }}>On January 1, 2024, the team arrived in Quanzhou, China, for a three-day field study. We conducted interviews with tourists and fishermen and experienced the entire beach cleaning process.</p>

              {/* ── 新增：View Research Insights 入口按钮 ── */}
              <button
                onClick={() => setActiveDetail('insights')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#335e51',
                  color: 'white',
                  border: 'none',
                  borderRadius: '200px',
                  padding: '12px 85px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                  transition: 'background 0.2s',
                }}
              >
                <span style={{ fontSize: '15px' }}>✦</span>
                View Research Insights
                <span style={{ opacity: 0.6 }}>→</span>
              </button>
            </div>

            {/* 散落照片 */}
            <div className="ariel-field-photos" style={{ position: 'absolute', left: '40%', right: 0, top: 0, bottom: 0, zIndex: 3 }}>

            {/* 左上：beach.png → Emotion Map */}
            <div role="button" tabIndex={0} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.click() } }} onClick={() => { setCleaningView('emotion'); setActiveDetail('cleaning') }}
              style={{ position: 'absolute', left: '2%', top: '80px', width: '230px', transform: 'rotate(-4deg)', cursor: 'pointer', background: 'white', padding: '8px 8px 36px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', transition: 'transform 0.3s, box-shadow 0.3s', zIndex: 2 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'rotate(-3deg) scale(1.05) translateY(-8px)'; (e.currentTarget as HTMLElement).style.zIndex = '99'; (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 48px rgba(0,0,0,0.18)'; const lbl = e.currentTarget.querySelector('.photo-label') as HTMLElement; if(lbl) lbl.style.opacity = '1' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'rotate(-4deg)'; (e.currentTarget as HTMLElement).style.zIndex = '2'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'; const lbl = e.currentTarget.querySelector('.photo-label') as HTMLElement; if(lbl) lbl.style.opacity = '0' }}>
              <div style={{ position: 'relative' }}>
                <img loading="lazy" decoding="async" src="/ariel/beach.png" alt="Yusha Bay Park" style={{ width: '100%', height: '155px', objectFit: 'cover', display: 'block' }} />
                <div className="photo-label" style={{ position: 'absolute', top: '8px', left: '8px', background: '#DFA6AA', color: 'white', fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', letterSpacing: '0.06em', opacity: 0, transition: 'opacity 0.2s' }}>EMOTION MAP →</div>
              </div>
              <p style={{ fontSize: '11px', color: '#999', fontStyle: 'italic', marginTop: '10px', lineHeight: 1.75 }}>Taken at Yusha Bay Park<br />in Quanzhou by Xiangrui Zhou</p>
            </div>

            {/* 中：rubbish.png → Results */}
            <div role="button" tabIndex={0} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.click() } }} onClick={() => { setCleaningView('result'); setActiveDetail('cleaning') }}
              style={{ position: 'absolute', left: '35%', top: '160px', width: '255px', transform: 'rotate(1.5deg)', cursor: 'pointer', background: 'white', padding: '8px 8px 36px', boxShadow: '0 4px 24px rgba(0,0,0,0.15)', transition: 'transform 0.3s, box-shadow 0.3s', zIndex: 4 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'rotate(1.5deg) scale(1.05) translateY(-8px)'; (e.currentTarget as HTMLElement).style.zIndex = '99'; (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 48px rgba(0,0,0,0.18)'; const lbl = e.currentTarget.querySelector('.photo-label') as HTMLElement; if(lbl) lbl.style.opacity = '1' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'rotate(1.5deg)'; (e.currentTarget as HTMLElement).style.zIndex = '4'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)'; const lbl = e.currentTarget.querySelector('.photo-label') as HTMLElement; if(lbl) lbl.style.opacity = '0' }}>
              <div style={{ position: 'relative' }}>
                <img loading="lazy" decoding="async" src="/ariel/rubbish.png" alt="Trash collected" style={{ width: '100%', height: '175px', objectFit: 'cover', display: 'block' }} />
                <div className="photo-label" style={{ position: 'absolute', top: '8px', left: '8px', background: '#E8897A', color: 'white', fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', letterSpacing: '0.06em', opacity: 0, transition: 'opacity 0.2s' }}>RESULTS →</div>
              </div>
              <p style={{ fontSize: '11px', color: '#999', fontStyle: 'italic', marginTop: '10px', lineHeight: 1.75 }}>Taken at Yusha Bay Park<br />in Quanzhou by Xiangrui Zhou</p>
            </div>

            {/* 右上：person.png → Interview */}
            <div role="button" tabIndex={0} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.click() } }} onClick={() => { setCleaningView('emotion'); setActiveDetail('cleaning') }}
              style={{ position: 'absolute', right: '10%', top: '80px', width: '200px', transform: 'rotate(3deg)', cursor: 'pointer', background: 'white', padding: '8px 8px 36px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', transition: 'transform 0.3s, box-shadow 0.3s', zIndex: 3 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'rotate(2deg) scale(1.05) translateY(-8px)'; (e.currentTarget as HTMLElement).style.zIndex = '99'; (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 48px rgba(0,0,0,0.18)'; const lbl = e.currentTarget.querySelector('.photo-label') as HTMLElement; if(lbl) lbl.style.opacity = '1' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'rotate(3deg)'; (e.currentTarget as HTMLElement).style.zIndex = '3'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'; const lbl = e.currentTarget.querySelector('.photo-label') as HTMLElement; if(lbl) lbl.style.opacity = '0' }}>
              <div style={{ position: 'absolute', top: '-32px', right: '16px', zIndex: 10 }}>
                <span style={{ fontFamily: 'cursive', fontSize: '14px', color: '#DFA6AA', fontWeight: 600 }}>it&apos;s me~</span>
                <svg style={{ display: 'block', marginTop: '-2px' }} width="48" height="20" viewBox="0 0 48 20">
                  <path d="M 44 2 Q 28 0 8 16" fill="none" stroke="#DFA6AA" strokeWidth="2" strokeDasharray="4 2" />
                  <polygon points="5,18 12,12 14,18" fill="#DFA6AA" />
                </svg>
              </div>
              <div style={{ position: 'relative' }}>
                <img loading="lazy" decoding="async" src="/ariel/person.png" alt="Researcher at beach" style={{ width: '100%', height: '195px', objectFit: 'cover', objectPosition: 'right top', display: 'block' }} />
                <div className="photo-label" style={{ position: 'absolute', top: '8px', left: '8px', background: '#DFA6AA', color: 'white', fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', letterSpacing: '0.06em', opacity: 0, transition: 'opacity 0.2s' }}>EMOTION MAP →</div>
              </div>
              <p style={{ fontSize: '11px', color: '#999', fontStyle: 'italic', marginTop: '10px', lineHeight: 1.75 }}>Taken at Yusha Bay Park<br />in Quanzhou by Wenjia Shi</p>
            </div>

            {/* 左下：wind.png → Interview */}
            <div role="button" tabIndex={0} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.click() } }} onClick={() => setActiveDetail('interview')}
              style={{ position: 'absolute', left: '6%', top: '400px', width: '235px', transform: 'rotate(-1.5deg)', cursor: 'pointer', background: 'white', padding: '8px 8px 36px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', transition: 'transform 0.3s, box-shadow 0.3s', zIndex: 2 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'rotate(-1.5deg) scale(1.05) translateY(-8px)'; (e.currentTarget as HTMLElement).style.zIndex = '99'; (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 48px rgba(0,0,0,0.18)'; const lbl = e.currentTarget.querySelector('.photo-label') as HTMLElement; if(lbl) lbl.style.opacity = '1' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'rotate(-1.5deg)'; (e.currentTarget as HTMLElement).style.zIndex = '2'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'; const lbl = e.currentTarget.querySelector('.photo-label') as HTMLElement; if(lbl) lbl.style.opacity = '0' }}>
              <div style={{ position: 'relative' }}>
                <img loading="lazy" decoding="async" src="/ariel/wind.png" alt="Windmill Island" style={{ width: '100%', height: '155px', objectFit: 'cover', display: 'block' }} />
                <div className="photo-label" style={{ position: 'absolute', top: '8px', left: '8px', background: '#78A998', color: 'white', fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', letterSpacing: '0.06em', opacity: 0, transition: 'opacity 0.2s' }}>INTERVIEW →</div>
              </div>
              <p style={{ fontSize: '11px', color: '#999', fontStyle: 'italic', marginTop: '10px', lineHeight: 1.75 }}>Taken at Windmill Island<br />in Quanzhou by Xiangrui Zhou</p>
            </div>

            {/* 右下：park.png → Emotion Map */}
            <div role="button" tabIndex={0} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.click() } }} onClick={() => setActiveDetail('interview')}
              style={{ position: 'absolute', right: '7%', top: '410px', width: '235px', transform: 'rotate(3deg)', cursor: 'pointer', background: 'white', padding: '8px 8px 36px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', transition: 'transform 0.3s, box-shadow 0.3s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'rotate(1deg) scale(1.05) translateY(-8px)'; (e.currentTarget as HTMLElement).style.zIndex = '99'; (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 48px rgba(0,0,0,0.18)'; const lbl = e.currentTarget.querySelector('.photo-label') as HTMLElement; if(lbl) lbl.style.opacity = '1' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'rotate(3deg)'; (e.currentTarget as HTMLElement).style.zIndex = '2'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'; const lbl = e.currentTarget.querySelector('.photo-label') as HTMLElement; if(lbl) lbl.style.opacity = '0' }}>
              <div style={{ position: 'relative' }}>
                <img loading="lazy" decoding="async" src="/optimized/ariel-park.webp" alt="Yusha Bay coastline" style={{ width: '100%', height: '155px', objectFit: 'cover', display: 'block' }} />
                <div className="photo-label" style={{ position: 'absolute', top: '8px', left: '8px', background: '#78A998', color: 'white', fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', letterSpacing: '0.06em', opacity: 0, transition: 'opacity 0.2s' }}>INTERVIEW →</div>
              </div>
              <p style={{ fontSize: '11px', color: '#999', fontStyle: 'italic', marginTop: '10px', lineHeight: 1.75 }}>Taken at Yusha Bay Park<br />in Quanzhou by Xiangrui Zhou</p>
            </div>

          </div>
          </div>

          {/* Detail 视图 */}
          {(activeDetail === 'interview' || activeDetail === 'cleaning' || activeDetail === 'insights') && (
            <div key={activeDetail} className="slide-in-right ariel-field-detail" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: '#fff', padding: '16px 80px 80px', boxSizing: 'border-box', overflowY: 'auto' }}>

              {/* 导航栏 */}
              {activeDetail !== 'insights' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '0 0 20px', borderBottom: '1px solid #f5f5f5', marginBottom: '28px' }}>
                <button
                  onClick={() => {
                    setActiveDetail(null)
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', color: '#888', cursor: 'pointer' }}
                >← Back</button>

                {activeDetail === 'interview' && (
                  <div style={{ background: 'rgba(120,169,152,0.15)', color: '#47796A', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: '20px' }}>Interviews</div>
                )}
                {activeDetail === 'cleaning' && (
                  <div style={{ background: 'rgba(232,137,122,0.15)', color: '#c47a7a', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: '20px' }}>Beach Cleaning</div>
                )}
                <span style={{ fontSize: '13px', color: '#999' }}>
                  {activeDetail === 'interview' && '3 stakeholders · Windmill Island'}
                  {activeDetail === 'cleaning' && 'Yusha Bay Park · 1km stretch'}
                </span>


              </div>
              )}
              {/* Interview */}
              {activeDetail === 'interview' && (
                <InterviewCards onShowInsight={() => setActiveDetail('insights')} onAccentChange={setInterviewAccent} />
              )}

              {/* Cleaning */}
              {activeDetail === 'cleaning' && (
                <div>
                  {cleaningView === 'emotion' && (
                    <EmotionMapInner onShowResult={() => setCleaningView('result')} />
                  )}
                  {cleaningView === 'result' && (
                    <div className="sub-slide-right wave-in result-reference-view">
                      <div className="result-reference-copy">
                        <button onClick={() => setCleaningView('emotion')} className="result-back-button">← Emotion Map</button>
                        <span className="ariel-section-kicker">Beach Cleaning · Result</span>
                        <h3>What the beach revealed.</h3>
                        <p>Across a one-kilometre stretch of Yusha Bay, the team sorted every collected object to understand what visitors leave behind and what the current cleaning system misses.</p>
                        <dl>
                          <div><dt>27</dt><dd>items recorded</dd></div>
                          <div><dt>1 km</dt><dd>surveyed shoreline</dd></div>
                          <div><dt>3</dt><dd>material groups</dd></div>
                        </dl>
                      </div>
                      <div className="result-reference-media">
                        <img loading="lazy" decoding="async" src="/optimized/ariel-result.webp" alt="Beach cleaning results arranged by material and type" />
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* Insights */}
              {activeDetail === 'insights' && (
                <InsightPage
                  onBack={() => setActiveDetail(null)}
                  backLabel="Back to Field Research"
                />
              )}
            </div>
          )}
        </div>
      </section>
      {/* ── SYSTEM RESTRUCTURE ── */}
      <section id="ariel-chapter-5" ref={setSectionRef(5)} style={{ ...ARIEL_PAGE_SNAP, background: '#fff', display: 'flex', flexDirection: 'column', padding: '40px 80px 60px 80px' }}>

        {/* 标题 */}
        <div style={{ marginBottom: '32px', flexShrink: 0 }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#579C87', textTransform: 'uppercase', marginBottom: '8px' }}>05 / From Research to Design</p>
          <h2 style={{ fontSize: 'var(--ariel-title)', fontWeight: 800, color: '#1a1a1a', margin: '0 0 12px' }}>System Restructure</h2>
          <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.75, maxWidth: '700px', margin: 0 }}>
            To optimize the original beach cleanup system, it is crucial to reshape the core and its relevant driving forces, with the goal of achieving positive feedback and sustainable improvement.
          </p>
        </div>

        {/* 主体：左侧图片 + 右侧tabs */}
        <div className="system-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '32px', flex: 1, overflow: 'hidden' }}>

          {/* 左侧：两张图 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px', overflow: 'hidden', paddingRight: '10px' }}>
            {[
              {
                label: 'Before', src: '/ariel/old.jpg',
                nodes: [
                  { id: 'government',    x: 50,   y: 50,   size: 80 },
                  { id: 'regulatory',    x: 65,   y: 58,   size: 44 },
                  { id: 'legislative',   x: 35,   y: 58,   size: 44 },
                  { id: 'publicity',     x: 50,   y: 28,   size: 44 },
                  { id: 'factory',       x: 10,   y: 50,   size: 40 },
                  { id: 'store',         x: 30,   y: 72,   size: 44 },
                  { id: 'consumers',     x: 10,   y: 65,   size: 44 },
                  { id: 'tourist',       x: 93,   y: 54,   size: 52 },
                  { id: 'fishermen',     x: 49,   y: 93.2, size: 54 },
                  { id: 'international', x: 42,   y: 10,   size: 40 },
                  { id: 'school',        x: 58,   y: 10,   size: 40 },
                ],
                highlights: {
                  fishermen:  ['fishermen'],
                  tourists:   ['tourist', 'fishermen'],
                  enterprise: ['government'],
                }
              },
              {
                label: 'After', src: '/ariel/new.jpg',
                nodes: [
                  { id: 'fishermen-top',   x: 36,   y: 7,  size: 54 },
                  { id: 'company',         x: 50,   y: 50, size: 80 },
                  { id: 'regulatory',      x: 78,   y: 25, size: 44 },
                  { id: 'factory',         x: 65,   y: 28, size: 44 },
                  { id: 'store',           x: 32,   y: 55, size: 44 },
                  { id: 'station',         x: 65,   y: 55, size: 44 },
                  { id: 'tourist',         x: 93.5, y: 54, size: 52 },
                  { id: 'consumers',       x: 15,   y: 50, size: 44 },
                  { id: 'publicity',       x: 22,   y: 72, size: 40 },
                  { id: 'international',   x: 48,   y: 85, size: 40 },
                  { id: 'fishermen-outer', x: 72,   y: 78, size: 44 },
                ],
                highlights: {
                  fishermen:  ['fishermen-top'],
                  tourists:   ['tourist', 'fishermen-top'],
                  enterprise: ['company'],
                }
              },
            ].map(diagram => {
              const highlightIds = (systemTab && systemTab !== 'original')
                ? diagram.highlights[systemTab as keyof typeof diagram.highlights] ?? []
                : []
              const color = ({ fishermen: '#579C87', tourists: '#78A998', enterprise: '#DFA6AA' } as Record<string, string>)[systemTab ?? ''] ?? '#579C87'

              return (
                <div key={diagram.label} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: diagram.label === 'Before' ? '#aaa' : '#579C87' }}>{diagram.label}</div>
                    <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
                  </div>
                  <DiagramWithHighlight
                    src={diagram.src}
                    highlightIds={highlightIds}
                    nodes={diagram.nodes}
                    color={color}
                    label={diagram.label}
                  />
                </div>
              )
            })}
          </div>

          {/* 右侧：tabs */}
          <div className="system-controls">
            <div className="system-tabs">
              {[
                { key: 'original', label: 'Overall', icon: null, color: '#579C87' },
                { key: 'fishermen', label: 'Origin', icon: '/ariel/new-assets/starting point icon.svg', color: '#579C87' },
                { key: 'tourists', label: 'Routes', icon: '/ariel/new-assets/dual lines-icon.png', color: '#579C87' },
                { key: 'enterprise', label: 'Driver', icon: '/ariel/new-assets/driven power.svg', color: '#C97884' },
              ].map(tab => (
                <button key={tab.key} onClick={() => setSystemTab(tab.key as typeof systemTab)} aria-pressed={systemTab === tab.key} style={{ '--tab-color': tab.color } as CSSProperties}>
                  {tab.icon ? <img loading="lazy" decoding="async" src={tab.icon} alt="" /> : <span className="system-overall-icon"><i /><i /></span>}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            <div className={`system-tab-copy is-${systemTab}`}>
              {systemTab === 'original' && <><strong>Overall system</strong><p>The redesigned network shifts Ariel from a loose public initiative into a connected service system. Pink relationships carry the main value exchange, while green relationships provide education, policy and operational support.</p></>}
              {systemTab === 'fishermen' && <><strong>Fishermen as the origin</strong><p>Fishermen become the first reliable source of recovered material. Their daily contact with the sea connects routine marine work directly to Ariel’s collection, sorting and reward network.</p></>}
              {systemTab === 'tourists' && <><strong>Two participation routes</strong><p>A continuous route for fishermen is paired with a lighter entry route for tourists. One secures material supply; the other expands public participation and ocean awareness.</p></>}
              {systemTab === 'enterprise' && <><strong>Enterprise as the driver</strong><p>Commercial incentives give collection and recycling a repeatable source of value. This replaces weak government-led soft law with practical reasons for every participant to remain active in the loop.</p></>}
            </div>
          </div>

        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { box-shadow: 0 0 0 3px rgba(255,255,255,0.15), 0 0 6px currentColor; opacity: 0.8; }
            50% { box-shadow: 0 0 0 2px rgba(255,255,255,0.05), 0 0 16px currentColor; opacity: 0.7; }
          }
        `}</style>
      </section>

{/* ── STAKEHOLDER MAP ── */}
      <section id="ariel-chapter-6" className="ariel-map-chapter" ref={setSectionRef(6)} style={{ ...ARIEL_PAGE_SNAP, background: '#f8f0ef', display: 'flex', flexDirection: 'column', padding: '32px 80px 16px 80px' }}>

        {/* Header */}
        <div className="ariel-map-heading" style={{ marginBottom: '8px', flexShrink: 0 }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#579C87', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>06 / The System</p>
          <h2 style={{ fontSize: 'var(--ariel-title)', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Stakeholder Map</h2>
        </div>

        {/* Main body: map left + panel right */}
        <div className="ariel-map-layout" style={{ flex: 1, minHeight: 0, minWidth: 0, display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px', alignContent: 'stretch' }}>

          {/* LEFT: SVG Map */}
          <div className="ariel-map-canvas" style={{ position: 'relative', minHeight: 0, background: 'transparent', borderRadius: '16px', overflow: 'hidden' }}>
            <StakeholderMap activeTab={stakeTab} />
          </div>

          {/* RIGHT: Tab + Detail panel */}
          <div className="ariel-map-controls" style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', paddingTop: '80px' }}>
            {stakeTab === 'all' && (
              <>
                <div style={{ marginBottom: '20px', flexShrink: 0 }}>
                  <p style={{ fontSize: '15px', color: '#888', lineHeight: 1.75, margin: 0 }}>
                    A comprehensive stakeholder map marking relationships, inputs, outputs,
                    entities, and virtual elements for a holistic view of Ariel&apos;s system.
                  </p>
                </div>
              </>
            )}
            {([
              {
                key: 'support',
                label: 'Required Support',
                color: '#a3519b',
                bg: 'rgba(163,81,155,0.06)',
                border: 'rgba(163,81,155,0.25)',
                sub: 'financial/technical assistance',
                detail: [
                  {
                    title: 'Government',
                    items: [
                      'Provide resources of professional environmental experts',
                      'Licenses and preferential policies for sites and factories',
                      'Formulate policies for tax reduction benefits for fishermen',
                    ],
                  },
                  {
                    title: 'Branding Partner',
                    items: ['Provide financial assistance'],
                  },
                ],
              },
              {
                key: 'returns',
                label: 'Related Returns',
                color: '#8fb7e2',
                bg: 'rgba(143,183,226,0.06)',
                border: 'rgba(143,183,226,0.25)',
                sub: 'economic, environmental, and social benefits',
                detail: [
                  {
                    title: 'Government',
                    items: [
                      'Tourism industry vigorously develops',
                      'Increasing individual ocean literacy',
                      'Environmental benefits improve',
                    ],
                  },
                  {
                    title: 'Branding Partner',
                    items: ['Leading to enhanced brand equity and eventual profit growth'],
                  },
                ],
              },
              {
                key: 'science',
                label: 'Science Education',
                color: '#abbd81',
                bg: 'rgba(171,189,129,0.06)',
                border: 'rgba(171,189,129,0.3)',
                sub: 'environmental knowledge and practical applications',
                detail: [
                  {
                    title: 'Professional Training',
                    items: [
                      'Offering comprehensive training for specialists',
                      'Direct understanding of marine debris',
                    ],
                  },
                  {
                    title: 'Online Learning',
                    items: [
                      'Educating on waste disposal procedures',
                      'Sharing additional eco-friendly knowledge',
                    ],
                  },
                ],
              },
              {
                key: 'services',
                label: 'Services Provided',
                color: '#e8897a',
                bg: 'rgba(241,190,188,0.06)',
                border: 'rgba(241,190,188,0.35)',
                sub: 'product and after-sales support',
                detail: [
                  {
                    title: 'Product',
                    items: ['Recycling into usable products', 'New Fashion Trends'],
                  },
                  {
                    title: 'Application',
                    items: [
                      'Convenient and mobile with no barriers',
                      'Platform market and social sharing',
                    ],
                  },
                ],
              },
              {
                key: 'core',
                label: 'Core Process',
                color: '#34a894',
                bg: 'rgba(52,168,148,0.06)',
                border: 'rgba(52,168,148,0.25)',
                sub: 'marine waste recycling',
                detail: [
                  {
                    title: 'Collection',
                    items: [
                      'Classification and aggregation',
                      'Mainly sourced from fishermen and tourists',
                    ],
                  },
                  {
                    title: 'Procedure',
                    items: [
                      'Multi-party collaboration to establish a new production line',
                      'Green, efficient, cost-effective',
                    ],
                  },
                ],
              },
            ] as const).map(tab => {
              const isActive = stakeTab === tab.key
              return (
                <div key={tab.key}>
                  {/* Tab button */}
                  <button
                    type="button"
                    aria-expanded={isActive}
                    onClick={() => setStakeTab(prev => prev === tab.key ? 'all' : tab.key)}
                    style={{
                      width: '100%',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      font: 'inherit',
                      textAlign: 'left',
                      padding: '14px 16px',
                      borderRadius: isActive && tab.detail ? '10px 10px 0 0' : '10px',
                      border: `1.5px solid ${isActive ? tab.color : tab.border}`,
                      borderBottom: isActive && tab.detail ? 'none' : `1.5px solid ${isActive ? tab.color : tab.border}`,
                      background: isActive ? tab.bg : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = tab.color }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = tab.border }}
                  >
                    <div style={{ width: '20px', height: '3px', background: tab.color, borderRadius: '2px', flexShrink: 0 }} />
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: isActive ? tab.color : '#888',
                      flex: 1,
                      lineHeight: 1.3,
                    }}>
                      {tab.label}
                    </span>
                    <span style={{ fontSize: '16px', color: isActive ? tab.color : '#ccc', transition: 'all 0.2s', lineHeight: 1 }}>
                      {isActive ? '▾' : '▸'}
                    </span>
                  </button>

                  {/* Detail panel — only when active and tab has detail */}
                  {isActive && tab.detail && (
                    <div style={{
                      border: `1.5px solid ${tab.color}`,
                      borderTop: 'none',
                      borderRadius: '0 0 10px 10px',
                      background: tab.bg,
                      padding: '14px',
                      animation: 'waveIn 0.25s ease forwards',
                    }}>
                      {'sub' in tab && (
                        <div style={{ fontSize: '10px', color: tab.color, fontWeight: 600, marginBottom: '12px', fontStyle: 'italic' }}>
                          {tab.sub}
                        </div>
                      )}
                      {tab.detail.map((section, i) => (
                        <div key={i} style={{ marginBottom: i < tab.detail.length - 1 ? '14px' : 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: tab.color, marginBottom: '6px' }}>
                            {section.title}
                          </div>
                          {section.items.map((item, j) => (
                            <div key={j} style={{ display: 'flex', gap: '6px', marginBottom: '4px', alignItems: 'flex-start' }}>
                              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: tab.color, flexShrink: 0, marginTop: '5px' }} />
                              <span style={{ fontSize: '12px', color: '#555', lineHeight: 1.55 }}>{item}</span>
                            </div>
                          ))}
                          {i < tab.detail.length - 1 && (
                            <div style={{ height: '1px', background: `${tab.color}30`, margin: '10px 0' }} />
                          )}
                        </div>
                      ))}
                      <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: `1px solid ${tab.color}20`, fontSize: '10px', color: '#bbb', textAlign: 'center' }}>
                        Click again to collapse ↑
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            {stakeTab === 'all' && (
              <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '10px', background: '#f7f7f7', border: '1px solid #efefef' }}>
                <div style={{ fontSize: '11px', color: '#bbb', lineHeight: 1.7 }}>
                  👆 Click a category to highlight its relationships on the map. Click again to collapse.
                </div>
              </div>
            )}
          </div>

        </div>
      </section>



      <section id="ariel-chapter-7" ref={setSectionRef(7)} style={{ ...ARIEL_PAGE_SNAP, background: '#fff', display: 'flex', flexDirection: 'column', padding: '40px 80px 60px 80px', paddingBottom: '120px' }}>

      {!showLineDetail && (
        <div className="wave-in" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ marginBottom: '20px', flexShrink: 0 }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#579C87', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>07 / The Solution</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
              <h2 style={{ fontSize: 'var(--ariel-title)', fontWeight: 800, color: '#1a1a1a', margin: 0, fontStyle: 'italic' }}>Ariel</h2>
              <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.75, margin: 0 }}>serving as a facilitator within this system, acting as a bridge between enterprises and the community.</p>
            </div>
          </div>

          {/* Main: left pillars + right cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '32px', flex: 1, overflow: 'hidden', minHeight: 0 }}>

            {/* LEFT: 3 directions, no background, dashed dividers */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {[
                { n: '1', title: 'A New Trend Begins with the Beach', desc: 'Using beach products as an entry point to reshape public participation in cleanup.', color: '#579C87' },
                { n: '2', title: 'Entry-Level Environmentalism', desc: 'Lower the barrier for non-environmentalists to engage with ocean conservation.', color: '#78A998' },
                { n: '3', title: 'Edutainment Experience Upgrade', desc: 'Combine education and entertainment to create a meaningful and shareable experience.', color: '#579C87' },
              ].map((item, i) => (
                <div key={item.n} style={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: '18px',
                  borderTop: i === 0 ? '1px dashed #e8e8e8' : 'none',
                  borderBottom: '1px dashed #e8e8e8',
                  padding: '0 8px',
                }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '13px', fontWeight: 900, color: 'white' }}>{item.n}</span>
                  </div>
                  <div>
                    <div className="solution-principle-title" style={{ fontSize: '19px', fontWeight: 800, color: '#1a1a1a', marginBottom: '5px', lineHeight: 1.3 }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: '#888', lineHeight: 1.55 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: two cards stacked */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>

              {/* PUBLIC / Line 1 */}
              <div
                onClick={() => { setLineTab('tourist'); setShowLineDetail(true); }}
                style={{ flex: 1, background: 'rgba(242,168,168,0.07)', border: '1px solid rgba(242,168,168,0.25)', borderRadius: '16px', padding: '14px 28px', cursor: 'pointer', transition: 'all 0.25s', position: 'relative', display: 'flex', alignItems: 'center' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 16px 40px rgba(242,168,168,0.2)'; el.style.borderColor = 'rgba(242,168,168,0.5)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.borderColor = 'rgba(242,168,168,0.25)'; }}
              >
                <div style={{ position: 'absolute', top: '16px', right: '20px', fontSize: '11px', color: '#DFA6AA', fontWeight: 600, letterSpacing: '0.08em' }}>LINE 1 →</div>
                <div className="solution-line-identity" style={{ width: '260px', flexShrink: 0, borderRight: '1px solid rgba(242,168,168,0.2)', paddingRight: '28px', marginRight: '28px' }}>
                  <div className="solution-line-heading">
                    <img loading="lazy" decoding="async" className="solution-line-icon" src="/ariel/new-assets/tourist icon.svg" alt="" />
                    <div style={{ fontSize: '34px', fontWeight: 900, color: '#DFA6AA', lineHeight: 1 }}>PUBLIC</div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>collect litter on the beach</div>
                </div>
                <div className="solution-line-pair" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flex: 1 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', marginBottom: '5px' }}>Product</div>
                    <div style={{ fontSize: '12px', color: '#888', lineHeight: 1.6 }}>Flip-flops made from marine plastic waste</div>
                  </div>
                  <div style={{ fontSize: '22px', color: '#DFA6AA', fontWeight: 400, marginTop: '2px' }}>+</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', marginBottom: '5px' }}>APP</div>
                    <div style={{ fontSize: '12px', color: '#888', lineHeight: 1.6 }}>Tracking the journey of recycled ocean waste</div>
                  </div>
                </div>
              </div>

              {/* FISHERMEN / Line 2 */}
              <div
                onClick={() => { setLineTab('fisherman'); setShowLineDetail(true); }}
                style={{ flex: 1, background: 'rgba(76,175,140,0.07)', border: '1px solid rgba(76,175,140,0.25)', borderRadius: '16px', padding: '14px 28px', cursor: 'pointer', transition: 'all 0.25s', position: 'relative', display: 'flex', alignItems: 'center' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 16px 40px rgba(76,175,140,0.18)'; el.style.borderColor = 'rgba(76,175,140,0.5)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.borderColor = 'rgba(76,175,140,0.25)'; }}
              >
                <div style={{ position: 'absolute', top: '16px', right: '20px', fontSize: '11px', color: '#579C87', fontWeight: 600, letterSpacing: '0.08em' }}>LINE 2 →</div>
                <div className="solution-line-identity" style={{ width: '260px', flexShrink: 0, borderRight: '1px solid rgba(76,175,140,0.2)', paddingRight: '28px', marginRight: '28px' }}>
                  <div className="solution-line-heading">
                    <img loading="lazy" decoding="async" className="solution-line-icon" src="/ariel/new-assets/fishermen icon.svg" alt="" />
                    <div style={{ fontSize: '34px', fontWeight: 900, color: '#579C87', lineHeight: 1 }}>FISHERMEN</div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>Economic compensation and rewards</div>
                </div>
                <div className="solution-line-pair" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flex: 1 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', marginBottom: '5px' }}>Debris</div>
                    <div style={{ fontSize: '12px', color: '#888', lineHeight: 1.6 }}>fish for marine floating debris</div>
                  </div>
                  <div style={{ fontSize: '22px', color: '#579C87', fontWeight: 400, marginTop: '2px' }}>+</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', marginBottom: '5px' }}>Waste</div>
                    <div style={{ fontSize: '12px', color: '#888', lineHeight: 1.6 }}>recycle discarded fishing gear</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: 4 value pillars */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', marginTop: '16px', flexShrink: 0, borderRadius: '14px', overflow: 'hidden' }}>
            {[
              { tag: '# Sustainable fashion', desc: 'Sustainability should become synonymous with trendy fashion and a responsible lifestyle.', img: '/ariel/beach-clean.png' },
              { tag: '# Tourism Support', desc: 'Focusing on beaches and attracting specific groups of tourists can aid in the development of beach tourism.', img: '/ariel/wind.png' },
              { tag: '# Localization', desc: 'Utilize local beach-collected plastic and processing operations, encourage local product handling and industries.', img: '/optimized/ariel-park.webp' },
              { tag: '# Traceable Information', desc: 'Make the recycling process transparent for recyclers, enhancing their sense of participation and educational value.', img: '/ariel/rubbish.png' },
            ].map((item, i) => (
              <div key={i} style={{ position: 'relative', padding: '20px 22px', overflow: 'hidden', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.15)' : 'none', minHeight: '100px' }}>
                <img loading="lazy" decoding="async" src={item.img} alt={item.tag} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.4) brightness(0.55)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'white', marginBottom: '8px', lineHeight: 1.3 }}>{item.tag}</div>
                  <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.65 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* ══════════════════════════════════════════
        LINE DETAIL SHARED WRAPPER
      ══════════════════════════════════════════ */}
      {showLineDetail && (
        <div className="sub-slide-right wave-in" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Top nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button onClick={() => setShowLineDetail(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#335e51', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', color: 'white', fontWeight: 600, cursor: 'pointer' }}
              >← Back</button>
              <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#579C87', textTransform: 'uppercase', fontWeight: 600, margin: 0 }}>Ariel · Service Lines</p>
            </div>
            <div style={{ display: 'flex', gap: '4px', background: '#f5f5f5', borderRadius: '12px', padding: '4px' }}>
              {(['tourist', 'fisherman'] as const).map((tab, i) => (
                <button key={tab} onClick={() => setLineTab(tab)}
                  style={{ padding: '8px 20px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
                    background: lineTab === tab ? 'white' : 'transparent',
                    color: lineTab === tab ? '#1a1a1a' : '#999',
                    boxShadow: lineTab === tab ? '0 2px 8px rgba(0,0,0,0.08)' : 'none' }}
                >{i === 0 ? 'Line 1 · Tourist' : 'Line 2 · Fisherman'}</button>
              ))}
            </div>
          </div>


          {/* ══════════ LINE 1: TOURIST ══════════ */}
          {lineTab === 'tourist' && (
            <div className="wave-in" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: '12px', paddingTop: '12px' }}>

              <div style={{ flexShrink: 0, marginBottom: '4px' }}>
                <h3 style={{ fontSize: 'var(--ariel-subtitle)', fontWeight: 600, color: '#1a1a1a', margin: '0 0 2px' }}>Line 1 — Tourist</h3>
                <p style={{ fontSize: '15px', color: '#888', margin: 0 }}>Intervene from a business perspective — using popular beach products as an entry point to encourage tourists to actively participate in beach cleaning.</p>
              </div>

              {/* Main 2-col: center flow | right analysis */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '20px', flex: 1, overflow: 'hidden' }}>

                {/* CENTER: flow rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', overflow: 'hidden' }}>

                  {/* ROW 1: 6-col pink */}
                  <div style={{ position: 'relative', flexShrink: 0, paddingTop: '16px', marginBottom: '10px' }}>
                  <div style={{ position: 'absolute', top: '20px', left: 'calc(100%/12)', right: 'calc(100%/12)', height: '1.5px', background: 'rgba(242,168,168,0.5)' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', position: 'relative', zIndex: 1 }}>
                      {[
                        { step: 'PROMOTION', note: 'Niche platforms fail to reach non-environmentalists' },
                        { step: 'INTEREST', note: 'Introduction and activities lack appeal' },
                        { step: 'CONFIRMATION', note: 'Formal registration feels restrictive, lacking flexibility' },
                        { step: 'PARTICIPATION', note: 'Activity areas and attire quite limited' },
                        { step: 'FEEDBACK', note: "Group photos don't enhance the experience" },
                        { step: 'SHARING', note: 'Personal sharing lacks content, limited influence' },
                      ].map((s, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#DFA6AA', border: '2px solid white', boxShadow: '0 0 0 1.5px rgba(242,168,168,0.5)', flexShrink: 0, position: 'relative', zIndex: 2 }} />
                          <div style={{ width: '100%', background: 'rgba(242,168,168,0.1)', border: '1px solid rgba(242,168,168,0.3)', borderRadius: '7px', padding: '7px 6px', textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', fontWeight: 800, color: '#c47a7a' }}>{s.step}</div>
                          </div>
                          <div style={{ fontSize: '11px', color: '#aaa', lineHeight: 1.5, textAlign: 'center' }}>{s.note}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CONNECTOR ARROWS — CSS div, same 6-col grid */}
                  <div style={{ position: 'relative', height: '60px', flexShrink: 0, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>

                    {/* Col 1+2: bracket from PROMOTION + INTEREST → single arrow down to green INTEREST */}
                    <div style={{ gridColumn: '1 / 3', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '25%', top: 0, width: '1.5px', height: '20px', background: 'rgba(242,168,168,0.55)' }} />
                      <div style={{ position: 'absolute', right: '25%', top: 0, width: '1.5px', height: '20px', background: 'rgba(242,168,168,0.55)' }} />
                      <div style={{ position: 'absolute', left: '25%', right: '25%', top: '20px', height: '1.5px', background: 'rgba(242,168,168,0.55)' }} />
                      <div style={{ position: 'absolute', left: '50%', top: '20px', width: '1.5px', height: '20px', background: 'rgba(242,168,168,0.55)', transform: 'translateX(-50%)' }} />
                      <div style={{ position: 'absolute', left: '50%', top: '40px', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '7px solid rgba(242,168,168,0.65)' }} />
                    </div>

                    {/* Col 3: CONFIRMATION → DEREGISTER */}
                    <div style={{ gridColumn: '3', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '50%', top: 0, width: '1.5px', height: '40px', background: 'rgba(242,168,168,0.5)', transform: 'translateX(-50%)' }} />
                      <div style={{ position: 'absolute', left: '50%', top: '40px', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '7px solid rgba(242,168,168,0.6)' }} />
                    </div>

                    {/* Col 4: PARTICIPATION → PARTICIPATION */}
                    <div style={{ gridColumn: '4', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '50%', top: 0, width: '1.5px', height: '40px', background: 'rgba(242,168,168,0.55)', transform: 'translateX(-50%)' }} />
                      <div style={{ position: 'absolute', left: '50%', top: '40px', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '7px solid rgba(242,168,168,0.65)' }} />
                    </div>

                    {/* Col 5: FEEDBACK → FEEDBACK */}
                    <div style={{ gridColumn: '5', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '50%', top: 0, width: '1.5px', height: '40px', background: 'rgba(242,168,168,0.55)', transform: 'translateX(-50%)' }} />
                      <div style={{ position: 'absolute', left: '50%', top: '40px', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '7px solid rgba(242,168,168,0.65)' }} />
                    </div>

                    {/* Col 6: SHARING → TRACKING */}
                    <div style={{ gridColumn: '6', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '50%', top: 0, width: '1.5px', height: '40px', background: 'rgba(242,168,168,0.5)', transform: 'translateX(-50%)' }} />
                      <div style={{ position: 'absolute', left: '50%', top: '40px', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '7px solid rgba(242,168,168,0.6)' }} />
                    </div>
                  </div>

                  {/* ROW 2: 12-col green, aligned to row1 */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: '5px', left: 'calc(90% / 12 * 2.2)', right: 'calc(100%/12)', height: '1.5px', background: 'rgba(76,175,140,0.5)' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '3px', position: 'relative', zIndex: 1, marginBottom: '5px' }}>

                      {/* col1: spacer */}
                      <div style={{ gridColumn: '1' }} />

                      {/* INTEREST: col 2-3 */}
                      <div style={{ gridColumn: '2 / 4', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#579C87', border: '2px solid white', boxShadow: '0 0 0 1.5px rgba(76,175,140,0.5)', flexShrink: 0 }} />
                        <div style={{ width: '100%', background: 'rgba(76,175,140,0.1)', border: '1px solid rgba(76,175,140,0.35)', borderRadius: '7px', padding: '7px 6px', textAlign: 'center' }}>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: '#2d8a6a' }}>INTEREST</div>
                        </div>
                        <div style={{ fontSize: '11px', color: '#888', lineHeight: 1.5, textAlign: 'center' }}>Physical products / offline facilities / brand co-promotion</div>
                      </div>

                      {/* col4: spacer */}
                      <div style={{ gridColumn: '4' }} />

                      {/* DEREGISTER: col 5-6 — X marker */}
                      <div style={{ gridColumn: '5 / 7', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
                          <line x1="2" y1="2" x2="12" y2="12" stroke="rgba(242,168,168,0.7)" strokeWidth="2" strokeLinecap="round" />
                          <line x1="12" y1="2" x2="2" y2="12" stroke="rgba(242,168,168,0.7)" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <div style={{ width: '100%', background: 'rgba(0,0,0,0.03)', border: '1px solid #e0e0e0', borderRadius: '7px', padding: '7px 6px', textAlign: 'center' }}>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: '#ccc' }}>DEREGISTER</div>
                        </div>
                        <div style={{ fontSize: '11px', color: '#bbb', lineHeight: 1.5, textAlign: 'center' }}>Reduce activity learning and participation costs</div>
                      </div>

                      {/* PARTICIPATION: col 7-8 */}
                      <div style={{ gridColumn: '7 / 9', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#579C87', border: '2px solid white', boxShadow: '0 0 0 1.5px rgba(76,175,140,0.5)', flexShrink: 0 }} />
                        <div style={{ width: '100%', background: 'rgba(76,175,140,0.1)', border: '1px solid rgba(76,175,140,0.35)', borderRadius: '7px', padding: '7px 6px', textAlign: 'center' }}>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: '#2d8a6a' }}>PARTICIPATION</div>
                        </div>
                        <div style={{ fontSize: '11px', color: '#888', lineHeight: 1.5, textAlign: 'center' }}>Accessible trash bins + novel obtainable beach products</div>
                      </div>

                      {/* FEEDBACK: col 9-10 */}
                      <div style={{ gridColumn: '9 / 11', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#579C87', border: '2px solid white', boxShadow: '0 0 0 1.5px rgba(76,175,140,0.5)', flexShrink: 0 }} />
                        <div style={{ width: '100%', background: 'rgba(76,175,140,0.1)', border: '1px solid rgba(76,175,140,0.35)', borderRadius: '7px', padding: '7px 6px', textAlign: 'center' }}>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: '#2d8a6a' }}>FEEDBACK</div>
                        </div>
                        <div style={{ fontSize: '11px', color: '#888', lineHeight: 1.5, textAlign: 'center' }}>Redeem for beach items + visualize each collection</div>
                      </div>

                      {/* TRACKING: col 11-12 */}
                      <div style={{ gridColumn: '11 / 13', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#579C87', border: '2px solid white', boxShadow: '0 0 0 1.5px rgba(76,175,140,0.5)', flexShrink: 0 }} />
                        <div style={{ width: '100%', background: 'rgba(76,175,140,0.1)', border: '1px solid rgba(76,175,140,0.35)', borderRadius: '7px', padding: '7px 6px', textAlign: 'center' }}>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: '#2d8a6a' }}>TRACKING</div>
                        </div>
                        <div style={{ fontSize: '11px', color: '#888', lineHeight: 1.5, textAlign: 'center' }}>Real-time tracking → full product journey</div>
                      </div>
                    </div>
                  </div>

                  {/* INCENTIVES ARROW: below green axis — CSS div */}
                  <div style={{ position: 'relative', height: '40px', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', inset: 0 }}>
                      {/* Down from FEEDBACK (col9-10 center ≈ 79% of green axis width, but green axis = full width so ~79%) */}
                      <div style={{ position: 'absolute', left: '75%', top: 0, width: '1.5px', height: '32px', background: 'rgba(76,175,140,0.5)' }} />
                      {/* Horizontal bottom from INTEREST(~20%) to FEEDBACK(~79%) */}
                      <div style={{ position: 'absolute', left: '16.5%', top: '32px', right: '24.9%', height: '1.5px', background: 'rgba(76,175,140,0.5)' }} />
                      {/* Up leg at INTEREST (~20%) */}
                      <div style={{ position: 'absolute', left: '16.5%', top: '6px', width: '1.5px', height: '26px', background: 'rgba(76,175,140,0.5)' }} />
                      {/* Upward arrowhead */}
                      <div style={{ position: 'absolute', left: 'calc(16.5% - 4.5px)', top: '1px', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '7px solid rgba(76,175,140,0.5)' }} />
                      {/* Label */}
                      <div style={{ position: 'absolute', left: '45%', top: '12px', transform: 'translateX(-50%)', fontSize: '13px', color: 'rgba(76,175,140,0.5)', fontWeight: 600, whiteSpace: 'nowrap' }}>incentives of tangible items</div>
                    </div>
                  </div>

                  {/* Bottom 4 elements → Story Board — Tourist Journey */}
                  <div className="tourist-storyboard" style={{ flexShrink: 0, marginTop: 'auto' }}>
                    <div className="storyboard-frame" style={{ border: '1.5px dashed rgba(242,168,168,0.5)', borderRadius: '12px', padding: '12px 14px' }}>
                      <div className="storyboard-rows" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {/* Row 1: title + steps 1-5 */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
                          {/* Title card */}
                          <div className="storyboard-title-card" style={{ borderRadius: '6px', background: 'rgba(242,168,168,0.1)', border: '1px solid rgba(242,168,168,0.3)', padding: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '90px' }}>
                            <div style={{ fontSize: '16px', fontWeight: 900, color: '#DFA6AA', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.3 }}>Story Board</div>
                            <div style={{ fontSize: '14px', color: '#c47a7a', marginTop: '4px', lineHeight: 1.4 }}>Tourist Journey</div>
                          </div>
                          {/* Steps 1-5 */}
                          {[
                            { img: '/ariel/st1.png', label: 'Arrive at beach' },
                            { img: '/ariel/st2.png', label: 'Scan code' },
                            { img: '/ariel/st3.png', label: 'Get sandals' },
                            { img: '/ariel/st4.png', label: 'Take bag' },
                            { img: '/ariel/st5.png', label: 'Clean litter' },
                          ].map((item, i) => (
                            <div className="storyboard-card" key={`tour-sb-r1-${i}`} style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', height: '90px', display: 'flex', flexDirection: 'column' }}>
                              <div style={{ position: 'absolute', top: '5px', left: '5px', zIndex: 2, width: '18px', height: '18px', borderRadius: '50%', background: '#DFA6AA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '9px', fontWeight: 900, color: 'white' }}>{i + 1}</span>
                              </div>
                              <img loading="lazy" decoding="async" src={item.img} alt={item.label} style={{ width: '100%', flex: 1, objectFit: 'cover', display: 'block' }} />
                              <div style={{ padding: '3px 5px', background: '#fafafa', fontSize: '9px', color: '#888', lineHeight: 1.3, flexShrink: 0 }}>{item.label}</div>
                            </div>
                          ))}
                        </div>
                        {/* Row 2: steps 6-11 */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
                          {[
                            { img: '/ariel/st6.png', label: 'Collection done' },
                            { img: '/ariel/st7.png', label: 'Sort garbage' },
                            { img: '/ariel/st8.png', label: 'Level up' },
                            { img: '/ariel/st9.png', label: 'Leave beach' },
                            { img: '/ariel/st10.png', label: 'Track recycling' },
                            { img: '/ariel/st11.png', label: 'Offline store' },
                          ].map((item, i) => (
                            <div className="storyboard-card" key={`tour-sb-r2-${i}`} style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', height: '90px', display: 'flex', flexDirection: 'column' }}>
                              <div style={{ position: 'absolute', top: '5px', left: '5px', zIndex: 2, width: '18px', height: '18px', borderRadius: '50%', background: '#DFA6AA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '9px', fontWeight: 900, color: 'white' }}>{i + 6}</span>
                              </div>
                              <img loading="lazy" decoding="async" src={item.img} alt={item.label} style={{ width: '100%', flex: 1, objectFit: 'cover', display: 'block' }} />
                              <div style={{ padding: '3px 5px', background: '#fafafa', fontSize: '9px', color: '#888', lineHeight: 1.3, flexShrink: 0 }}>{item.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Problem + Opportunity */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
                  <div style={{ background: 'rgba(242,168,168,0.06)', border: '1px solid rgba(242,168,168,0.18)', borderRadius: '12px', padding: '14px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#c47a7a', marginBottom: '10px' }}>Current Problem</div>
                    <p style={{ fontSize: '11px', color: '#777', lineHeight: 1.75, marginBottom: '10px' }}>Mostly volunteer-based, less accessible to non-environmentalists. Issues arise:</p>
                    {['High level of specialization', 'Limited audience (environmentally focused)', 'Many restrictions and rules'].map((pt, i) => (
                      <div key={i} style={{ display: 'flex', gap: '7px', marginBottom: '7px', fontSize: '11px', color: '#555', lineHeight: 1.5 }}>
                        <span style={{ color: '#DFA6AA', flexShrink: 0, marginTop: '3px', fontSize: '7px' }}>●</span>
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'rgba(76,175,140,0.06)', border: '1px solid rgba(76,175,140,0.18)', borderRadius: '12px', padding: '14px', flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#3a8a6a', marginBottom: '10px' }}>Opportunity for change</div>
                    <p style={{ fontSize: '11px', color: '#777', lineHeight: 1.75, marginBottom: '10px' }}>Repurposing beach trash into products as rewards, making process fun and commercialized:</p>
                    {[{ label: 'low entry barrier', color: '#579C87' }, { label: 'anytime, anywhere', color: '#579C87' }, { label: 'strong incentives', color: '#579C87' }, { label: 'broadened audience', color: '#DFA6AA' }].map((pt, i) => (
                      <div key={i} style={{ display: 'flex', gap: '7px', marginBottom: '7px', fontSize: '11px', lineHeight: 1.5 }}>
                        <span style={{ color: pt.color, flexShrink: 0, marginTop: '3px', fontSize: '7px' }}>●</span>
                        <span style={{ color: '#555' }}>{pt.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}


{/* ══════════ LINE 2: FISHERMAN ══════════ */}
{lineTab === 'fisherman' && (
            <div className="wave-in" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'visible', gap: '14px' }}>

              <div style={{ flexShrink: 0 }}>
                <h3 style={{ fontSize: 'var(--ariel-subtitle)', fontWeight: 600, color: '#1a1a1a', margin: '0 0 4px' }}>Line 2 — Fisherman</h3>
                <p style={{ fontSize: '15px', color: '#888', margin: 0 }}>Fishermen, the group most directly involved with marine debris, play a crucial role. The goal is to encourage them to actively collect garbage.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 190px', gap: '20px', flex: 1, overflow: 'hidden' }}>

                {/* CENTER: full horizontal flow */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'visible' }}>

                  <div style={{ fontSize: '9px', fontWeight: 600, color: '#bbb', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Ariel service flow</div>

                  {/* ═══ MAIN FLOW — 5-column CSS grid ═══
                      Columns: [PROMOTION] [arr] [TRAINING] [arr+fork+sep] [FishSeason/ClosedSeason] [arr] [SUBMIT/GUIDANCE] [arr+merge] [REWARDS]
                      Simplified as grid: 1fr 24px 1fr 32px 1fr 24px 1fr 24px 1fr
                      Row A (top):    .    .    .    .   FishSeason  →   SUBMIT    .    .
                      Row B (mid):  PROM  →  TRAIN  fork·sep·line·merge  →  REWARDS
                      Row C (bot):    .    .    .    .  ClosedSeason →  GUIDANCE   .    .
                  */}
                  {(() => {
                    const H = 108; // fixed height for ALL card boxes
                    /** 横平竖直细箭头（与 Line 1 Tourist 连接器风格一致） */
                    const ArrowH = (color: string) => (
                      <div style={{ position: 'relative', width: 22, height: 11, flexShrink: 0 }} aria-hidden>
                        <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 14, height: '1.5px', background: color }} />
                        <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: `5px solid ${color}` }} />
                      </div>
                    );
                    // grid: col1=PROM, col2=arr, col3=TRAIN, col4=fork/sep/line/merge zone, col5=season, col6=arr, col7=submit/guidance, col8=arr+merge, col9=REWARDS

                    const cols = '1fr 20px 1fr 60px 1fr 20px 1fr 60px 1fr';

                    return (
                      <>
                      <div style={{ position: 'relative' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: cols, gridTemplateRows: `${H}px ${H}px ${H}px`, rowGap: '8px', alignItems: 'stretch' }}>

                          {/* ── ROW A: Fishing Season + SUBMIT ── */}
                          <div style={{ gridColumn: '1 / 5', gridRow: '1' }} />
                          {/* Fishing Season */}
                          <div style={{ gridColumn: '5', gridRow: '1', boxSizing: 'border-box', background: 'rgba(76,175,140,0.07)', border: '1px solid rgba(76,175,140,0.28)', borderRadius: '8px', padding: '8px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '1px' }}>
                              <div style={{ fontSize: '10px', fontWeight: 800, color: '#579C87' }}>Fishing Season</div>
                            </div>
                            <p style={{ fontSize: '9px', color: '#666', lineHeight: 1.75, margin: '0 0 3px' }}>Marine debris — foam, bottles, gear. Nowhere to dispose.</p>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {['Efficiency drop', 'No disposal', 'Low recycling'].map((pt, i) => (
                                <div key={i} style={{ display: 'flex', gap: '3px', fontSize: '9px', color: '#999' }}>
                                  <span style={{ color: '#DFA6AA', fontSize: '6px', marginTop: '2px' }}>●</span><span>{pt}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* col6 row1: arrow Season→Submit */}
                          <div style={{ gridColumn: '6', gridRow: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {ArrowH('rgba(76,175,140,0.5)')}
                          </div>
                          {/* SUBMIT */}
                          <div style={{ gridColumn: '7', gridRow: '1', boxSizing: 'border-box', background: 'rgba(76,175,140,0.11)', border: '1px solid rgba(76,175,140,0.38)', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: '#579C87', letterSpacing: '0.04em' }}>SUBMIT</div>
                            <div style={{ fontSize: '9px', color: '#777', marginTop: '3px', lineHeight: 1.4 }}>Collect debris. Contact designated personnel</div>
                          </div>
                          {/* col8-9 row1: empty */}
                          <div style={{ gridColumn: '8 / 10', gridRow: '1' }} />

                          {/* ── ROW B: main line ── */}
                          {/* PROMOTION */}
                          <div style={{ gridColumn: '1', gridRow: '2', boxSizing: 'border-box', background: 'rgba(76,175,140,0.1)', border: '1px solid rgba(76,175,140,0.3)', borderRadius: '7px', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: '#579C87', letterSpacing: '0.04em' }}>PROMOTION</div>
                            <div style={{ fontSize: '9px', color: '#888', marginTop: '2px', lineHeight: 1.4 }}>Policy + business collaboration via village officials</div>
                          </div>
                          <div style={{ gridColumn: '2', gridRow: '2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {ArrowH('rgba(76,175,140,0.4)')}
                          </div>
                          {/* TRAINING */}
                          <div style={{ gridColumn: '3', gridRow: '2', boxSizing: 'border-box', background: 'rgba(76,175,140,0.1)', border: '1px solid rgba(76,175,140,0.3)', borderRadius: '7px', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: '#579C87', letterSpacing: '0.04em' }}>TRAINING</div>
                            <div style={{ fontSize: '9px', color: '#888', marginTop: '2px', lineHeight: 1.4 }}>Fishing gear use + waste sorting guidance</div>
                          </div>
                          {/* col4: fork label zone */}
                          <div style={{ gridColumn: '4', gridRow: '2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="season-axis-label" style={{ fontSize: '6.5px', fontWeight: 600, color: '#bbb', letterSpacing: '0.08em', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>BY SEASON</div>
                          </div>
                          <div style={{ gridColumn: '5 / 8', gridRow: '2' }} />

                          {/* REWARDS */}
                          <div style={{ gridColumn: '9', gridRow: '2', boxSizing: 'border-box', background: 'rgba(249,199,79,0.1)', border: '1px solid rgba(249,199,79,0.4)', borderRadius: '7px', padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                            <svg width="18" height="18" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
                              <circle cx="16" cy="16" r="12" fill="rgba(249,199,79,0.15)" stroke="rgba(249,199,79,0.5)" strokeWidth="1.5"/>
                              <polygon points="16,6 18.5,12.5 25,12.5 20,16.5 22,23 16,19 10,23 12,16.5 7,12.5 13.5,12.5" fill="rgba(249,199,79,0.5)" stroke="rgba(249,199,79,0.7)" strokeWidth="0.5"/>
                            </svg>
                            <div>
                              <div style={{ fontSize: '10px', fontWeight: 800, color: '#d4a017', letterSpacing: '0.04em' }}>REWARDS</div>
                              <div style={{ fontSize: '9px', color: '#888', marginTop: '2px', lineHeight: 1.35 }}>Tax reductions · Lower loan interest · Direct subsidies</div>
                            </div>
                          </div>

                          {/* ── ROW C: Closed Season + GUIDANCE ── */}
                          <div style={{ gridColumn: '1 / 5', gridRow: '3' }} />
                          {/* Closed Season */}
                          <div style={{ gridColumn: '5', gridRow: '3', boxSizing: 'border-box', background: 'rgba(120,169,152,0.07)', border: '1px solid rgba(120,169,152,0.28)', borderRadius: '8px', padding: '8px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                              <div style={{ fontSize: '10px', fontWeight: 800, color: '#78A998' }}>Fishing Closed Season</div>
                            </div>
                            <p style={{ fontSize: '9px', color: '#666', lineHeight: 1.75, margin: '0 0 3px' }}>Boat maintenance or part-time work. Unstable income.</p>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {['Unstable income', 'Idle capacity', 'No alternative'].map((pt, i) => (
                                <div key={i} style={{ display: 'flex', gap: '3px', fontSize: '9px', color: '#999' }}>
                                  <span style={{ color: '#78A998', fontSize: '6px', marginTop: '2px' }}>●</span><span>{pt}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* col6 row3: arrow Season→Guidance */}
                          <div style={{ gridColumn: '6', gridRow: '3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {ArrowH('rgba(120,169,152,0.5)')}
                          </div>
                          {/* GUIDANCE */}
                          <div style={{ gridColumn: '7', gridRow: '3', boxSizing: 'border-box', background: 'rgba(120,169,152,0.11)', border: '1px solid rgba(120,169,152,0.38)', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: '#78A998', letterSpacing: '0.04em' }}>GUIDANCE</div>
                            <div style={{ fontSize: '9px', color: '#777', marginTop: '3px', lineHeight: 1.4 }}>Beach waste inspectors assist visitors in sorting trash</div>
                          </div>
                          {/* col8-9 row3: empty */}
                          <div style={{ gridColumn: '8 / 10', gridRow: '3' }} />

                        </div>

                        {/* 分叉 / 汇合：与 Tourist 相同 1.5px div，避免 SVG viewBox 把线拉粗 */}
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
                          {/* TRAINING fork: horizontal right then T-branch to row A and row C */}
                          {/* Horizontal stub from TRAINING right edge to the vertical stem */}
                          <div style={{ position: 'absolute', left: '36%', top: '49.5%', width: '2.5%', height: '1.5px', background: 'rgba(76,175,140,0.55)' }} />
                          {/* Vertical stem connecting row A and row C */}
                          <div style={{ position: 'absolute', left: '38.5%', top: '16.5%', width: '1.5px', height: '66%', background: 'rgba(76,175,140,0.4)' }} />
                          {/* Horizontal branch to row A (Fishing Season) */}
                          <div style={{ position: 'absolute', left: '38.5%', top: '16.5%', width: '2.5%', height: '1.5px', background: 'rgba(76,175,140,0.55)' }} />
                          <div style={{ position: 'absolute', left: 'calc(41% - 1px)', top: 'calc(16.5% - 4px)', width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '6px solid rgba(76,175,140,0.55)' }} />
                          {/* Horizontal branch to row C (Closed Season) */}
                          <div style={{ position: 'absolute', left: '38.5%', top: '82.5%', width: '2.5%', height: '1.5px', background: 'rgba(120,169,152,0.55)' }} />
                          <div style={{ position: 'absolute', left: 'calc(41% - 1px)', top: 'calc(82.5% - 4px)', width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '6px solid rgba(120,169,152,0.55)' }} />

                          {/* SUBMIT / GUIDANCE → 竖井 → REWARDS */}
                          <div style={{ position: 'absolute', left: '80%', top: '16.5%', width: '1.5px', height: '66.5%', background: 'rgba(120,120,120,0.32)' }} />
                          <div style={{ position: 'absolute', left: '77.5%', top: '16.25%', width: '2.5%', height: '1.5px', background: 'rgba(76,175,140,0.55)' }} />
                          <div style={{ position: 'absolute', left: '77.5%', top: '82.25%', width: '2.5%', height: '1.5px', background: 'rgba(120,169,152,0.55)' }} />
                          <div style={{ position: 'absolute', left: '80%', top: '49.25%', width: '2.5%', height: '1.5px', background: 'rgba(76,175,140,0.45)' }} />
                          <div style={{ position: 'absolute', left: 'calc(82.4% - 1px)', top: '48.5%', width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '6px solid rgba(76,175,140,0.5)' }} />
                        </div>
                      </div>

                      {/* 与 Line 1 Tourist「INCENTIVES ARROW」同结构：细竖线 + 底横线 + 左上竖 + 空心三角箭头 */}
                      <div style={{ position: 'relative', height: '40px', flexShrink: 0 }}>
                        <div style={{ position: 'absolute', inset: 0 }}>
                          <div style={{ position: 'absolute', left: '90%', top: -90, width: '1.5px', height: '123px', background: 'rgba(76,175,140,0.5)' }} />
                          <div style={{ position: 'absolute', left: '9%', top: '32px', right: '10%', height: '1.5px', background: 'rgba(76,175,140,0.5)' }} />
                          <div style={{ position: 'absolute', left: '9%', top: -70, width: '1.5px', height: '102px', background: 'rgba(76,175,140,0.5)' }} />
                          <div style={{ position: 'absolute', left: 'calc(9% - 4.5px)', top: -71, width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '7px solid rgba(76,175,140,0.5)' }} />
                          <div style={{ position: 'absolute', left: '48%', top: '12px', transform: 'translateX(-50%)', fontSize: '14px', color: 'rgba(76,175,140,0.5)', fontWeight: 600, whiteSpace: 'nowrap' }}>genuine incentive loop</div>
                        </div>
                      </div>
                      </>
                    );
                  })()}


                  {/* ── BOTTOM: Fisherman storyboard (replaces 3 problem cards) ── */}
                  <div className="fisherman-storyboard" style={{ flexShrink: 0, marginTop: 'auto' }}>
                    <div className="storyboard-frame" style={{ border: '1.5px dashed rgba(76,175,140,0.4)', borderRadius: '12px', padding: '12px 14px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '6px' }}>

                        {/* Title card — same structure as Tourist */}
                        <div className="storyboard-title-card" style={{ borderRadius: '6px', background: 'rgba(76,175,140,0.08)', border: '1px solid rgba(76,175,140,0.25)', padding: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '90px' }}>
                          <div style={{ fontSize: '16px', fontWeight: 900, color: '#579C87', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.3 }}>Story Board</div>
                          <div style={{ fontSize: '14px', color: '#2d8a6a', marginTop: '4px', lineHeight: 1.4 }}>Fisherman Journey</div>
                        </div>

                        {/* Steps 1-4 */}
                        {[
                          { img: '/ariel/fisher-story-1.png', label: 'Recover debris during daily fishing' },
                          { img: '/ariel/fisher-story-2.png', label: 'Bring collected material ashore' },
                          { img: '/ariel/fisher-story-3.png', label: 'Transfer waste to Ariel staff' },
                          { img: '/ariel/fisher-story-4.png', label: 'Submit material and receive rewards' },
                        ].map((item, i) => (
                          <div className="storyboard-card" key={`fish-story-img-${i}`} style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', height: '90px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ position: 'absolute', top: '5px', left: '5px', zIndex: 2, width: '18px', height: '18px', borderRadius: '50%', background: '#579C87', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ fontSize: '9px', fontWeight: 900, color: 'white' }}>{i + 1}</span>
                            </div>
                            <img loading="lazy" decoding="async" src={item.img} alt={item.label} style={{ width: '100%', flex: 1, objectFit: 'cover', display: 'block' }} />
                            <div style={{ padding: '3px 5px', background: '#fafafa', fontSize: '9px', color: '#888', lineHeight: 1.3, flexShrink: 0 }}>{item.label}</div>
                          </div>
                        ))}

                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT: Collaboration panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', minHeight: 0 }}>
                  <div style={{ background: 'rgba(76,175,140,0.06)', border: '1px solid rgba(76,175,140,0.18)', borderRadius: '12px', padding: '16px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#3a8a6a', marginBottom: '10px' }}>Multi-party Collaboration</div>
                    <p style={{ fontSize: '11px', color: '#666', lineHeight: 1.75, marginBottom: '12px' }}>
                      The initiative requires <strong style={{ color: '#579C87' }}>collaboration</strong> from multiple parties — government and brands — offering tangible <strong style={{ color: '#579C87' }}>benefits to incentivize</strong> fishermen to genuinely contribute.
                    </p>
                    {[
                      { party: 'Government', role: 'Tax reductions, lower loan rates, direct subsidies' },
                      { party: 'Company (Ariel)', role: 'Promotion, training, waste submission system' },
                      { party: 'Fishermen', role: 'Active collection + debris sorting both seasons' },
                    ].map((item, i) => (
                      <div key={i} style={{ background: 'white', border: '1px solid rgba(76,175,140,0.15)', borderRadius: '8px', padding: '10px 12px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '7px', alignItems: 'center', marginBottom: '3px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 600, color: '#1a1a1a' }}>{item.party}</div>
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#888', lineHeight: 1.4 }}>{item.role}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}








        </div>
      )}
</section>

      {/* ── PRODUCTS & SERVICES ── */}
      <section id="ariel-chapter-8" className="ariel-products-chapter" ref={setSectionRef(8)} style={{ ...ARIEL_PAGE_SNAP, background: '#fff' }}>
        <header className="products-heading">
          <span className="ariel-section-kicker">08 / Products &amp; Services</span>
          <h2>Products and Services</h2>
          <p>Ariel bridges digital tools with on-the-ground touchpoints for a complete service loop.</p>
        </header>
        <div className="products-online">
          <div className="products-ui-stage">
            <img loading="lazy" decoding="async" className="products-ui-ghost" src="/ariel/app.png" alt="" />
            <img loading="lazy" decoding="async" className="products-ui-main" src="/ariel/new-assets/UI - overall.png" alt="Ariel digital platform overview" />
          </div>
          <div className="products-online-copy">
            <span>Online · Digital Platform</span>
            <h3>One journey, connected from map to community.</h3>
            <p>The platform supports route discovery, equipment orders, waste submission and community participation in one continuous service experience.</p>
          </div>
          <div className="products-ui-carousel">
            <div className="products-ui-carousel-media">
              <img loading="lazy" decoding="async"
                src={[
                  '/ariel/new-assets/UI - map.png',
                  '/ariel/new-assets/UI - order.png',
                  '/ariel/new-assets/UI - community.png',
                  '/ariel/new-assets/UI - finish throwing.png',
                ][activeUi]}
                alt={['Map and nearby stations','Equipment order flow','Community participation','Waste submission confirmation'][activeUi]}
              />
              <div className="products-ui-carousel-controls">
                <button type="button" aria-label="Previous interface" onClick={() => setActiveUi((activeUi + 3) % 4)}>←</button>
                <div>{[0,1,2,3].map(i => <button key={i} type="button" aria-label={`Show interface ${i + 1}`} aria-pressed={activeUi === i} onClick={() => setActiveUi(i)} />)}</div>
                <button type="button" aria-label="Next interface" onClick={() => setActiveUi((activeUi + 1) % 4)}>→</button>
              </div>
            </div>
            <div className="products-ui-carousel-copy">
              <span>Digital touchpoint · {String(activeUi + 1).padStart(2, '0')}</span>
              <h3>{['Map & nearby stations','Order cleaning equipment','Community participation','Finish throwing'][activeUi]}</h3>
              <p>{[
                'The map helps users locate nearby Ariel stations, coastal activities and the closest point for beginning a cleanup journey.',
                'Users reserve the cleaning tools and protective equipment they need before arriving at the beach.',
                'A shared community feed records participation, makes collective progress visible and encourages repeat involvement.',
                'The submission flow confirms the waste drop-off, records the recovered material and closes the service loop.'
              ][activeUi]}</p>
            </div>
          </div>
        </div>
        <div className="products-offline">
          <div className="products-offline-copy">
            <span>Offline · Physical Touchpoints</span>
            <h3>A complete station on the beach.</h3>
            <p>The full container combines guidance, equipment access, waste submission and product exchange in one visible coastal touchpoint.</p>
          </div>
          <div className="products-offline-stage">
            <img loading="lazy" decoding="async" className="products-offline-main" src="/ariel/station.png" alt="Full Ariel service container" />
            <img loading="lazy" decoding="async" className="products-offline-detail products-offline-sandals" src="/ariel/new-assets/拖鞋礼盒.png" alt="Ariel sandals and packaging" />
            <img loading="lazy" decoding="async" className="products-offline-detail products-offline-screen" src="/ariel/new-assets/offline-screen.png" alt="Ariel station screen" />
            <img loading="lazy" decoding="async" className="products-offline-detail products-offline-poster" src="/ariel/new-assets/offline poster.png" alt="Ariel offline poster" />
          </div>
        </div>
      </section>

      {/* ── FUTURE PLAN ── */}
      <section id="ariel-chapter-9" className="ariel-future-chapter" ref={setSectionRef(9)} style={{ ...ARIEL_PAGE_SNAP, background: '#fff', display: 'flex', flexDirection: 'column', padding: '40px 80px 48px 80px', paddingBottom: '120px', overflow: 'hidden' }}>
        <aside className="ariel-chapter-aside"><span className="ariel-section-kicker">09 / Future Plan</span><h2>Future Plan</h2><p>Sustainable Steps, Stylish Footprints</p><div className="ariel-view-list"><button type="button" aria-pressed={futurePlanView === 'cobranding'} onClick={() => setFuturePlanView('cobranding')}># Co-Branding</button><button type="button" aria-pressed={futurePlanView === 'coliving'} onClick={() => setFuturePlanView('coliving')}># Co-Living</button><button type="button" aria-pressed={futurePlanView === 'physicalsite'} onClick={() => setFuturePlanView('physicalsite')}># Physical Site</button></div></aside>
        <div className="ariel-future-content">

        {futurePlanView !== null && (
          <div className="sub-slide-right wave-in" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              
              <h3 style={{
                fontSize: 'var(--ariel-subtitle)',
                fontWeight: 600,
                fontStyle: 'italic',
                color: futurePlanView === 'cobranding' ? '#579C87' : futurePlanView === 'coliving' ? '#78A998' : '#DFA6AA',
                margin: 0,
              }}>
                {futurePlanView === 'cobranding' ? '# Co-Branding' : futurePlanView === 'coliving' ? '# Co-Living' : '# Physical Site'}
              </h3>
            </div>

            {futurePlanView === 'cobranding' && (
              <div className="wave-in" style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, overflow: 'hidden', position: 'relative' }}>
                {/* 左侧 */}
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, borderRight: '1px solid #e0e0e0', paddingRight: '28px', paddingBottom: '4px' }}>
                  <div style={{ position: 'relative', flex: 1, minHeight: 220, marginBottom: '16px' }}>
                    <img loading="lazy" decoding="async" className="cobranding-products" src="/ariel/new-assets/cobranding-products.png" alt="Co-branding product possibilities" style={{ position: 'absolute', inset: '4%', width: '92%', height: '88%', objectFit: 'contain' }} />
                    {[
                      { label: 'swim ring', left: '4%', top: '6%' },
                      { label: 'sunglass', right: '6%', top: '4%', flip: true },
                      { label: 'accessory', left: '2%', top: '42%', lineW: 40 },
                      { label: 'surfboard', right: '4%', top: '38%', flip: true },
                      { label: 'beach toy', left: '38%', bottom: '8%' },
                    ].map(ann => (
                      <div
                        key={ann.label}
                        style={{
                          position: 'absolute',
                          ...(ann.left != null ? { left: ann.left } : {}),
                          ...(ann.right != null ? { right: ann.right } : {}),
                          ...(ann.top != null ? { top: ann.top } : {}),
                          ...(ann.bottom != null ? { bottom: ann.bottom } : {}),
                          display: 'flex',
                          alignItems: 'center',
                          flexDirection: ann.flip ? 'row-reverse' : 'row',
                          gap: '6px',
                          zIndex: 10,
                        }}
                      >
                        <span style={{ fontSize: '11px', color: '#2d8a6a', fontWeight: 600, whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.85)', padding: '2px 6px', borderRadius: '4px' }}>{ann.label}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: '15px', color: '#888', lineHeight: 1.75, margin: 0, flexShrink: 0 }}>
                    Partner with lifestyle brands to co-develop beach products from recycled ocean waste — turning cleanup into desirable fashion.
                  </p>
                </div>

                {/* 中间 × 在竖线上 */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#fff',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  fontWeight: 300,
                  color: '#ccc',
                  zIndex: 5,
                  lineHeight: 1,
                }}>
                  ×
                </div>

                {/* 右侧 */}
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, paddingLeft: '28px', paddingBottom: '4px' }}>
                  <img loading="lazy" decoding="async" className="cobranding-brands" src="/ariel/new-assets/cobranding-brands.png" alt="Potential co-branding partners" style={{width:'100%',height:'70%',objectFit:'contain'}} />
                  <div className="legacy-brand-grid" style={{ display: 'none' }}>
                    {[
                      { name: 'Lacoste', icon: '🐊' },
                      { name: 'Nike', icon: '✓' },
                      { name: 'Apple', icon: '' },
                      { name: 'Timberland', icon: '🌲' },
                      { name: 'Yankees', icon: 'NY' },
                      { name: 'SB', icon: 'SB' },
                      { name: 'Olympics', icon: '◎' },
                      { name: 'Maharishi', icon: 'M' },
                      { name: 'Reebok', icon: '△' },
                      { name: 'Crocodile', icon: '🐊' },
                      { name: 'Puma', icon: '🐆' },
                      { name: 'Amiri', icon: 'A' },
                      { name: 'Audi', icon: '◎' },
                      { name: 'Adidas', icon: '|||' },
                      { name: 'YSL', icon: 'YSL' },
                      { name: null, icon: '○' },
                    ].map((brand, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', minHeight: 48 }}>
                        {brand.name ? (
                          <>
                            <span style={{ fontSize: '18px', lineHeight: 1, color: '#333' }} aria-hidden>{brand.icon}</span>
                            <span style={{ fontSize: '8px', fontWeight: 600, color: '#888', textAlign: 'center', lineHeight: 1.2, letterSpacing: '0.02em' }}>{brand.name}</span>
                          </>
                        ) : (
                          <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
                            <circle cx="14" cy="14" r="12" fill="none" stroke="#ccc" strokeWidth="1.5" strokeDasharray="3 3" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: '15px', color: '#888', lineHeight: 1.75, margin: '16px 0 0', flexShrink: 0 }}>
                    Ariel hopes that the trash people pick up on the beach can ultimately return to the beach to complete its second life
                  </p>
                </div>
              </div>
            )}

            {futurePlanView === 'coliving' && (
              <div className="wave-in" style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '32px', overflow: 'hidden' }}>
                <div className="coliving-collage" style={{ position: 'relative', borderRadius: '12px', overflow: 'visible', background: 'transparent', minHeight: 0 }}>
                  <img loading="lazy" decoding="async" src="/ariel/new-assets/co-living-map.png" alt="Ariel co-living network" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
                  <img loading="lazy" decoding="async" className="coliving-product" src="/ariel/new-assets/co-living product.png" alt="Regenerated co-living product" />
                  <img loading="lazy" decoding="async" className="coliving-workshop" src="/ariel/new-assets/co-living workshop.png" alt="Community workshop" />
                  {[
                    { label: 'Karatsu, Japan', left: '8%', top: '12%' },
                    { label: 'Precious Plastic', left: '48%', top: '3%' },
                    { label: 'Workshop - Event Site', left: '10%', bottom: '18%' },
                    { label: 'Regenerated Products', right: '5%', top: '31%' },
                  ].map(item => (
                    <span
                      key={item.label}
                      style={{
                        position: 'absolute',
                        ...(item.left != null ? { left: item.left } : {}),
                        ...(item.right != null ? { right: item.right } : {}),
                        ...(item.top != null ? { top: item.top } : {}),
                        ...(item.bottom != null ? { bottom: item.bottom } : {}),
                        fontSize: '10px',
                        fontWeight: 600,
                        color: '#78A998',
                        background: 'rgba(255,255,255,0.92)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid rgba(120,169,152,0.25)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
                <div className="coliving-copy" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '8px' }}>
                  <h4 style={{ fontSize: '20px', fontWeight: 900, color: '#1a1a1a', margin: '0 0 16px', lineHeight: 1.3 }}>Community Workshops & Co-Living</h4>
                  <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.75, margin: 0 }}>
                    Through co-living spaces and hands-on workshops, Ariel connects global visitors with local coastal communities — turning ocean plastic education into shared experiences that inspire long-term environmental action.
                  </p>
                </div>
              </div>
            )}

            {futurePlanView === 'physicalsite' && (
              <div className="wave-in physical-site-layout" style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px', overflow: 'hidden', alignItems: 'end' }}>
                <div className="physical-site-copy">
                  <h4 style={{ fontSize: '20px', fontWeight: 900, color: '#1a1a1a', margin: '0 0 16px', lineHeight: 1.3 }}>Expanding Beyond the Coast</h4>
                  <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.75, margin: 0 }}>
                    Physical stores and pop-up shops in urban centers bring Ariel&apos;s mission to non-coastal audiences — making sustainable beach culture visible, tangible, and accessible far from the shoreline.
                  </p>
                </div>
                <div className="physical-site-media" style={{ display: 'flex', flexDirection: 'column', gap: '4px', minHeight: 0, height: '100%' }}>
                  <img loading="lazy" decoding="async" src="/ariel/new-assets/physical site.png" alt="Ariel physical site concept" style={{ flex: 1, minHeight: 0, width: '100%', objectFit: 'contain', borderRadius: '16px', display: 'block' }} />
                  <p style={{ fontSize: '11px', color: '#aaa', margin: 0, textAlign: 'left' }}>Ariel physical site concept</p>
                </div>
              </div>
            )}
          </div>
        )}
              </div>
      </section>

      {/* ── THE END ── */}
      <section
        id="ariel-chapter-10"
        ref={setSectionRef(10)}
        style={{
          ...ARIEL_PAGE_SNAP,
          height: 'calc(100vh - 64px)',
          minHeight: 'calc(100vh - 64px)',
          maxHeight: 'calc(100vh - 64px)',
          marginTop: '64px',
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          <Image src="/ariel/hero2.png" alt="" fill className="object-cover object-center" />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,35,45,0.5) 0%, rgba(0,25,35,0.72) 45%, rgba(0,18,28,0.88) 100%)',
          }} />
          <div style={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '48px 48px',
          }}>
            <h2 style={{ fontSize: 'var(--ariel-title)', fontWeight: 800, color: '#fff', margin: '0 0 24px', lineHeight: 1.1 }}>
              The Ocean Doesn&apos;t Wait.
            </h2>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.92)', margin: '0 0 36px', maxWidth: 560, lineHeight: 1.75 }}>
              Every piece of plastic you pick up is a choice for the future.
            </p>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.65)', margin: '0 0 28px', letterSpacing: '0.04em' }}>
              Ariel · 2023–2024 · Xiangrui Zhou, Wenjia Shi, Yuqing Wu
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.4)',
                  borderRadius: '24px',
                  padding: '10px 28px',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  backdropFilter: 'blur(8px)',
                  transition: 'background 0.2s ease',
                }}
              >
                ← Back to Homepage
              </Link>
              <button
                type="button"
                onClick={() => {
                  const mainEl = document.querySelector('main')
                  if (mainEl) {
                    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.4)',
                  borderRadius: '24px',
                  padding: '10px 28px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  transition: 'background 0.2s ease',
                }}
              >
                ↑ Back to Top
              </button>
            </div>
          </div>
        </div>
      </section>

    </main></Localize>
  )
}
