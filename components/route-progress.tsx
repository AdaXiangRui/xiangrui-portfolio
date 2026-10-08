"use client"

import {useEffect,useState} from "react"
import {usePathname} from "next/navigation"

export function RouteProgress(){
  const pathname=usePathname()
  const [pending,setPending]=useState(false)

  useEffect(()=>{
    const frame=requestAnimationFrame(()=>setPending(false))
    return()=>cancelAnimationFrame(frame)
  },[pathname])

  useEffect(()=>{
    const start=(event:MouseEvent)=>{
      if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return
      const anchor=(event.target as Element|null)?.closest<HTMLAnchorElement>('a[href]')
      if(!anchor||anchor.target==="_blank"||anchor.hasAttribute("download"))return
      const next=new URL(anchor.href,window.location.href)
      if(next.origin!==location.origin||next.pathname===location.pathname)return
      setPending(true)
    }
    document.addEventListener("click",start,{capture:true})
    return()=>document.removeEventListener("click",start,{capture:true})
  },[])

  return <div className={`route-progress${pending?" is-active":""}`} aria-hidden="true"><i/></div>
}
