"use client"
import {useSiteLanguage} from "./site-language"
import type {ReactNode} from "react"
export function useHomeLanguage(){const {zh,setZh}=useSiteLanguage();return {zh,toggle:()=>setZh(!zh)}}
export function HomeLanguage({children}:{children:ReactNode}){const {zh}=useSiteLanguage();return <div lang={zh?"zh-CN":"en"}>{children}</div>}
