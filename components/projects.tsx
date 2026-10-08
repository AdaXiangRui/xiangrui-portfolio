"use client"
import {useEffect,useRef,useState,type CSSProperties} from "react"
import Link from "next/link"
import {motion,useInView,useReducedMotion} from "framer-motion"
import {useHomeLanguage} from "./home-language"
const projects = [
  {
    title: "Ariel",
    titleZh: "海塑新生",
    description: "Ocean plastic × Eco-fashion service",
    image: "/project-thumbs/ariel.jpg",
    href: "/projects/ariel",
    summary: "An eco-fashion service that connects ocean plastic recovery with recycled products, bringing communities into a circular system.",
  },
  {
    title: "Argentu",
    titleZh: "银泉",
    description: "Water monitoring × Citizen-science platform",
    image: "/project-thumbs/argentu.jpg",
    href: "/projects/argentu",
    summary: "A citizen-science platform that invites people to participate in water monitoring and understand their local environment.",
  },
  {
    title: "Aura",
    titleZh: "昂然",
    description: "Driver fatigue × Music intervention system",
    image: "/project-thumbs/aura.jpg",
    href: "/projects/aura",
    summary: "A music intervention system that responds to driver fatigue, exploring how sound can support the driving experience.",
  },
  {
    title: "Ecdysis",
    titleZh: "蜕变",
    description: "Personal care × Smart skin health system",
    image: "/project-thumbs/ecdysis.jpg",
    href: "/projects/ecdysis",
    summary: "A smart skin health system that brings personal care and technology together to support everyday care routines.",
  },
  {
    title: "Quipu",
    titleZh: "结绳心语",
    description: "Knot-tying × AI emotional installation",
    image: "/project-thumbs/quipu.jpg",
    href: "/projects/quipu",
    summary: "An emotional installation that combines knot-tying with AI to explore how feelings can take physical form.",
  },
  {
    title: "Perfects. AI",
    titleZh: "智库",
    description: "AI agent × Knowledge management platform",
    image: "/project-thumbs/perfects.jpg",
    href: "/projects/perfects-ai",
    summary: "An AI agent platform that helps people organize and explore knowledge, making scattered information easier to find and use.",
  },
] as const



const designTypes=["Service Design","Service Design","System Design","System Design","Interaction Design","Product Design"]
const heights=[18,-12,26,-20,12,-4]
const rotations=[-4,3,-3,4,-3,2]
const categories=["海洋塑料 × 循环时尚服务","水质监测 × 公民科学","驾驶疲劳 × 音乐干预","个人护理 × 智能皮肤健康","绳结 × AI 情感装置","AI 智能体 × 知识管理"]
const summaries=["连接海洋塑料回收与再生产品，让社区参与循环服务。","邀请公众参与水质监测，了解身边的水环境。","回应驾驶疲劳的音乐干预系统，探索声音与驾驶体验。","连接个人护理与技术，支持日常皮肤健康管理。","将绳结与 AI 结合，探索情感如何形成可触摸的表达。","连接智能体创建与知识管理，让信息成为可使用的能力。"]
export function Projects(){const {zh}=useHomeLanguage();const reduced=useReducedMotion();const [active,setActive]=useState<number|null>(null);const [dealt,setDealt]=useState(false);const [shouldAnimate,setShouldAnimate]=useState(false);const ref=useRef<HTMLDivElement>(null);const entered=useInView(ref,{once:true,amount:"some"});useEffect(()=>{const direct=window.location.hash==="#work"||window.scrollY>Math.max(0,(ref.current?.getBoundingClientRect().top??0)+window.scrollY-window.innerHeight*.55);let last=window.scrollY;const onScroll=()=>{const next=window.scrollY;if(next>last&&window.location.hash!=="#work")setShouldAnimate(true);last=next};const onHash=()=>{if(window.location.hash==="#work")setDealt(true)};if(direct)setDealt(true);window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("hashchange",onHash);return()=>{window.removeEventListener("scroll",onScroll);window.removeEventListener("hashchange",onHash)}},[]);const show=entered||dealt;const animateDeal=shouldAnimate&&!dealt;return <section id="work" className="home-work"><div className="fan-heading"><div><p className="home-eyebrow">{zh?"精选作品 / 2024—2026":"SELECTED WORK / 2024—2026"}</p><h2>{zh?"六个项目，六种可能。":"A handful of possibilities."}</h2></div><p>{zh?"选一张，展开看看 ↗":"Pick a card. Take a closer look. ↗"}</p></div><div ref={ref} className="fan-stage" onMouseLeave={()=>setActive(null)}>{projects.map((project,i)=>{const picked=active===i;const title=zh&&"titleZh" in project?project.titleZh:project.title;return <motion.div key={project.title} className="fan-slot" style={{"--index":i,"--rest-rotation":rotations[i]+"deg",zIndex:picked?30:i+1} as CSSProperties} initial={false} animate={{opacity:show?1:0,x:reduced?0:show?(active===null||picked?0:i<active?-12:12):`${-i*83.333-100}%`,rotate:reduced?0:show?(picked?0:rotations[i]):-12,scale:reduced?1:!show?.92:picked?1.05:1,y:reduced?0:!show?45:picked?heights[i]-24:heights[i]}} transition={{duration:animateDeal?.65:.3,ease:[.16,1,.3,1],delay:animateDeal?i*.12:0}} onAnimationComplete={()=>{if(show&&i===5)setDealt(true)}} onHoverStart={()=>setActive(i)} onHoverEnd={()=>setActive(null)}><Link className="fan-card" href={project.href} onFocus={()=>setActive(i)} onBlur={()=>setActive(null)} aria-label={zh?`查看 ${title} 项目`:`View ${title} project`}><div className="fan-topline"><span className="fan-index">0{i+1}</span><span className="fan-design-type">{designTypes[i]}</span></div><h3>{title}</h3><p className="fan-category">{zh?categories[i]:project.description}</p><div className="fan-image"><img src={project.image} alt={title+(zh?" 项目预览":" project preview")} loading="lazy"/></div><div className={'fan-detail'+(picked?' is-open':'')}><p>{zh?summaries[i]:project.summary}</p><span>{zh?"查看项目":"VIEW PROJECT"} ↗</span></div></Link></motion.div>})}</div><p className="fan-mobile-hint">{zh?"向下浏览 · 点击查看项目":"Scroll to explore · Tap to view a project"}</p></section>}
