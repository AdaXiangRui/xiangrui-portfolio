"use client"
import {useEffect,useRef,useState,useId,type ReactNode} from "react"
import {createPortal} from "react-dom"
import {useSiteLanguage} from "./site-language"
import "./chapter-rail.css"

export function ChapterRail({children,label="Contents",id}:{children:ReactNode,label?:string,id?:string}){
 const {zh}=useSiteLanguage()
 const displayLabel=label==="Contents"&&zh?"目录":label
 const [mounted,setMounted]=useState(false),[open,setOpen]=useState(false)
 const ref=useRef<HTMLDivElement>(null), panelId=useId()
 useEffect(()=>setMounted(true),[])
 useEffect(()=>{
  if(!mounted)return
  let frame=0
  const update=()=>{frame=0;const links=Array.from(ref.current?.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')||[]);let active=links[0];for(const link of links){const section=document.getElementById(decodeURIComponent(link.hash.slice(1)));if(section&&section.getBoundingClientRect().top<=Math.min(220,innerHeight*.3))active=link}links.forEach(link=>{if(link===active)link.setAttribute("aria-current","location");else link.removeAttribute("aria-current")})}
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)}
  update();window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",schedule)
  const resize=new ResizeObserver(schedule);resize.observe(document.body)
  return()=>{cancelAnimationFrame(frame);window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);resize.disconnect()}
 },[mounted,children])
 return <><span id={id} className="chapter-rail-anchor"/>{mounted&&createPortal(<div ref={ref} className={`chapter-rail ${open?"is-open":""}`} onKeyDown={e=>{if(e.key==="Escape")setOpen(false)}}><button className="chapter-rail-toggle" aria-expanded={open} aria-controls={panelId} onClick={()=>setOpen(!open)}>{open?"×": "☰"}<span>{displayLabel}</span></button><nav id={panelId} aria-label={displayLabel} onClick={e=>{if((e.target as HTMLElement).closest("a"))setOpen(false)}}>{children}</nav></div>,document.body)}</>
}
