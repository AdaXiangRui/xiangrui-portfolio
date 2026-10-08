"use client"
import {useHomeLanguage} from "./home-language"
export function AboutHome(){const {zh}=useHomeLanguage();return <section id="contact" className="home-contact"><p className="home-eyebrow">{zh?"联系 / LET’S CONNECT":"LET’S CONNECT"}</p><h2>{zh?<>下一段故事，<br/>一起开始。</>:<>Have something<br/><em>in mind?</em></>}</h2><a href="mailto:zhouxiangrui64@gmail.com">zhouxiangrui64@gmail.com ↗</a><p>{zh?"欢迎聊聊设计、合作，或一个新想法。":"For collaborations, conversations, or a new idea."}</p></section>}
