"use client"
import { useHomeLanguage } from "./home-language"
import Link from "next/link"

const navItems = [
  { label: "Work", href: "#work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "#contact" },
]

export function Navigation() {
  const {zh}=useHomeLanguage()
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(10, 12, 20, 0.6)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          <Link 
            href="/" 
            className="text-sm font-medium tracking-tight text-white hover:text-white/70 transition-colors"
          >
            {zh ? "周详睿" : "Xiangrui Zhou"}
          </Link>
          
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="portfolio-nav-link relative text-sm text-white/70 transition-opacity duration-250 ease-out hover:opacity-70"
                >
                  {zh ? ({Work:"作品",About:"关于我",Contact:"联系"}[item.label]) : item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}
