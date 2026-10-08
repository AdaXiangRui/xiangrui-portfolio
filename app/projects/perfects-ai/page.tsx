"use client"


import {Localize} from "@/components/site-language"
import { ChapterRail } from "@/components/chapter-rail"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { useState } from "react"
import "./style.css"

const chapters = [
  ["01", "Context", "为什么需要一套智能体闭环"],
  ["02", "Architecture", "从知识到智能体，再到使用者"],
  ["03", "Creation", "把复杂配置变成清晰步骤"],
  ["04", "Knowledge", "让多格式内容真正可用"],
  ["05", "Business rules", "用一套规则连接权限与成本"],
  ["06", "Touchpoints", "从桌面端延伸到微信"],
  ["07", "Reflection", "把功能文档变成产品体验"],
]

const tierData = [
  { id: "L1", name: "Professional", who: "平台端专业用户", summary: "知识库直用与自用智能体", rights: ["创建与管理知识库", "基于知识库直接对话", "创建仅自己可用的智能体"], note: "不提供对外分发路径" },
  { id: "L2", name: "Client", who: "智能体使用者", summary: "订阅或获授权后使用智能体", rights: ["免费或付费订阅", "一次性试用", "按日 / 周 / 月 / 年使用"], note: "Creator 与 Client 的权限必须同时有效" },
  { id: "L3", name: "Creator", who: "企业级创建者", summary: "创建、发布、分发与管理", rights: ["包含 L1 的全部能力", "设置使用套餐与试用策略", "查看调用、对话与用户数据"], note: "对外分发产生的模型成本由 Creator 承担" },
]

function SectionHeading({ n, en, title, children }: { n: string; en: string; title: string; children: React.ReactNode }) {
  return <Localize><div className="pf-heading"><span className="pf-label">{n} / {en.toUpperCase()}</span><h2>{title}</h2><p>{children}</p></div></Localize>
}

type CarouselSlide = { src: string; alt: string; label: string }

function InterfaceCarousel({ slides, mobile = false, eyebrow }: { slides: CarouselSlide[]; mobile?: boolean; eyebrow: string }) {
  const [current, setCurrent] = useState(0)
  const previous = () => setCurrent(index => (index - 1 + slides.length) % slides.length)
  const next = () => setCurrent(index => (index + 1) % slides.length)

  return <Localize><figure className={`pf-carousel${mobile ? " pf-carousel-mobile" : ""}`}>
    <div className="pf-carousel-head">
      <span>{eyebrow}</span>
      <small>{String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</small>
    </div>
    <div className="pf-carousel-stage">
      <motion.img
        key={slides[current].src}
        src={slides[current].src}
        alt={slides[current].alt}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: .24 }}
      />
    </div>
    <figcaption>
      <strong>{slides[current].label}</strong>
      <div className="pf-carousel-controls">
        <button type="button" onClick={previous} aria-label="上一张图片">←</button>
        <div>{slides.map((slide, index) => <button type="button" className={index === current ? "active" : ""} onClick={() => setCurrent(index)} aria-label={`查看${slide.label}`} aria-current={index === current ? "true" : undefined} key={slide.src} />)}</div>
        <button type="button" onClick={next} aria-label="下一张图片">→</button>
      </div>
    </figcaption>
  </figure></Localize>
}

const creationSlides: CarouselSlide[] = [
  { src: "/perfects/agent-create-01.png", alt: "智能体创建第一步基础信息界面", label: "01 / 定义智能体的基础信息与提示词" },
  { src: "/perfects/agent-create-02.png", alt: "智能体创建定价设置界面", label: "02 / 设置公开范围、套餐与定价" },
  { src: "/perfects/agent-create-03.png", alt: "智能体创建第三步配置界面", label: "03 / 补充能力配置与使用规则" },
  { src: "/perfects/agent-create-04.png", alt: "智能体创建完成与发布界面", label: "04 / 确认信息并完成发布" },
]

const knowledgeSlides: CarouselSlide[] = [
  { src: "/perfects/knowledge-main.png", alt: "知识库管理主界面", label: "知识库总览与文件状态" },
  { src: "/perfects/knowledge-upload.png", alt: "知识库上传文件界面", label: "上传文件并进入解析流程" },
  { src: "/perfects/knowledge-personal.png", alt: "个人知识库界面", label: "个人知识空间" },
  { src: "/perfects/knowledge-team.png", alt: "企业知识库界面", label: "企业知识空间与协作管理" },
]

export default function Perfects() {
  const reduced = useReducedMotion()
  const [tier, setTier] = useState(2)
  const activeTier = tierData[tier]

  return <Localize><main className="perfects-page" lang="zh-CN">
    <header className="pf-nav"><Link href="/">周详睿</Link><nav><a href="#pf-outline">项目目录</a><Link href="/#work">所有作品 ↗</Link></nav></header>

    <section className="pf-hero">
      <motion.div initial={{ opacity: 0, y: reduced ? 0 : 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
        <span className="pf-label">AI AGENT PLATFORM / PRODUCT EXPERIENCE</span>
        <h1>智库</h1>
        <h2>让企业知识，<br />成为可以被使用的智能体。</h2>
        <p>一套连接知识管理、智能体创建、商业规则与微信端使用体验的 AI 产品系统。</p>
        <a className="pf-button" href="#pf-outline">探索产品闭环 ↓</a>
      </motion.div>
      <motion.figure className="pf-hero-visual" initial={{ opacity: 0, scale: reduced ? 1 : .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .7, delay: .1 }}>
        <img decoding="async" fetchPriority="high" src="/optimized/perfects-hero.jpg" alt="智库桌面管理、知识库与移动端智能体体验" />
      </motion.figure>
    </section>

    <div className="pf-meta"><div><small>PROJECT</small>智库 · 智能体平台</div><div><small>ROLE</small>UI / UX 设计实习</div><div><small>SCOPE</small>B 端平台 · 小程序 · 订阅体系</div><div><small>FOCUS</small>复杂规则的体验转译</div></div>
    <ChapterRail id="pf-outline">{chapters.map(([n,,cn]) => <a href={`#pf-${n}`} key={n}>{n} / {cn}</a>)}</ChapterRail>

    <section className="pf-statement">
      <span className="pf-label">THE PRODUCT LOOP</span>
      <h2>不是一个聊天框，<br /><em>而是一条完整链路。</em></h2>
      <div className="pf-loop" aria-label="产品闭环">
        {[["01", "KNOWLEDGE", "沉淀多格式内容"], ["02", "CREATE", "配置可复用能力"], ["03", "DISTRIBUTE", "定义价格与权限"], ["04", "USE", "在多端完成任务"]].map((item, i) => <article key={item[0]}><b>{item[0]}</b><span>{item[1]}</span><h3>{item[2]}</h3>{i < 3 && <i aria-hidden="true">→</i>}</article>)}
      </div>
    </section>

    <section id="pf-01" className="pf-section">
      <SectionHeading n="01" en="Context" title="为什么需要，完整的智能体闭环">企业已有大量文档、录音、视频和会议资料，但从“存下来”到“能被 AI 使用”，中间仍缺少清晰的整理、配置、授权与分发路径。</SectionHeading>
      <div className="pf-content">
        <div className="pf-big-question"><span>DESIGN QUESTION</span><h3>如何让企业知识，轻松转化，易于管理与分发，也能持续使用？</h3></div>
        <div className="pf-value-grid">
          {[["跨格式整合", "文本、音频、视频、网页与会议录屏进入同一个知识空间。"], ["知识提炼", "从资料中生成摘要、主题、脑图，并支持追溯来源。"], ["智能体部署", "把模型、指令、知识与权限封装为可使用的服务。"], ["团队协作", "通过共享空间、成员权限与访问范围控制企业知识。"]].map((x, i) => <article key={x[0]}><span>0{i + 1}</span><h3>{x[0]}</h3><p>{x[1]}</p></article>)}
        </div>
        <div className="pf-audience"><b>核心用户</b><span>研究人员</span><span>教育工作者</span><span>项目经理</span><span>企业知识管理员</span><span>中小团队</span></div>
      </div>
    </section>

    <section id="pf-02" className="pf-section pf-section-dark">
      <SectionHeading n="02" en="Architecture" title="从知识到智能体，再到使用者">平台同时服务创建者和终端使用者。我把产品结构压缩成一条可读的价值链，让每个模块都能回答“信息从哪里来、如何被配置、最终被谁使用”。</SectionHeading>
      <div className="pf-content">
        <div className="pf-architecture" aria-label="智库产品架构">
          <article><span>INPUT</span><h3>多格式知识</h3><p>文档 · 网页 · 图片 · 音频 · 视频</p></article><i>→</i>
          <article className="accent"><span>ORCHESTRATE</span><h3>智能体工作台</h3><p>指令 · 模型 · 知识库 · 记忆</p></article><i>→</i>
          <article><span>GOVERN</span><h3>权限与订阅</h3><p>可见性 · 套餐 · 试用 · 授权</p></article><i>→</i>
          <article><span>DELIVER</span><h3>跨端使用</h3><p>Web · API · 微信小程序</p></article>
        </div>
        <div className="pf-two-views"><article><span>CREATOR VIEW</span><h3>创建与运营</h3><ul><li>创建、发布和分发智能体</li><li>管理知识库与成员权限</li><li>查看调用、对话、用户与响应时间</li></ul></article><article><span>CLIENT VIEW</span><h3>发现与完成任务</h3><ul><li>浏览或接收获授权的智能体</li><li>通过文本、语音、图片和文件提问</li><li>在历史会话中继续上下文</li></ul></article></div>
      </div>
    </section>

    <section id="pf-03" className="pf-section">
      <SectionHeading n="03" en="Creation" title="复杂配置，如何变成清晰步骤">创建智能体并不只是填写名称。真正的任务是把“它是谁、知道什么、谁能用、如何计费”组织成一条不会遗漏关键规则的发布流程。</SectionHeading>
      <div className="pf-content">
        <div className="pf-stepper">
          {[["01", "定义", "名称、描述、头像与系统指令", "先建立清晰身份"], ["02", "连接", "模型、知识库、记忆与工作流", "决定回答能力"], ["03", "控制", "公开、私密或定向授权", "明确谁可以访问"], ["04", "定价", "周期、轮数、购买周期与价格", "免费也必须有规则"], ["05", "发布", "预览、测试与数据追踪", "进入可运营状态"]].map((x, i) => <article key={x[0]}><b>{x[0]}</b><div><span>{x[1]}</span><h3>{x[2]}</h3><p>{x[3]}</p></div>{i < 4 && <i>↓</i>}</article>)}
        </div>
        <aside className="pf-rule-card"><span>NON-NEGOTIABLE RULE</span><h3>每个智能体必须绑定至少一个 Pricing Plan。</h3><p>即便是免费智能体，也需要显式定义使用周期与轮数上限。这样所有使用行为都可以统一走“订阅 + 扣轮数”的路径。</p><div><b>PERIOD</b><b>ROUNDS</b><b>DURATION</b><b>PRICE</b></div></aside>
        <InterfaceCarousel eyebrow="REAL INTERFACE / CREATION FLOW" slides={creationSlides} />
      </div>
    </section>

    <section id="pf-04" className="pf-section pf-knowledge-section">
      <SectionHeading n="04" en="Knowledge" title="多格式内容，如何真正可用">知识库不是静态文件夹，而是内容进入、解析、组织、对话、追溯和分享的工作空间。</SectionHeading>
      <div className="pf-content">
        <div className="pf-knowledge-flow">
          {[["01", "UPLOAD", "上传", "文件或文件夹"], ["02", "PARSE", "解析", "识别内容与状态"], ["03", "ORGANISE", "组织", "层级、标签与筛选"], ["04", "ASK", "提问", "选择参考范围"], ["05", "TRACE", "追溯", "回答回到来源"]].map((x, i) => <article key={x[0]}><span>{x[0]} / {x[1]}</span><strong>{x[2]}</strong><small>{x[3]}</small>{i < 4 && <i>→</i>}</article>)}
        </div>
        <div className="pf-knowledge-board">
          <div className="pf-folder"><span>TEAM KNOWLEDGE / 产品研究</span><h3>42 个文件，6 种格式</h3><div className="pf-files"><i>PDF</i><i>DOC</i><i>WEB</i><i>IMG</i><i>AUDIO</i><i>VIDEO</i></div></div>
          <div className="pf-chat"><span>ASK THIS KNOWLEDGE BASE</span><p>“梳理这些访谈里反复出现的需求，并标注来源。”</p><div><b>回答</b><p>系统基于已选择文档生成结论，并保留引用关系，便于继续编辑或追问。</p><small>Referenced 8 documents ↗</small></div></div>
        </div>
        <InterfaceCarousel eyebrow="REAL INTERFACE / KNOWLEDGE SPACES" slides={knowledgeSlides} />
        <div className="pf-permission-strip"><b>同一个知识空间，三种控制</b><span>成员权限</span><span>链接访问</span><span>密码保护</span><span>文档范围</span></div>
      </div>
    </section>

    <section id="pf-05" className="pf-section pf-tier-section">
      <SectionHeading n="05" en="Business rules" title="一套规则，连接权限与成本">订阅不是页面末端的支付功能，而是整个产品的权限底座。我将复杂条款归纳为三个层级，并让每一次使用都可以被计量、限制和终止。</SectionHeading>
      <div className="pf-content">
        <div className="pf-tier-tabs" role="tablist" aria-label="订阅层级">{tierData.map((item, i) => <button role="tab" aria-selected={tier === i} onClick={() => setTier(i)} key={item.id}><b>{item.id}</b><span>{item.name}</span><small>{item.who}</small></button>)}</div>
        <motion.div className="pf-tier-detail" key={activeTier.id} initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }}>
          <div><span>{activeTier.id} / {activeTier.name}</span><h3>{activeTier.summary}</h3><p>{activeTier.note}</p></div><ul>{activeTier.rights.map(x => <li key={x}>{x}</li>)}</ul>
        </motion.div>
        <figure className="pf-feature-figure"><img loading="lazy" decoding="async" src="/perfects/agent-analytics.png" alt="智能体数据分析与运营界面" /><figcaption><span>REAL INTERFACE / CREATOR ANALYTICS</span><strong>把调用、对话与用户状态转化为可持续运营的信息。</strong></figcaption></figure>
        <div className="pf-principles">
          {[["ONE TIER", "同一时间只有一个主订阅"], ["NO TRUE UNLIMITED", "体验可接近无限，系统仍保留上限"], ["ONE-TIME TRIAL", "单一用户 × 单一智能体仅试用一次"], ["EXPLICIT ACCESS", "例外权限必须通过兑换码或定向授权"]].map(x => <article key={x[0]}><span>{x[0]}</span><p>{x[1]}</p></article>)}
        </div>
      </div>
    </section>

    <section id="pf-06" className="pf-section pf-touchpoint-section">
      <SectionHeading n="06" en="Touchpoints" title="从桌面端，延伸到微信">桌面端承担创建、配置和运营；小程序承担低门槛访问与即时使用。两端通过同一套智能体、权限和订阅状态保持连续。</SectionHeading>
      <div className="pf-content">
        <div className="pf-cross-device">
          <div className="pf-desktop-mock"><span>DESKTOP / CREATE</span><h3>搭建并授权</h3><div className="pf-mini-dashboard"><i /><i /><i /><strong>Agent published</strong></div><p>创建智能体 → 连接知识库 → 设置套餐 → 指定微信用户</p></div>
          <div className="pf-sync"><b>↔</b><span>Identity<br />Permission<br />Subscription</span></div>
          <div className="pf-phone"><span>9:41</span><h4>智能体广场</h4><div className="pf-agent-card"><i>AI</i><div><b>留学助手</b><small>已获授权 · 免费</small></div></div><div className="pf-agent-card"><i>文</i><div><b>写作助手</b><small>4.8 ★ · 2.1k 人使用</small></div></div><button>打开对话</button></div>
        </div>
        <figure className="pf-feature-figure pf-feature-figure-chat"><img loading="lazy" decoding="async" src="/perfects/agent-chat-desktop.png" alt="桌面端智能体对话界面" /><figcaption><span>DESKTOP / CONVERSATION</span><strong>在桌面端延续知识库上下文与任务对话。</strong></figcaption></figure>
        <div className="pf-mobile-gallery" aria-label="微信小程序主要界面">
          <figure><img loading="lazy" decoding="async" src="/perfects/mobile-market.png" alt="小程序智能体广场界面" /><figcaption><span>01 / DISCOVER</span><strong>智能体广场</strong></figcaption></figure>
          <figure><img loading="lazy" decoding="async" src="/perfects/mobile-agent.png" alt="小程序智能体详情界面" /><figcaption><span>02 / UNDERSTAND</span><strong>智能体详情</strong></figcaption></figure>
          <figure><img loading="lazy" decoding="async" src="/perfects/mobile-agent-chat.png" alt="小程序智能体对话展开界面" /><figcaption><span>03 / USE</span><strong>对话与使用</strong></figcaption></figure>
        </div>
        <div className="pf-mobile-capabilities">{[["零下载", "微信一键登录"], ["多模态", "语音、图片与文件"], ["可续写", "历史会话自动带入上下文"], ["可分发", "二维码、分享与定向授权"]].map(x => <article key={x[0]}><b>{x[0]}</b><span>{x[1]}</span></article>)}</div>
      </div>
    </section>

    <section id="pf-07" className="pf-section pf-reflection-section">
      <SectionHeading n="07" en="Reflection" title="从功能文档，到产品体验">这个项目的难点不是缺少功能，而是让功能、权限和商业规则在不同用户与不同端之间保持一致。</SectionHeading>
      <div className="pf-content">
        <div className="pf-reflection-grid">
          <article><span>01 / REDUCE</span><h3>减少用户需要理解的系统概念</h3><p>默认知识库智能体与自用套餐由系统自动创建，用户只感知“可以使用”和剩余轮数。</p></article>
          <article><span>02 / REVEAL</span><h3>在决策点呈现必要规则</h3><p>价格体系放进发布路径，权限状态放进智能体详情与会话入口，避免规则隐藏在设置深处。</p></article>
          <article><span>03 / CONNECT</span><h3>用同一状态贯穿跨端体验</h3><p>PC 端授权后，小程序只展示当前账号真正可用的智能体；到期、下线和异常都给出明确反馈。</p></article>
        </div>
        <div className="pf-next"><span>NEXT VALIDATION</span><p>下一步应以真实任务验证三件事：创建者能否正确配置套餐、终端用户能否理解授权与试用状态、跨端切换后是否仍能保持连续的对话上下文。</p></div>
        <p className="pf-doc-note">内容依据项目功能文档、智能体小程序客户端 PRD 与订阅体系规则整理；界面中的示例数据用于解释产品逻辑。</p>
      </div>
    </section>

    <footer className="pf-footer"><span className="pf-label">CONTINUE EXPLORING</span><h2>Complex rules.<br /><em>Clear experiences.</em></h2><Link href="/#work" className="pf-button">回到全部作品 ↗</Link><Link href="/about">认识设计师 ↗</Link></footer>
  </main></Localize>
}
