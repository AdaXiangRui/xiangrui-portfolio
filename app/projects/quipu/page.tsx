'use client'


import {Localize} from "@/components/site-language"
import Image from 'next/image'
import Link from 'next/link'
import CaseChapters from '../case-study/chapters'

const navItems = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/#contact' },
]

export default function QuipuProjectPage() {
  return (
    <Localize><main className="enriched-case quipu-scroll-snap min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(0,0,0,0.35)] backdrop-blur-[16px]">
        <nav className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-sm font-medium tracking-tight text-white hover:text-white/60 transition-colors">Xiangrui Zhou</Link>
            <ul className="flex items-center gap-8">
              {navItems.map((item) => <li key={item.href}><Link href={item.href} className="text-sm text-white/70 hover:text-white transition-colors">{item.label}</Link></li>)}
            </ul>
          </div>
        </nav>
      </header>

      <section className="quipu-hero">
        <video className="quipu-hero-video" autoPlay muted loop playsInline preload="metadata" poster="/project-thumbs/quipu.jpg">
          <source src="/quipu/quipu.mp4" type="video/mp4" />
        </video>
        <div className="quipu-hero-shade" />
        <div className="quipu-hero-copy">
          <Image src="/quipu/title.png" alt="Quipu" width={520} height={130} priority />
          <p>QUIPU is an interactive installation that combines knot-tying with AI. Participants create knots in the rope to express emotions, which are transformed into projected words of guidance. Tangible action becomes a carrier for personal messages, linking information, interaction and symbolism.</p>
        </div>
        <div className="quipu-hero-meta">
          <span><b>Area</b>Interactive Design</span>
          <span><b>Duration</b>2023.11 – 2024.03</span>
          <span><b>Team Members</b>Xiangrui Zhou, Wenjia Shi, Yuqing Wu</span>
        </div>
      </section>

      <CaseChapters project="quipu" />

      <section className="quipu-ending">
        <Image src="/optimized/quipu-lastcover.webp" alt="Quipu final installation" fill className="object-cover object-center" />
        <div className="quipu-ending-shade" />
        <div className="quipu-ending-copy">
          <h2>Every Knot Tells a Story.</h2>
          <p>Tangible gestures become words of guidance — a bridge between emotion and expression.</p>
          <div><Link href="/">← Back to Homepage</Link><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑ Back to Top</button></div>
        </div>
      </section>
    </main></Localize>
  )
}
