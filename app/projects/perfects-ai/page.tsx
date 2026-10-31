"use client"


import {Localize} from "@/components/site-language"
import { ChapterRail } from "@/components/chapter-rail"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { BookOpen, Brain, Sparkles, ShieldCheck, SlidersHorizontal, HeartHandshake, UsersRound, RotateCcw, RefreshCw } from "lucide-react"
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
  { id: "PRODUCER", name: "知识生产者", who: "Linda · 留学咨询顾问", summary: "沉淀、维护并更新专业经验", rights: ["创建与管理知识库", "整理高频问题与标准回答", "持续补充来源与案例"], note: "让个人经验成为可复用的知识资产" },
  { id: "SEEKER", name: "知识需求者", who: "Jason · 本科生", summary: "找到与当前任务真正相关的信息", rights: ["发现或接收已授权智能体", "通过提问快速缩小信息范围", "在历史会话中继续任务"], note: "减少重复搜索与信息筛选成本" },
  { id: "WORKER", name: "知识工作者", who: "Elisa · 设计研究生", summary: "组合知识、工具与多个进行中任务", rights: ["连接不同项目资料", "创建并使用适合自己的智能体", "管理任务上下文与使用状态"], note: "让 AI 支持复杂工作，而不是增加信息负担" },
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
  { src: "/perfects/knowledge-team.png", alt: "团队知识库界面", label: "团队知识空间与协作管理" },
]

const aiEvolution = [
  { year: "2011", title: "工具型 AI", text: "以 Siri 为代表，主要作为执行工具存在，通过语音或指令完成简单任务，但不具备真正的认知与生成能力。" },
  { year: "2022", title: "生成式 AI", text: "以 ChatGPT 和 Midjourney 为代表，AI 开始具备生成文本与图像的能力，并通过自然语言成为通用的认知接口。" },
  { year: "2023", title: "应用层扩展", text: "以 Notion AI 和豆包为代表，AI 逐步嵌入工作流与内容生态，成为日常生产与创作的重要辅助工具。" },
  { year: "2025", title: "推理与系统化", text: "以 OpenClaw 为代表，AI 从对话交互转向任务执行，通过多步骤推理与工具调用，成为完成复杂工作的系统化智能体。" },
]

const behaviorShifts = [
  { n: "01", title: "获取知识", before: "搜索引擎、查找资料、咨询他人", after: "从检索与筛选，转向直接提问" },
  { n: "02", title: "分析决策", before: "过往经验、团队讨论", after: "结果更快，但来源与过程更难判断" },
  { n: "03", title: "产出内容", before: "手写文稿、手绘作图、现实取材", after: "生成门槛降低，结构与差异化仍需人工把控" },
  { n: "04", title: "优化反馈", before: "他人反馈与测试、反复试错优化", after: "通过多轮提示逼近结果，也更容易陷入反复试探" },
]

const adoptionDrivers = [
  { layer: "功能层", en: "Functional", items: [{ title: "知识即时获取", icon: BookOpen }, { title: "认知负担转移", icon: Brain }, { title: "跨领域能力", icon: Sparkles }] },
  { layer: "心理层", en: "Psychological", items: [{ title: "情绪安全感", icon: ShieldCheck }, { title: "掌控感", icon: SlidersHorizontal }, { title: "被理解感", icon: HeartHandshake }] },
  { layer: "系统层", en: "Systemic", items: [{ title: "零社交成本", icon: UsersRound }, { title: "低试错成本", icon: RotateCcw }, { title: "即时反馈循环", icon: RefreshCw }] },
]

const comparisonMetrics = [
  { label: "来源可靠性", traditional: 80, ai: 38 }, { label: "效率", traditional: 32, ai: 88 },
  { label: "可控性", traditional: 78, ai: 34 }, { label: "认知负担", traditional: 72, ai: 24 },
  { label: "内容创新性", traditional: 72, ai: 32 }, { label: "专业门槛", traditional: 76, ai: 30 },
]

const personaCards = [
  { name: "Linda", src: "/perfects/persona-cards/linda.png" },
  { name: "Jason", src: "/perfects/persona-cards/jason.png" },
  { name: "Elisa", src: "/perfects/persona-cards/elisa.png" },
]

export default function Perfects() {
  const reduced = useReducedMotion()
  const [tier, setTier] = useState(0)
  const activeTier = tierData[tier]

  return <Localize><main className="perfects-page" lang="zh-CN">
    <header className="pf-nav"><Link href="/">Xiangrui Zhou</Link><nav><Link href="/#work">Work</Link><Link href="/about">About</Link><Link href="/#contact">Contact</Link></nav></header>

    <div className="pf-cover">
    <section className="pf-hero">
      <motion.div initial={{ opacity: 0, y: reduced ? 0 : 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
        <span className="pf-label">AI AGENT PLATFORM / PRODUCT EXPERIENCE</span>
        <h1>智库</h1>
        <h2>让知识与经验，<br />成为可以被使用的智能体。</h2>
        <p>一套面向个人、团队与组织，连接知识管理、智能体创建、商业规则与微信端使用体验的 AI 产品系统。</p>
        <a className="pf-button" href="#pf-outline">探索产品闭环 ↓</a>
      </motion.div>
      <motion.figure className="pf-hero-visual" initial={{ opacity: 0, scale: reduced ? 1 : .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .7, delay: .1 }}>
        <img decoding="async" fetchPriority="high" src="/optimized/perfects-hero.jpg" alt="智库桌面管理、知识库与移动端智能体体验" />
      </motion.figure>
    </section>

    <div className="pf-meta"><div><small>PROJECT</small>智库 · 智能体平台</div><div><small>ROLE</small>UI / UX 设计实习</div><div><small>SCOPE</small>个人 · 团队 · 组织 · 小程序</div></div>
    </div>
    <ChapterRail id="pf-outline">{chapters.map(([n,,cn]) => <a href={`#pf-${n}`} key={n}>{n} / {cn}</a>)}</ChapterRail>

    <section className="pf-statement">
      <span className="pf-label">THE PRODUCT LOOP</span>
      <h2>不是一个聊天框，<br /><em>而是一条完整链路。</em></h2>
      <div className="pf-loop" aria-label="产品闭环">
        {[["01", "KNOWLEDGE", "沉淀多格式内容"], ["02", "CREATE", "配置可复用能力"], ["03", "DISTRIBUTE", "上线分发"], ["04", "REUSE", "多次使用"]].map((item, i) => <article key={item[0]}><b>{item[0]}</b><span>{item[1]}</span><h3>{item[2]}</h3>{i < 3 && <i aria-hidden="true">→</i>}</article>)}
      </div>
    </section>

    <section id="pf-01" className="pf-section">
      <SectionHeading n="01" en="Context" title="为什么需要，完整的智能体闭环">个人、团队与组织已经积累了大量文档、录音、视频和会议资料，但从“存下来”到“能被 AI 使用”，中间仍缺少清晰的整理、配置、授权与分发路径。</SectionHeading>
      <div className="pf-content">
        <div className="pf-big-question"><span>DESIGN QUESTION</span><h3>如何让知识与经验，轻松转化，易于管理与分发，也能持续使用？</h3></div>
        <div className="pf-value-grid">
          {[["跨格式整合", "文本、音频、视频、网页与会议录屏进入同一个知识空间。"], ["知识提炼", "从资料中生成摘要、主题、脑图，并支持追溯来源。"], ["智能体部署", "把模型、指令、知识与权限封装为可使用的服务。"], ["协作与分享", "通过个人空间、共享空间、成员权限与访问范围控制知识。"]].map((x, i) => <article key={x[0]}><span>0{i + 1}</span><h3>{x[0]}</h3><p>{x[1]}</p></article>)}
        </div>
        <div className="pf-audience"><b>核心用户</b><span>个人使用者</span><span>研究人员</span><span>教育工作者</span><span>知识工作者</span><span>项目团队</span><span>内容与服务提供者</span></div>
      </div>
    </section>

    <section className="pf-research-pair">
      <div className="pf-evolution-panel">
        <Localize><div className="pf-panel-heading"><span className="pf-label">R1 / AI EVOLUTION</span><h2>从工具到认知接口</h2></div></Localize>
        <div className="pf-axis-timeline">{aiEvolution.map((item, index) => <article style={{ gridRow: index + 1 }} className={index % 2 ? "right" : "left"} key={item.year}><div><b>{item.year}</b><h3>{item.title}</h3><p>{item.text}</p></div><i aria-hidden="true" /></article>)}</div>
      </div>
      <div className="pf-behavior-panel">
        <Localize><div className="pf-panel-heading"><span className="pf-label">R2 / USER BEHAVIOR SHIFT</span><h2>效率提高了，新的摩擦也出现了</h2></div></Localize>
        <div className="pf-compare-columns">{behaviorShifts.map(item => <article key={item.n}><h3>{item.title}</h3><div className="traditional"><span>PRE–AI</span><p>{item.before}</p></div><div className="ai"><span>WITH AI</span><p>{item.after}</p></div></article>)}</div>
        <div className="pf-metric-legend"><span><i />传统方式</span><span><i />AI 方式</span><small>低　　　　　高</small></div>
        <div className="pf-metric-grid">{comparisonMetrics.map(item => <article key={item.label}><b>{item.label}</b><div><span>传统</span><i><em style={{ left: `${item.traditional}%` }} /></i></div><div className="ai"><span>AI</span><i><em style={{ left: `${item.ai}%` }} /></i></div></article>)}</div>
        <p className="pf-research-conclusion">AI 将认知效率提升到前所未有的水平，但同时以降低可控性与长期价值沉淀为代价。</p>
      </div>
    </section>

    <section className="pf-section pf-adoption-section">
      <Localize><div className="pf-heading pf-adoption-heading"><span className="pf-label">R3 / ADOPTION DRIVERS</span><h2 data-no-title-break>功能、心理与系统，共同形成依赖</h2></div></Localize>
      <div className="pf-adoption-left">
        <div className="pf-driver-stack">{adoptionDrivers.map((group) => <article key={group.layer}><div className="pf-layer-name"><span>{group.en}</span><h3>{group.layer}</h3></div><div>{group.items.map(({ title, icon: Icon }) => <section key={title}><Icon aria-hidden="true" /><b>{title}</b></section>)}</div></article>)}</div>
      </div>
      <div className="pf-content pf-adoption-right">
        <div className="pf-adoption-questions"><div className="pf-adoption-time"><span>短期</span><i aria-hidden="true" /><span>长期</span></div><div className="pf-adoption-question-grid"><article><span>EFFICIENCY</span><h3>即时响应、最优结果</h3><p>即时获取 · 结果导向 · 低耗决策 · 广域覆盖</p></article><article><span>STRUCTURE</span><h3>碎片认知、结构缺失</h3><p>碎片信息 · 过程弱化 · 浅层理解 · 体系缺失</p></article></div></div>
        <figure className="pf-adoption-figure"><img decoding="async" src="/perfects/research/ai-journey.png" alt="在效率与失控之间摇摆的 AI 使用旅程" /><figcaption>即时响应带来效率，也可能让知识停留在碎片化层面；反复试探则形成持续使用的循环。</figcaption></figure>
      </div>
    </section>

    <section className="pf-section pf-shift-section">
      <div className="pf-shift-left">
        <Localize><div className="pf-heading"><span className="pf-label">R4 / SERVICE SHIFTING</span><h2>人机关系正在重新分配</h2></div></Localize>
        <div className="pf-shift-copy"><article><span>01 / PAST</span><h3>传统方式</h3><p>以人为中心，通过线性积累逐步构建知识体系，结构清晰但效率有限。</p></article><article><span>02 / NOW</span><h3>当前 AI</h3><p>以技术为中心，通过即时生成快速提供结果，效率极高却趋于碎片化。</p></article><article><span>03 / NEXT</span><h3>未来趋势</h3><p>人机协同，使知识与经验持续积累、复用与演化，最终转化为可持续的能力系统。</p></article></div>
      </div>
      <div className="pf-content"><figure className="pf-map-figure"><img loading="lazy" decoding="async" src="/perfects/research/service-shifting-map.png" alt="传统方式、当前 AI 与未来人机协同的服务转变地图" /></figure></div>
    </section>

    <section className="pf-persona-section">
      <Localize><div className="pf-persona-heading"><span className="pf-label">R5 / CORE USERS</span><h2 data-no-title-break>同一套系统，承接三种不同关系</h2></div></Localize>
      <div className="pf-persona-card-row">{personaCards.map(card => <motion.figure whileHover={reduced ? undefined : { y: -8 }} transition={{ duration: .22 }} key={card.name}><img loading="lazy" decoding="async" src={card.src} alt={`${card.name} 完整用户画像卡片`} /></motion.figure>)}</div>
    </section>

    <section id="pf-02" className="pf-section pf-section-dark">
      <SectionHeading n="02" en="Architecture" title="从知识到智能体，再到使用者">平台同时服务创建者和终端使用者。产品结构被压缩成一条清晰的价值链，使每个模块都能回答“信息从哪里来、如何被配置、最终被谁使用”。</SectionHeading>
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

    <section id="pf-03" className="pf-section pf-creation-section">
      <div className="pf-creation-left">
        <SectionHeading n="03" en="Creation" title="复杂配置，如何变成清晰步骤">创建智能体并不只是填写名称。真正的任务是把“它是谁、知道什么、谁能用、如何计费”组织成一条不会遗漏关键规则的发布流程。</SectionHeading>
        <div className="pf-stepper">
          {[["01", "定义", "名称、描述、头像与系统指令"], ["02", "连接", "模型、知识库、记忆与工作流"], ["03", "控制", "公开、私密或定向授权"], ["04", "定价", "周期、轮数、购买周期与价格"], ["05", "发布", "预览、测试与数据追踪"]].map((x) => <article key={x[0]}><b>{x[0]}</b><div><span>{x[1]}</span><h3>{x[2]}</h3></div></article>)}
        </div>
      </div>
      <div className="pf-content pf-creation-media">
        <InterfaceCarousel eyebrow="REAL INTERFACE / CREATION FLOW" slides={creationSlides} />
      </div>
    </section>

    <section id="pf-04" className="pf-section pf-knowledge-section pf-knowledge-split">
      <div className="pf-knowledge-left">
        <SectionHeading n="04" en="Knowledge" title="多格式内容，如何真正可用">知识库不是静态文件夹，而是内容进入、解析、组织、对话、追溯和分享的工作空间。</SectionHeading>
        <div className="pf-knowledge-flow">
          {[["01", "UPLOAD", "上传", "文件或文件夹"], ["02", "PARSE", "解析", "识别内容与状态"], ["03", "ORGANISE", "组织", "层级、标签与筛选"], ["04", "ASK", "提问", "选择参考范围"], ["05", "TRACE", "追溯", "回答回到来源"]].map((x) => <article key={x[0]}><span>{x[0]} / {x[1]}</span><strong>{x[2]}</strong><small>{x[3]}</small></article>)}
        </div>
      </div>
      <div className="pf-content pf-knowledge-media"><InterfaceCarousel eyebrow="REAL INTERFACE / KNOWLEDGE SPACES" slides={knowledgeSlides} /></div>
    </section>

    <section id="pf-05" className="pf-section pf-tier-section pf-tier-split">
      <div className="pf-tier-left">
        <SectionHeading n="05" en="Business rules" title="一套规则，连接权限与成本">订阅是整个产品的权限底座。复杂条款围绕三类核心用户组织，使每一次使用都可以被计量、限制和终止。</SectionHeading>
        <div className="pf-tier-tabs" role="tablist" aria-label="核心用户角色">{tierData.map((item, i) => <button role="tab" aria-selected={tier === i} onClick={() => setTier(i)} key={item.id}><span>{item.name}</span><small>{item.who}</small></button>)}</div>
        <motion.div className="pf-tier-detail" key={activeTier.id} initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }}>
          <div><span>{activeTier.name}</span><h3>{activeTier.summary}</h3><p>{activeTier.note}</p></div><ul>{activeTier.rights.map(x => <li key={x}>{x}</li>)}</ul>
        </motion.div>
      </div>
      <div className="pf-content pf-tier-media">
        <figure className="pf-feature-figure"><img loading="lazy" decoding="async" src="/perfects/agent-analytics.png" alt="智能体数据分析与运营界面" /><figcaption><span>REAL INTERFACE / CREATOR ANALYTICS</span><strong>把调用、对话与用户状态转化为可持续运营的信息。</strong></figcaption></figure>
      </div>
    </section>

    <section id="pf-06" className="pf-section pf-touchpoint-section pf-touchpoint-split">
      <div className="pf-touchpoint-left">
        <SectionHeading n="06" en="Touchpoints" title="从桌面端，延伸到微信">桌面端承担创建、配置和运营；小程序承担低门槛访问与即时使用。两端通过同一套智能体、权限和订阅状态保持连续。</SectionHeading>
        <figure className="pf-feature-figure pf-feature-figure-chat"><img loading="lazy" decoding="async" src="/perfects/agent-chat-desktop.png" alt="桌面端智能体对话界面" /><figcaption><span>DESKTOP / CONVERSATION</span><strong>在桌面端延续知识库上下文与任务对话。</strong></figcaption></figure>
      </div>
      <div className="pf-mobile-gallery" aria-label="微信小程序主要界面">
          <figure><img loading="lazy" decoding="async" src="/perfects/mobile-market.png" alt="小程序智能体广场界面" /><figcaption><span>01 / DISCOVER</span><strong>智能体广场</strong></figcaption></figure>
          <figure><img loading="lazy" decoding="async" src="/perfects/mobile-agent.png" alt="小程序智能体详情界面" /><figcaption><span>02 / UNDERSTAND</span><strong>智能体详情</strong></figcaption></figure>
          <figure><img loading="lazy" decoding="async" src="/perfects/mobile-agent-chat.png" alt="小程序智能体对话展开界面" /><figcaption><span>03 / USE</span><strong>对话与使用</strong></figcaption></figure>
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
