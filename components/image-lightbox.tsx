"use client"
import {useEffect,useState} from "react"
import {usePathname} from "next/navigation"

export function ImageLightbox(){
  const [image,setImage]=useState<{src:string;alt:string}|null>(null)
  const pathname=usePathname()
  useEffect(()=>setImage(null),[pathname])
  useEffect(()=>{const open=(event:MouseEvent)=>{const target=event.target;if(!(target instanceof HTMLImageElement)||!target.closest(".ariel-case,.aura-scroll-snap,.ecdysis-page,.quipu-scroll-snap,.argentu-page,.perfects-page")||target.closest("button,[role=button],[data-no-lightbox]"))return;const rect=target.getBoundingClientRect();if(rect.width<220||rect.height<140)return;event.preventDefault();setImage({src:target.currentSrc||target.src,alt:target.alt})};document.addEventListener("click",open);return()=>document.removeEventListener("click",open)},[])
  useEffect(()=>{if(!image)return;const close=(e:KeyboardEvent)=>{if(e.key==="Escape")setImage(null)};document.addEventListener("keydown",close);return()=>document.removeEventListener("keydown",close)},[image])
  if(!image)return null
  return <div className="site-image-lightbox" role="dialog" aria-modal="true" aria-label={image.alt||"Enlarged project image"} onClick={()=>setImage(null)}><button type="button" aria-label="Close enlarged image" onClick={()=>setImage(null)}>×</button><img src={image.src} alt={image.alt}/></div>
}
