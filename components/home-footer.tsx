"use client"
import {useHomeLanguage} from "./home-language"
export function HomeFooter(){const {zh}=useHomeLanguage();return <footer className="bg-[#0a0f1e] px-6 pb-8 text-center text-xs text-white/35">© 2026 {zh?"周详睿":"Xiangrui Zhou"}</footer>}
