"use client"
import Link from "next/link"
import Image from "next/image"
import {motion,useReducedMotion} from "framer-motion"
import {useHomeLanguage} from "./home-language"
export function Hero(){const {zh}=useHomeLanguage();const reduced=useReducedMotion();return <section id="about" className="home-intro"><motion.div initial={{opacity:0,y:reduced?0:20}} animate={{opacity:1,y:0}} transition={{duration:.6}}><h1>{zh?"周详睿":"Xiangrui Zhou"}</h1><div className="home-bio"><h2>{zh?"交互与服务设计师":"Interaction & Service Designer"}</h2><p>{zh?"连接人的行为，与数字和实体体验。":"Bridging human behavior with digital and physical experiences."}</p><Link className="home-resume" href="/about">{zh?"关于我":"About me"}<span>↗</span></Link></div></motion.div><motion.div className="home-portrait" initial={{opacity:0,y:reduced?0:30}} animate={{opacity:1,y:0}} transition={{delay:.25,duration:.7}}><Image src="/avatar1.png" alt={zh?"周详睿的肖像":"Portrait of Xiangrui Zhou"} fill priority sizes="(max-width: 800px) 85vw, 38vw" style={{objectFit:"contain",objectPosition:"right bottom"}}/></motion.div></section>}
