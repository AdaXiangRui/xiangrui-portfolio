'use client'


import {Localize} from "@/components/site-language"
import { useRef, useEffect, type CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import CaseChapters from '../case-study/chapters'

const navItems = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/#contact' },
]

const AURA_PAGE_SNAP: CSSProperties = {
  scrollSnapAlign: 'start',
  scrollSnapStop: 'always',
  height: '100vh',
  minHeight: '100vh',
  maxHeight: '100vh',
  boxSizing: 'border-box',
  overflow: 'hidden',
}

const GLASS_CARD_STYLE: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(28px)',
  WebkitBackdropFilter: 'blur(28px)',
  border: '1px solid rgba(255, 255, 255, 0.28)',
  boxShadow: '0 8px 48px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
}

const END_BUTTON_STYLE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  background: 'rgba(255,255,255,0.15)',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.4)',
  borderRadius: '24px',
  padding: '10px 28px',
  fontSize: '13px',
  fontWeight: 700,
  backdropFilter: 'blur(8px)',
  transition: 'background 0.2s ease',
}

export default function AuraProjectPage() {
  const mainRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.load()
    video.play().catch(() => {})
  }, [])

  return (
    <Localize><main ref={mainRef} className="enriched-case aura-scroll-snap min-h-screen bg-black text-white" style={{ scrollSnapType: 'y mandatory' }}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(0,0,0,0.35)] backdrop-blur-[16px]">
        <nav className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-sm font-medium tracking-tight text-white hover:text-white/60 transition-colors">
              Xiangrui Zhou
            </Link>
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/70 hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <section style={{ ...AURA_PAGE_SNAP }}>
        <div className="relative w-full min-w-0 h-full overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/project-thumbs/aura.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            src="/aura/2.mp4"
          />
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.15)]" />

          <div className="absolute inset-0 px-6 md:px-[80px] pt-16 md:pt-0">
            <div className="md:absolute md:left-[80px] md:top-[13%]">
              <h1 className="text-[80px] md:text-[160px] font-black leading-none tracking-tight text-white">Aura</h1>
              <p className="mt-6 text-lg leading-snug text-white/85">
                <span className="block whitespace-nowrap">As driving automation reduces cognitive engagement, driver fatigue is a growing concern.</span>
                <span className="block mt-1 whitespace-nowrap">Aura counters it with surprise and adaptive music to re-engage the driver.</span>
              </p>
            </div>

            <div className="absolute right-4 md:right-[36px] top-0 w-full md:w-1/2 h-1/2 flex items-center justify-end px-6 md:px-0 pt-20 md:pt-16">
              <div
                className="w-full max-w-[500px] rounded-[24px] px-8 py-8 md:px-10 md:py-9"
                style={GLASS_CARD_STYLE}
              >
                <div className="text-sm lg:text-base leading-relaxed text-white/90 space-y-5">
                  <p><span className="font-semibold text-[#F5D547]">Area:</span>{' '}Interactive Design</p>
                  <p><span className="font-semibold text-[#F5D547]">Duration:</span>{' '}2024.03 – 2024.07</p>
                  <p className="whitespace-nowrap"><span className="font-semibold text-[#F5D547]">Team Members:</span>{' '}Xiangrui Zhou, Qiuquan Gu, Yutong Liu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CaseChapters project="aura" />

      <section
        style={{
          ...AURA_PAGE_SNAP,
          height: 'calc(100vh - 64px)',
          minHeight: 'calc(100vh - 64px)',
          maxHeight: 'calc(100vh - 64px)',
          marginTop: '64px',
        }}
      >
        <div className="relative w-full h-full overflow-hidden">
          <Image src="/aura/outro.jpg" alt="" fill className="object-cover object-center" />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(20,15,0,0.5) 0%, rgba(15,10,0,0.72) 45%, rgba(10,8,0,0.88) 100%)',
            }}
          />
          <div className="relative z-[1] h-full flex flex-col items-center justify-center text-center px-12">
            <h2 className="text-[clamp(40px,5vw,72px)] font-black text-white mb-6 leading-tight">
              Stay Awake. Stay Present.
            </h2>
            <p className="text-lg text-white/90 mb-9 max-w-[560px] leading-relaxed">
              Surprise and adaptive music re-engage the driver when automation fades into the background.
            </p>
            <p className="text-xs text-white/65 mb-7 tracking-wide">
              Aura · 2024 · Xiangrui Zhou, Qiuquan Gu, Yutong Liu
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/"
                style={{ ...END_BUTTON_STYLE, textDecoration: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
              >
                ← Back to Homepage
              </Link>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
                style={{ ...END_BUTTON_STYLE, cursor: 'pointer' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
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
