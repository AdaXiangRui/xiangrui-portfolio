'use client'
import {createContext,useContext,useEffect,useState,Children,cloneElement,isValidElement,type ReactNode,type ReactElement} from 'react'
import {usePathname} from 'next/navigation'

import dictionary from './site-translations.json'
const Language=createContext({zh:false,setZh:(_value:boolean)=>{}})
export const useSiteLanguage=()=>useContext(Language)
const normalize=(text:string)=>text.replace(/\s+/g,' ').trim()
const pairs=dictionary as Record<string,string>
const lower=Object.fromEntries(Object.entries(pairs).map(([en,zh])=>[en.toLowerCase(),zh]))
const reverse=Object.fromEntries(Object.entries(pairs).map(([en,zh])=>[normalize(zh),en]))
export function translateText(text:string,zh:boolean){const key=normalize(text);const translated=zh?(pairs[key]??lower[key.toLowerCase()]):reverse[key];return translated?text.replace(text.trim(),translated):text}
const hasChinese=(text:string)=>/[\u3400-\u9fff]/.test(text)
function textContent(node:ReactNode):string{
 if(typeof node==='string'||typeof node==='number')return String(node)
 if(Array.isArray(node))return node.map(textContent).join('')
 if(!isValidElement(node))return ''
 return textContent((node as ReactElement<Record<string,unknown>>).props.children as ReactNode)
}
function formatChineseHeading(node:ReactNode,breakAtComma:boolean):ReactNode{
 if(typeof node==='string'){
  const cleaned=node.replace(/。/g,'')
  if(!breakAtComma||!cleaned.includes('，'))return cleaned
  const parts=cleaned.split('，')
  return parts.flatMap((part,index)=>index<parts.length-1?[part+'，',<br data-zh-title-break key={`zh-break-${index}`}/>]:[part])
 }
 if(Array.isArray(node))return Children.map(node,child=>formatChineseHeading(child,breakAtComma))
 if(!isValidElement(node))return node
 const element=node as ReactElement<Record<string,unknown>>
 if(element.type==='br'&&breakAtComma)return null
 if(element.props.children===undefined)return node
 return cloneElement(element,{children:formatChineseHeading(element.props.children as ReactNode,breakAtComma)})
}
export function ChineseTitle({children}:{children:ReactNode}){
 const title=textContent(children)
 return <>{hasChinese(title)?formatChineseHeading(children,title.includes('，')):children}</>
}
function translateTree(node:ReactNode,zh:boolean):ReactNode{
 if(typeof node==='string')return translateText(node,zh)
 if(Array.isArray(node))return Children.map(node,child=>translateTree(child,zh))
 if(!isValidElement(node))return node
 const element=node as ReactElement<Record<string,unknown>>
 if(element.type==='style'||element.type==='script'||element.props['data-no-translate'])return node
 const props:Record<string,unknown>={}
 for(const key of ['title','caption','label','alt','placeholder','aria-label'])if(typeof element.props[key]==='string')props[key]=translateText(element.props[key] as string,zh)
 if(element.type==='main')props.lang=zh?'zh-CN':'en'
 if(element.props.children!==undefined){
  const children=translateTree(element.props.children as ReactNode,zh)
  const isHeading=element.type==='h1'||element.type==='h2'||element.type==='h3'
  const headingText=isHeading?textContent(children):''
  props.children=isHeading&&hasChinese(headingText)?formatChineseHeading(children,headingText.includes('，')):children
 }
 return cloneElement(element,props)
}
/** Translate React text and presentation props without touching DOM, identifiers or event handlers. */
export function Localize({children}:{children:ReactNode}){const {zh}=useSiteLanguage();return <>{translateTree(children,zh)}</>}
export function SiteLanguage({children}:{children:ReactNode}){
 const pathname=usePathname()
 const prefersChinese=pathname==='/projects/perfects-ai'||pathname==='/projects/ecdysis'
 const [zh,setLanguage]=useState(prefersChinese)

 useEffect(()=>{setLanguage(prefersChinese)},[prefersChinese])
 useEffect(()=>{document.documentElement.lang=zh?'zh-CN':'en'},[zh])
 const setZh=(value:boolean)=>setLanguage(value)
 return <Language.Provider value={{zh,setZh}}>{children}<div className="site-language" role="group" aria-label={zh?'选择语言':'Choose language'}><button type="button" onClick={()=>setZh(false)} aria-pressed={!zh}>EN</button><span aria-hidden="true">/</span><button type="button" onClick={()=>setZh(true)} aria-pressed={zh}>中</button></div></Language.Provider>
}
