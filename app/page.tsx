import { HomeMotion } from "@/components/home-motion"
import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { Projects } from "@/components/projects"

import { HomeLanguage } from "@/components/home-language"
import "./home-fan.css"
import { AboutHome } from "@/components/about-home"
import { HomeFooter } from "@/components/home-footer"

export default function Home() {
  return (
    <HomeLanguage><HomeMotion>
      <Navigation />
      <Hero />
      <Projects />
      <AboutHome />
      <HomeFooter />
    </HomeMotion></HomeLanguage>
  )
}
