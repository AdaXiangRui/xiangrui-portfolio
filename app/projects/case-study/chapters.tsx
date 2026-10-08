
'use client'


import {Localize} from "@/components/site-language"
import { ChapterRail } from "@/components/chapter-rail"
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { CarFront, MapPin } from 'lucide-react'
import { auraChapters, type Chapter } from './data'
import './chapters.css'

function Reveal({ children, className = '' }: {children:ReactNode; className?:string}) {
  const reduced = useReducedMotion()
  return <Localize><motion.div className={className} initial={{opacity:0,y:reduced?0:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:reduced?0:.6,ease:'easeOut'}}>{children}</motion.div></Localize>
}

function Sequence({steps}:{steps:NonNullable<Chapter['steps']>}) {
  const [active,setActive]=useState(0)
  return <Localize><div className="case-sequence"><div className="case-step-list" role="tablist" aria-label="Explore the sequence">{steps.map((step,i)=><button key={step.title} type="button" role="tab" aria-selected={active===i} onClick={()=>setActive(i)}><span>{String(i+1).padStart(2,'0')}</span>{step.title}</button>)}</div><div className="case-step-panel"><span className="case-large-number">{String(active+1).padStart(2,'0')}</span><motion.div key={active} initial={{opacity:0}} animate={{opacity:1}}><h3>{steps[active].title}</h3><p>{steps[active].text}</p></motion.div></div></div></Localize>
}

function AuraChapters() {
  const [interventionLevel,setInterventionLevel]=useState(0)
  const context=auraChapters[0]
  const journey=auraChapters[1]
  const insight=auraChapters[2]
  const levels=auraChapters[3]
  const hierarchy=auraChapters[4]
  const interfaceChapter=auraChapters[5]
  const technicalChapter=auraChapters[6]
  const exhibitionChapter=auraChapters[7]
  const futureChapter=auraChapters[8]
  return <Localize><div className="case-chapters case-aura">
    <ChapterRail>{auraChapters.map(c=><a key={c.id} href={`#aura-${c.id}`}>{c.label}</a>)}</ChapterRail>
    <AuraContext chapter={context}/>
    <AuraJourney chapter={journey}/>
    <AuraSynthesis chapter={insight}/>
    <AuraIntervention chapter={levels} active={interventionLevel} onActiveChange={setInterventionLevel}/>
    <AuraHierarchy chapter={hierarchy} active={interventionLevel} onActiveChange={setInterventionLevel}/>
    <AuraInterface chapter={interfaceChapter}/>
    <AuraTechnical chapter={technicalChapter}/>
    <AuraExhibition chapter={exhibitionChapter}/>
    <AuraFuture chapter={futureChapter}/>
  </div></Localize>
}

const automationLevels=[['L0','No automation'],['L1','Driver assistance'],['L2','Partial automation'],['L3','Conditional automation'],['L4','High automation'],['L5','Full automation']]

function AuraContext({chapter}:{chapter:Chapter}){
  const [answer,setAnswer]=useState<'manual'|'automated'|null>(null)
  return <Localize><section className="aura-context" id="aura-context">
    <div className="aura-context-head"><span className="case-eyebrow">{chapter.label}</span><h2>When the car does more, do we stay alert?</h2><p>{chapter.intro}</p></div>
    <div className="aura-levels" aria-label="Driving automation levels">{automationLevels.map(([level,label])=><div className={level==='L3'?'is-current':''} key={level}><b>{level}</b><span>{label}</span>{level==='L3'&&<i aria-label="Current project focus"/>}</div>)}</div>
    <div className="aura-question">
      <span>A quick question</span>
      <h3>Which makes fatigue appear sooner: manual driving or highly automated driving?</h3>
      <div className="aura-answer-buttons"><button type="button" aria-pressed={answer==='manual'} onClick={()=>setAnswer('manual')}>Manual driving</button><button type="button" aria-pressed={answer==='automated'} onClick={()=>setAnswer('automated')}>Highly automated driving</button></div>
    </div>
    {answer&&<motion.div className={`aura-fatigue-answer is-${answer}`} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} aria-live="polite">
      <p className="aura-answer-line">{answer==='automated'?<><strong>Correct.</strong> Highly automated driving can make fatigue appear sooner because low stimulation and long inactive periods reduce engagement.</>:<><strong>Not quite.</strong> The research found that fatigue indicators appeared sooner during highly automated driving than during manual driving.</>}</p>
      <div className="aura-fatigue-table" role="table" aria-label="Manual and automated driving fatigue comparison">
        <div className="aura-table-row aura-table-head" role="row"><span role="columnheader">Comparison</span><span role="columnheader">Manual driving</span><span role="columnheader">Highly automated driving</span></div>
        <div className="aura-table-row" role="row"><b role="rowheader">Typical demand</b><span>Active control, steering, braking and sustained task involvement</span><span>Monitoring, long inactive periods and readiness to take control</span></div>
        <div className="aura-table-row" role="row"><b role="rowheader">Common fatigue pattern</b><span>Active fatigue from workload; passive fatigue on monotonous roads</span><span>Passive fatigue from low stimulation and reduced involvement</span></div>
        <div className="aura-table-row aura-table-result" role="row"><b role="rowheader">Observed onset</b><span><strong>≈ 40 min</strong><small>Comparable indicators mainly with sleep deprivation</small></span><span><strong>15–35 min</strong><small>Facial indicators of fatigue</small></span></div>
      </div>
      <p className="aura-source">Source: Vogelpohl, T., Kühn, M., Hummel, T. & Vollrath, M. (2019). <a href="https://doi.org/10.1016/j.aap.2018.03.013" target="_blank" rel="noreferrer">Asleep at the automated wheel—Sleepiness and fatigue during highly automated driving ↗</a></p>
    </motion.div>}
  </section></Localize>
}

const auraJourneyImages=['/aura/Userjourney-01.png','/aura/Userjourney-02.png','/aura/Userjourney-03.png','/aura/UserJourney-04.png','/aura/Userjourney-05.png']
const auraJourneyMetrics=[
  {energy:5,satiety:4,clarity:5,traffic:5},
  {energy:4,satiety:4,clarity:5,traffic:4},
  {energy:3,satiety:3,clarity:4,traffic:4},
  {energy:2,satiety:1,clarity:3,traffic:3},
  {energy:1,satiety:2,clarity:2,traffic:1},
]
const metricLabels:[keyof typeof auraJourneyMetrics[number],string][]=[['energy','Energy'],['satiety','Satiety'],['clarity','Visual clarity'],['traffic','Traffic ease']]
function AuraJourney({chapter}:{chapter:Chapter}){
  const [active,setActive]=useState(0)
  const steps=chapter.steps??[]
  const step=steps[active]
  const metrics=auraJourneyMetrics[active]
  return <Localize><section className="aura-journey" id="aura-journey">
    <div className="aura-journey-heading"><span className="case-eyebrow">{chapter.label}</span><h2>{chapter.title}</h2><div className="aura-route-summary" aria-label="San Francisco to Los Angeles, six hours and thirty minutes"><span><MapPin aria-hidden="true"/>San Francisco</span><i/><strong><CarFront aria-hidden="true"/>6 h 30 min</strong><i/><span><MapPin aria-hidden="true"/>Los Angeles</span></div></div>
    <div className="aura-journey-content">
      <div className="aura-journey-tabs" role="tablist" aria-label="Journey stages">{steps.map((item,i)=><button key={item.title} type="button" role="tab" aria-selected={active===i} onClick={()=>setActive(i)}><span>{String(i+1).padStart(2,'0')}</span>{item.title}</button>)}</div>
      <motion.figure key={active} initial={{opacity:0}} animate={{opacity:1}}><Image src={auraJourneyImages[active]} alt={`${step.title} journey map`} width={2600} height={1022} priority={active===0}/><figcaption className="aura-journey-metrics">{metricLabels.map(([key,label])=><div key={key}><span>{label}</span><div className="aura-stars" aria-label={`${label}: ${metrics[key]} out of 5`}>{[1,2,3,4,5].map(star=><i className={star<=metrics[key]?'is-on':''} key={star}>★</i>)}</div></div>)}</figcaption></motion.figure>
    </div>
  </section></Localize>
}

const synthesisMoments=[
  {rank:'Top 1',title:'Discover surprises',image:'/aura/surprise.png',alt:'Unexpected road-trip discoveries including a puppy, seaside view and roadside strawberries'},
  {rank:'Top 2',title:'Sing fitting music together',image:'/aura/music.png',alt:'Road-trip music and playlist exploration'},
]
function AuraSynthesis({chapter}:{chapter:Chapter}){
  const [active,setActive]=useState(0)
  const moment=synthesisMoments[active]
  return <Localize><section className="aura-synthesis" id="aura-insight">
    <div className="aura-synthesis-left">
      <div className="case-heading"><span className="case-eyebrow">{chapter.label}</span><h2>{chapter.title}</h2></div>
      <span className="aura-happiest-label">The happiest moments</span>
      <div className="aura-happy-tabs" role="tablist" aria-label="Happiest journey moments">{synthesisMoments.map((item,i)=><button type="button" role="tab" aria-selected={active===i} onClick={()=>setActive(i)} key={item.title}><b>{item.rank}</b><span>{item.title}</span></button>)}</div>
      <motion.figure className="aura-happy-visual" key={active} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}><Image src={moment.image} alt={moment.alt} width={1500} height={920}/></motion.figure>
    </div>
    <div className="aura-synthesis-system">
      <div className="aura-system-points" aria-label="Research about surprise and music">
        <article><span>About surprise</span><p>Travel becomes memorable through unpredictable events and moments. Research suggests that uncertain positive outcomes can create stronger positive feelings than fully predictable ones.</p><small>Botterill, 1987 · Wilson et al., 2005 · Tung &amp; Ritchie, 2011</small></article>
        <article><span>About music</span><p>Listening to or playing music supports projective identification: people attach personal meaning to sound, making music an emotional carrier within a shared cabin.</p><small>Losseff, 2011</small></article>
      </div>
      <div className="aura-system-title"><span>System direction</span><h3>An anti-fatigue system</h3></div>
      <Image className="aura-system-map" src="/aura/system-map.png" alt="Surprise uses music as a carrier to actively reach the driver and passengers" width={2201} height={740}/>
      <div className="aura-system-explanation"><h3>Surprise cannot appear alone.</h3><p>It needs a carrier that can reach the driver and passengers without demanding more visual attention. Music is the most promising carrier identified in this project: it is shared, immediate and able to change the cabin atmosphere. The system therefore translates moments of surprise into an active musical response for everyone in the car.</p></div>
    </div>
  </section></Localize>
}

function AuraIntervention({chapter,active,onActiveChange}:{chapter:Chapter;active:number;onActiveChange:(value:number)=>void}){
  const [showPerclos,setShowPerclos]=useState(false)
  const steps=chapter.steps??[]
  const step=steps[active]
  const perclosValues=['PERCLOS < 15','15 ≤ PERCLOS < 20','20 ≤ PERCLOS < 30','30 ≤ PERCLOS < 50','PERCLOS ≥ 50']
  return <Localize><section className="aura-intervention" id="aura-levels">
    <div className="aura-intervention-heading"><span className="case-eyebrow">{chapter.label}</span><h2>{chapter.title}</h2></div>
    <div className="aura-intervention-content">
      <p className="aura-intervention-intro">The concept uses <button type="button" className="aura-perclos-term" aria-expanded={showPerclos} onClick={()=>setShowPerclos(value=>!value)}>PERCLOS</button>—eyelid closure over time—as an input for fatigue classification. The proposed response progresses from music to tactile cues, then to an alert and a suggestion to stop.</p>
      {showPerclos&&<motion.aside className="aura-perclos-info" initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} aria-live="polite">
        <span className="aura-perclos-kicker">What is PERCLOS?</span>
        <h3>Percentage of eyelid closure over the pupil over time.</h3>
        <p className="aura-perclos-description">It measures how much of an observation period the pupil is covered by the eyelid. A higher percentage means the eyes remain closed for longer and can indicate increasing drowsiness. Aura uses the five ranges below to select an appropriate intervention level.</p>
        <Image className="aura-perclos-image" src="/aura/PERCLOS-1.png" alt="Open and closed eye measurements used to calculate PERCLOS" width={478} height={310}/>
        <Image className="aura-perclos-image" src="/aura/PERCLOS-2.png" alt="PERCLOS graph comparing drowsy and non-drowsy states" width={822} height={462}/>
        <small>Reference: Park, I., Ahn, J. &amp; Byun, H. (2006). Efficient Measurement of Eye Blinking under Various Illumination Conditions.</small>
      </motion.aside>}
      <div className="aura-level-explorer">
        <div className="aura-half-pyramid" role="tablist" aria-label="Fatigue intervention levels">{steps.map((item,i)=><button type="button" role="tab" aria-selected={active===i} onClick={()=>onActiveChange(i)} key={item.title} style={{width:`${58+i*10.5}%`}}><b>{String(i+1).padStart(2,'0')}</b><span>{item.title}</span><i aria-hidden="true"/></button>)}</div>
        <motion.article className="aura-level-detail" key={active} initial={{opacity:0,x:18}} animate={{opacity:1,x:0}}><span>Level {String(active+1).padStart(2,'0')}</span><h3>{step.title}</h3><button type="button" className="aura-perclos-value" aria-expanded={showPerclos} onClick={()=>setShowPerclos(value=>!value)}>{perclosValues[active]}</button><p>{step.text}</p></motion.article>
      </div>
      {chapter.note&&<p className="aura-intervention-note">{chapter.note}</p>}
    </div>
  </section></Localize>
}

const hierarchyLevels=[
  {name:'Good',perclos:'PERCLOS < 15',summary:'Observe only',responses:['Continuous fatigue monitoring'],parameters:['Baseline state','No intervention']},
  {name:'Mild',perclos:'15 ≤ PERCLOS < 20',summary:'Music awakening · Lv1',responses:['Introduce a noticeable music change'],parameters:['Tempo 80–100 BPM','Intensity 50–60 dB']},
  {name:'Moderate',perclos:'20 ≤ PERCLOS < 30',summary:'Music awakening · Lv2',responses:['Reshape the listening experience'],parameters:['Tempo 100–150 BPM','Intensity 60–70 dB','Familiarity > 5 plays','Vocal content 50–70%']},
  {name:'Severe',perclos:'30 ≤ PERCLOS < 50',summary:'Multimodal awakening · Lv3',responses:['Music awakening Lv3','Steering-wheel vibration','Driving nudge'],parameters:['Tempo > 150 BPM','Intensity 70–80 dB','Familiarity > 20 plays','Vocal content > 70%']},
  {name:'Extreme',perclos:'PERCLOS ≥ 50',summary:'Safety response',responses:['Immediate alert','Parking suggestion','Nearby stopping-place recommendation'],parameters:['Music intervention ends','Prioritise stopping safely']},
]

const musicFactors=[
  {name:'Valence',group:'Semantic feature',definition:'The emotional character of a piece and its effect on the listener.',direction:'Positive > negative',source:'AI recognition',levels:[1,2,3]},
  {name:'Familiarity',group:'Semantic feature',definition:'How well the listener already knows the piece, including repeated listening history.',direction:'Familiar > new',source:'Past listening data',levels:[2,3]},
  {name:'Tempo',group:'Temporal feature',definition:'The speed or pace of the music, measured in beats per minute.',direction:'High tempo > low tempo',source:'AI recognition',levels:[1,2,3]},
  {name:'Intensity',group:'Spatial feature',definition:'The perceived energy and volume of the music inside the cabin.',direction:'High volume > low volume',source:'In-car adjustment',levels:[1,2,3]},
  {name:'Rhythm stability',group:'Temporal feature',definition:'The consistency and regularity of musical timing.',direction:'Regular > irregular',source:'AI recognition',levels:[2,3]},
  {name:'Vocal content',group:'Acoustic feature',definition:'The presence and proportion of lyrics or singing in the selected track.',direction:'More vocal > less vocal',source:'AI recognition',levels:[2,3]},
]

const musicTableRows=[
  ['Musical Form','Semantic Features','Valence','Positive > Negative','AI Recognition'],
  ['Musical Form','Semantic Features','Familiarity','Familiar > New','Past Data'],
  ['Musical Style','Temporal Spatial Features','Tempo','High tempo > Low tempo','AI Recognition'],
  ['Musical Style','Temporal Spatial Features','Intensity','High volume > Low volume','In-car Adjustment'],
  ['Musical Style','Temporal Spatial Features','Rhythm Stability','Regularity > Irregularity','AI Recognition'],
  ['Emotional Connotation','Acoustic Features','Pitch','No significant effect','—'],
  ['Emotional Connotation','Acoustic Features','Vocal Content','More Vocal > Less Vocal','AI Recognition'],
]

function AuraHierarchy({chapter,active,onActiveChange}:{chapter:Chapter;active:number;onActiveChange:(value:number)=>void}){
  const [activeChannel,setActiveChannel]=useState<'music'|'vibration'>('music')
  const selectIntervention=(channel:'music'|'vibration',level:number)=>{
    setActiveChannel(channel)
    onActiveChange(level)
  }
  return <Localize><section className="aura-hierarchy" id="aura-hierarchy">
    <aside className="aura-hierarchy-heading"><span className="case-eyebrow">{chapter.label}</span><h2><span>Adaptive</span><span>Intervention</span></h2>
      <nav className="aura-intervention-list" aria-label="Interventions by fatigue level">
        <div><h3>Lv1: Mild Fatigue</h3><button type="button" className={activeChannel==='music'?'is-series':''} onClick={()=>selectIntervention('music',1)}><span aria-hidden="true">♫</span>Music Awakening <b>Lv1</b></button></div>
        <div><h3>Lv2: Moderate Fatigue</h3><button type="button" className={activeChannel==='music'?'is-series':''} onClick={()=>selectIntervention('music',2)}><span aria-hidden="true">♫</span>Music Awakening <b>Lv2</b></button><button type="button" className={activeChannel==='vibration'?'is-series':''} onClick={()=>selectIntervention('vibration',2)}><Image src="/aura/hierarchy/slight-vibration.svg" alt="" width={28} height={28}/>Vibration Awakening</button></div>
        <div><h3>Lv3: Severe Fatigue</h3><button type="button" className={activeChannel==='music'?'is-series':''} onClick={()=>selectIntervention('music',3)}><span aria-hidden="true">♫</span>Music Awakening <b>Lv3</b></button><button type="button" className={activeChannel==='vibration'?'is-series':''} onClick={()=>selectIntervention('vibration',3)}><Image src="/aura/hierarchy/strong-vibration.svg" alt="" width={28} height={28}/>Vibration Driving Hint</button><button type="button" disabled aria-disabled="true"><span aria-hidden="true">◉</span>Driving Nudge</button></div>
      </nav>
    </aside>
    <div className="aura-hierarchy-content">
      <div className="aura-channel-buttons" role="tablist" aria-label="Intervention channels">
        <button type="button" role="tab" aria-selected={activeChannel==='music'} onClick={()=>selectIntervention('music',active>0&&active<4?active:1)}><b>Primary</b><span>Music intervention</span><i>Open details ↘</i></button>
        <button type="button" role="tab" aria-selected={activeChannel==='vibration'} onClick={()=>selectIntervention('vibration',active===2||active===3?active:3)}><b>Auxiliary · Severe only</b><span>Vibration intervention</span><i>Open details ↘</i></button>
      </div>
      <motion.div className={`aura-channel-panel is-${activeChannel}`} key={activeChannel} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
        {activeChannel==='music'?<>
          <div className="aura-music-reference">
            <div className="aura-music-left">
              <Image className="aura-music-elements-new" src="/aura/hierarchy/music-elements-new.png" alt="Five adjustable music elements: valence, familiarity, tempo, intensity and vocal content" width={2412} height={408}/>
              <div className="aura-music-table" role="table" aria-label="Measurement units for music factors and detection">
                <Image className="aura-music-table-frame" src="/aura/hierarchy/music-table-frame.png" alt="" width={827} height={458} loading="eager"/>
                <div className="aura-music-table-values">{musicTableRows.map((row,index)=><div className="aura-music-table-row" role="row" key={`${row[2]}-${index}`}><span>{row[0]}</span><i aria-hidden="true"/><span role="rowheader">{row[2]}</span><span>{row[3]}</span><span>{row[4]}</span></div>)}</div>
              </div>
              <p className="aura-panel-explanation">Each element creates a different degree of stimulation. Aura changes these inputs through music switches, pauses and alarms to produce a response proportionate to the detected fatigue level. Pitch remains unchanged because the cited study reported no significant effect.</p>
              <small className="aura-research-source">Source: Orsini, F., Baldassa, A., Grassi, M., Cellini, N. &amp; Rossi, R. (2024). Music as a countermeasure to fatigue: A driving simulator study. Transportation Research Part F, 103, 290–305.</small>
            </div>
            <Image className="aura-music-levels-new" src="/aura/hierarchy/music-levels-new.png" alt="Music awakening settings for mild, moderate and severe fatigue" width={946} height={1500}/>
          </div>
        </>:<><Image className="aura-vibration-full" src="/aura/hierarchy/vibration-full.png" alt="Vibration intervention system showing slight and strong steering-wheel feedback" width={1532} height={610}/><div className="aura-vibration-why"><Image src="/aura/hierarchy/no-visual.png" alt="Visual attention overload compared with non-distracting audio and tactile feedback" width={1074} height={322}/><p>Visual alerts can compete with an already demanding view of the road. Audio and tactile feedback heighten alertness without diverting the gaze. Slight pulses support the music; stronger directional vibration is reserved for moments when driving safety needs a more immediate physical cue.</p></div></>} 
      </motion.div>
    </div>
  </section></Localize>
}

function AuraInterface({chapter}:{chapter:Chapter}){
  return <Localize><section className="aura-interface" id="aura-interface">
    <div className="aura-interface-head"><div><span className="case-eyebrow">{chapter.label}</span><h2><span>A presence</span><span>within the cabin.</span></h2></div><p>{chapter.intro}</p></div>
    <div className="aura-interface-body"><Image src="/aura/interface.png" alt="Aura dashboard and central in-car display interface" width={2222} height={1020}/><div className="aura-interface-notes">{chapter.cards?.map((card,i)=><article key={card.title}><span>{String(i+1).padStart(2,'0')}</span><h3>{card.title}</h3><p>{card.text}</p></article>)}</div></div>
  </section></Localize>
}

const technicalViews={
  software:[
    {title:'Bemfa cloud',text:'Python sends mode changes through Bemfa to connect the screen and vibration controller.',images:['/aura/technical/bemfa-subscribe.png','/aura/technical/bemfa-code.png','/aura/technical/bemfa-vibration.png']},
    {title:'Mode button',text:'Five inputs switch the prototype between fatigue states and the final journey summary.',images:['/aura/technical/mode-button.png']},
    {title:'Interactive video',text:'Prepared road videos create selectable driving conditions for the exhibition demo.',images:['/aura/technical/interactive-video.png','/aura/technical/video-button-map.png']},
  ],
  hardware:[
    {title:'Steering wheel',text:'A printed steering-wheel model carries the vibration modules and directional cues.',images:['/aura/technical/wheel-model-1.png','/aura/technical/wheel-model-2.png','/aura/technical/wheel-model-3.png','/aura/technical/wheel-model-4.png']},
    {title:'Fatigue controls',text:'Five physical buttons make each fatigue state easy to trigger during testing.',images:['/aura/technical/button-full.png','/aura/technical/level-1.png','/aura/technical/level-2.png','/aura/technical/level-3.png','/aura/technical/level-4.png','/aura/technical/level-5.png']},
  ],
} as const

function AuraTechnical({chapter}:{chapter:Chapter}){
  const [active,setActive]=useState<'software'|'hardware'>('software')
  const sectionRef=useRef<HTMLElement|null>(null)
  useEffect(()=>{
    const update=()=>{
      const section=sectionRef.current
      if(!section||!window.matchMedia('(min-width: 1051px)').matches)return
      const rect=section.getBoundingClientRect()
      const travel=Math.max(1,rect.height-window.innerHeight)
      const progress=Math.min(1,Math.max(0,-rect.top/travel))
      setActive(progress>=.48?'hardware':'software')
    }
    update()
    window.addEventListener('scroll',update,{passive:true})
    window.addEventListener('resize',update)
    return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update)}
  },[])
  const chooseLayer=(layer:'software'|'hardware')=>{
    setActive(layer)
    const section=sectionRef.current
    if(section&&window.matchMedia('(min-width: 1051px)').matches){
      const top=window.scrollY+section.getBoundingClientRect().top+(layer==='hardware'?section.offsetHeight-window.innerHeight:0)
      window.scrollTo({top,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})
    }
  }
  return <Localize><section ref={sectionRef} className="aura-technical" id="aura-prototype">
    <aside className="aura-technical-heading"><span className="case-eyebrow">{chapter.label}</span><h2>{chapter.title}</h2><p>{chapter.intro}</p><div className="aura-technical-tabs" role="tablist" aria-label="Technical implementation layers"><button type="button" role="tab" aria-selected={active==='software'} onClick={()=>chooseLayer('software')}>Software</button><button type="button" role="tab" aria-selected={active==='hardware'} onClick={()=>chooseLayer('hardware')}>Hardware</button></div></aside>
    <div className="aura-technical-stage">
      <div className="aura-technical-collage is-software">{technicalViews.software.map((item,i)=><article key={item.title} className={`item-${i+1}`}><div className="aura-technical-media">{item.images.map((src,j)=><Image key={src} src={src} alt="" width={520} height={360} className={`media-${j+1}`}/>)}</div><div className="aura-technical-card-copy"><span>{String(i+1).padStart(2,'0')}</span><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div>
      <figure className="aura-technical-photo"><Image src="/aura/technical/working-demo.png" alt="Aura working prototype with laptop, steering wheel and fatigue controls" width={1452} height={880} loading="eager"/></figure>
      <div className="aura-technical-collage is-hardware">{technicalViews.hardware.map((item,i)=><article key={item.title} className={`item-${i+1}`}><div className="aura-technical-media">{item.images.map((src,j)=><Image key={src} src={src} alt="" width={520} height={360} className={`media-${j+1}`}/>)}</div><div className="aura-technical-card-copy"><span>{String(i+1).padStart(2,'0')}</span><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div>
    </div>
  </section></Localize>
}

function AuraExhibition({chapter}:{chapter:Chapter}){
  return <Localize><section className="aura-exhibition" id="aura-exhibition">
    <div className="aura-exhibition-copy"><span className="case-eyebrow">{chapter.label}</span><h2>{chapter.title}</h2><p className="aura-exhibition-intro">{chapter.intro}</p>
      <blockquote><span>“I could clearly sense the differences in different musical layers,</span><span>and the sudden shifts made me feel <strong>tense</strong> and much more <strong>alert</strong> all at once.</span><span>It’s a very intriguing design. I love it!”</span></blockquote>
      <div className="aura-participant"><div><span>Representative participant</span><h3>Runming Fan</h3><p>22-year-old design student<br/>2 years of driving experience</p><a className="aura-demo-link" href="https://youtu.be/Bt5HFo4xYw4" target="_blank" rel="noreferrer">Watch the complete demo ↗</a></div><Image src="/aura/exhibition/prototype-user.png" alt="Participant testing Aura with the steering wheel and central display" width={760} height={558}/></div>
    </div>
    <figure className="aura-exhibition-board"><Image src="/aura/exhibition/exhibition-prototype.png" alt="Aura exhibition board, steering wheel, central display and selectable road conditions" width={1268} height={1052}/></figure>
  </section></Localize>
}

function AuraFuture({chapter}:{chapter:Chapter}){
  return <Localize><section className="aura-future" id="aura-future">
    <header><span className="case-eyebrow">{chapter.label}</span><h2>Future Directions</h2></header>
    <div className="aura-future-grid">
      <article className="aura-future-music"><span>01 / Music ecosystem</span><h3>Integration with music platforms</h3><p>With permission, listening history could help Aura prepare a tailored driving mode—selecting familiar, positive tracks and adjusting the intervention as fatigue changes.</p><div className="aura-future-tags"><b># Custom-made</b><b># Boost alertness</b><b># Driving pleasure</b></div><Image className="aura-future-music-asset" src="/aura/future/music-partner.png" alt="Future music-platform partnership and personalised driving mode" width={688} height={352}/></article>
      <article className="aura-future-testing"><div><span>02 / Real-world validation</span><h3><span>Test the complete</span><br/><span>system.</span></h3><p>A full-scale simulator or vehicle study would test recognition accuracy, intervention timing and the relationship between feedback and actual driver fatigue.</p></div><Image src="/aura/future/cabin-rig-new.png" alt="Proposed full-scale driving rig for future Aura testing" width={1344} height={880}/></article>
    </div>
  </section></Localize>
}

const problemCards = [
  {title:'Information explosion',text:'Constant input makes filtering difficult and weakens the efficiency of remembering.',image:'/quipu/new-assets/问题1信息爆炸.png'},
  {title:'Superficial connections',text:'Frequent contact can still feel shallow when communication leaves no tangible trace.',image:'/quipu/new-assets/superficial connections.png'},
  {title:'Emotional simplification',text:'Standardised reactions compress complex emotions into a small set of convenient signals.',image:'/quipu/new-assets/emotional simplification.png'},
]

const inspirationCards = [
  {src:'/quipu/1-1.png',title:'The ancient language of knots',text:'Historical records and archaeological findings suggest that people used knotting from at least the Neolithic era. It endured into the last century and appeared across China, Japan, Polynesia and other regions.',className:'i-one'},
  {src:'/quipu/1-3.png',title:'Quipu before writing',text:'Quipu emerged after spoken language and before writing. Number, spacing and colour turned knots into a physical system for recording data and relationships.',className:'i-two'},
  {src:'/quipu/1-4.png',title:'A tactile record',text:'Modern knotting preserves the slow, bodily act of making a mark. The trace is touched, changed and carried rather than stored at a distance.',className:'i-three'},
  {src:'/quipu/1-2.png',title:'Arrival · semiotics',text:'Arrival frames language as a system that reshapes how people understand time and one another. Its symbols inspired a form of communication beyond literal speech.',className:'i-four'},
  {src:'/quipu/1-5.png',title:'Avatar · spiritual attachment',text:'The Tree of Souls gives collective memory a sacred physical source. It connects personal experience with ancestry, place and shared belief.',className:'i-five'},
]

const directions = [
  {icon:'/quipu/new-assets/semiotics.svg',title:'Semiotics',text:'Knot, colour and position become a language before written language.'},
  {icon:'/quipu/new-assets/spirit.svg',title:'Emotional connection',text:'A slow physical action gives personal stories weight, texture and duration.'},
  {icon:'/quipu/new-assets/media link icon.svg',title:'Media link',text:'The installation connects body, object, speech and projected response.'},
]

const interactionSteps = [
  {title:'Take a cord',text:'Choose an auxiliary rope. Its embedded RFID tag identifies the beginning of a new interaction.',images:['/quipu/new-assets/step1-1.png','/quipu/new-assets/step1-2.png']},
  {title:'Tie and speak',text:'Tie the cord onto the main rope while speaking a thought, feeling or memory.',images:['/quipu/new-assets/step2-1.png','/quipu/new-assets/step2-2.png','/quipu/new-assets/step2-3.png']},
  {title:'Wait and read',text:'The system interprets the input and returns a projected response to the participant and the shared space.',images:['/quipu/new-assets/step3-1.png','/quipu/new-assets/step3-2.png','/quipu/new-assets/step3-3.png']},
]
const interactionImageSizes:Record<string,[number,number]> = {
  '/quipu/new-assets/step1-1.png':[374,454], '/quipu/new-assets/step1-2.png':[816,454],
  '/quipu/new-assets/step2-1.png':[700,454], '/quipu/new-assets/step2-2.png':[374,454], '/quipu/new-assets/step2-3.png':[376,454],
  '/quipu/new-assets/step3-1.png':[672,454], '/quipu/new-assets/step3-2.png':[684,454], '/quipu/new-assets/step3-3.png':[374,454],
}

function QuipuInteraction() {
  const [active,setActive]=useState(0)
  const refs=useRef<(HTMLDivElement|null)[]>([])
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)setActive(Number((entry.target as HTMLElement).dataset.step))}),{rootMargin:'-34% 0px -44%',threshold:.18})
    refs.current.forEach(node=>node&&observer.observe(node))
    return()=>observer.disconnect()
  },[])
  return <Localize><section className="quipu-section quipu-interaction" id="quipu-interaction">
    <aside className="quipu-interaction-rail">
      <div className="quipu-section-head"><span>04 / Interaction</span><h2>A knot becomes a conversation.</h2></div>
      <div className="quipu-progress" aria-label="Interaction progress">{interactionSteps.map((step,i)=><a key={step.title} className={active===i?'is-active':''} href={`#quipu-step-${i+1}`}><b>{String(i+1).padStart(2,'0')}</b><span>{step.title}</span></a>)}</div>
    </aside>
    <div className="quipu-interaction-steps">{interactionSteps.map((step,i)=><div className="quipu-interaction-step" id={`quipu-step-${i+1}`} data-step={i} ref={node=>{refs.current[i]=node}} key={step.title}><div className="quipu-step-copy"><span>{String(i+1).padStart(2,'0')}</span><h3>{step.title}</h3><p>{step.text}</p></div><div className="quipu-step-images">{step.images.map((image,j)=>{const [width,height]=interactionImageSizes[image];return <Image key={image} src={image} alt={`${step.title} — view ${j+1}`} width={width} height={height} style={{flexGrow:width/height,flexBasis:0}}/>})}</div></div>)}</div>
  </section></Localize>
}

function SystemTable() {
  return <Localize><div className="quipu-system-table">
    <div className="quipu-system-ribbon"><span>HCI</span><span>IoT</span><span>GPT</span><span>NLP</span></div>
    <div className="system-table-head"><span>User Step</span><span>Communication: <b>Bemfa</b></span><span>Process</span></div>
    <div className="system-table-row"><strong>Take Auxiliary Rope</strong><span><span className="system-link"><em>RFID</em><i/><em>Python</em></span></span><b>Trigger</b></div>
    <div className="system-table-row"><strong>Start interacting</strong><span><span className="system-link"><em>Microphone</em><i/><em>Recognition</em></span><span className="system-link"><em>LED</em><i/><em>ESP32</em></span></span><b>Collect<br/>Guide</b></div>
    <div className="system-table-row"><strong>Wait for feedback</strong><span><span className="system-link"><em>Computer</em><i/><em>NLP</em></span><span className="system-link"><em>Projector</em><i/><em>HTML</em></span></span><b>Analysis<br/>Display</b></div>
  </div></Localize>
}

type TechSelection = 'rope'|'screen'|null
type TechFigureProps={src:string;title:string;note:string;width?:number;height?:number;className?:string}
function TechFigure({src,title,note,width=900,height=600,className=''}:TechFigureProps){
  return <Localize><figure className={`tech-figure ${className}`}><Image src={`/quipu/new-assets/${src}`} alt={title} width={width} height={height}/><figcaption><strong>{title}</strong><span>{note}</span></figcaption></figure></Localize>
}

function SensingBoard(){return <Localize><div className="quipu-tech-board sensing-board">
  <div className="tech-row tech-row-primary">
    <article className="tech-note-card"><span>Hardware RFID</span><h4>Reading a physical knot</h4><p>PR2026 tag technology gives each auxiliary rope a unique identity. Python reads and marks the tag, starts recording, and prevents the same rope from being recognised twice during one interaction.</p></article>
    <TechFigure src="Auxiliary Ropes.png" title="Auxiliary Ropes" note="RFID tags are embedded inside the removable cords." width={1148} height={1096}/>
    <TechFigure src="感应-rfid.png" title="RFID Tag Test" note="A tag becomes readable when the participant removes the cord from its insulated position." width={282} height={212}/>
  </div>
  <div className="tech-row tech-row-secondary">
    <div className="tech-mini-stack">
      <TechFigure src="感应-rfid4.png" title="Electronic Tags" note="Rewritten for each cord." width={319} height={239}/>
      <TechFigure src="感应-rfid5.png" title="PR2026 RFID Receiver" note="Receives the selected rope ID." width={284} height={261}/>
    </div>
    <TechFigure src="感应-rfid1.png" title="UHF RFID Writer" note="Writes and resets the electronic tag." width={406} height={268}/>
    <TechFigure src="感应-rfid2.png" title="UHF RFID Reader" note="Checks range and recognition status." width={820} height={536}/>
    <TechFigure src="感应-rfid3.png" title="Python Recognition Logic" note="Marks recognised tags and triggers the next step." width={820} height={844}/>
  </div>
</div></Localize>}

function TransmissionBoard(){return <Localize><div className="quipu-tech-board transmission-board">
  <div className="tech-row tech-row-primary transmission-hardware">
    <TechFigure src="传输-1.png" title="ESP32 Arduino" note="The IoT backbone that collects sensor data and communicates with the cloud." width={243} height={253}/>
    <TechFigure src="传输2.png" title="LED Lamp Controller" note="Bluetooth controls the fiber-optic lighting woven into the main rope." width={274} height={292}/>
    <TechFigure src="传输3.png" title="Plug-in Microphone" note="Embedded in the main rope and connected to the computer for recording." width={270} height={240}/>
  </div>
  <div className="tech-row tech-row-code">
    <TechFigure src="传输4.png" title="Bemfa Cloud" note="Transfers recognised values through the IoT layer." width={713} height={437}/>
    <TechFigure src="传输5.png" title="Colour Switching" note="Maps system responses to different light colours." width={661} height={581}/>
    <TechFigure src="传输6.png" title="Breathing Rates" note="Varies the rhythm of the fiber-optic light." width={661} height={485}/>
    <TechFigure src="传输7.png" title="Microphone Input" note="Captures speech and publishes it for processing." width={1280} height={1374}/>
  </div>
</div></Localize>}

function VisualizationBoard(){return <Localize><div className="quipu-tech-board visualization-board">
  <p className="visualization-intro">The language model summarises the spoken message. A web-based visualization translates it into changing words, colour and movement, then projects the result back into the shared space.</p>
  <TechFigure className="projector-figure" src="screen- projector.png" title="Epson EB-685Wi Projector" note="Projects the generated response back into the shared space." width={360} height={230}/>
  <div className="visualization-grid">
    <TechFigure src="screen - visual test1.png" title="Visual Style Exploration 01" note="Early tests of word density, colour and movement." width={726} height={332}/>
    <TechFigure src="screen - visual test 2.png" title="Visual Style Exploration 02" note="A darker projection test for stronger spatial contrast." width={726} height={332}/>
    <TechFigure src="screen - code.png" title="Language Model Processing" note="Generates keywords and colours from the spoken message." width={892} height={406}/>
    <TechFigure src="screen- code2.png" title="Web Visualization Code" note="Animates the processed words for projection." width={890} height={406}/>
  </div>
</div></Localize>}

function TechnologyPanel() {
  const [selection,setSelection]=useState<TechSelection>(null)
  const [ropeTab,setRopeTab]=useState<'sensing'|'transmission'>('sensing')
  return <Localize><div className="quipu-tech-layout">
    <div className="quipu-tech-left">
      <div className="quipu-section-head"><span>06 / Technology</span><h2>From sensing to expression.</h2><p>Select the rope or screen to explore how the installation senses, transmits and visualizes a participant’s message.</p></div>
      <div className="quipu-tech-map">
        <Image src="/quipu/new-assets/interactive-tech.svg" alt="Interactive technology overview" width={516} height={596}/>
        <button className={selection==='rope'?'tech-hotspot rope is-active':'tech-hotspot rope'} onClick={()=>setSelection('rope')}><span>Rope</span></button>
        <button className={selection==='screen'?'tech-hotspot screen is-active':'tech-hotspot screen'} onClick={()=>setSelection('screen')}><span>Screen</span></button>
      </div>
    </div>
    <div className="quipu-tech-detail">
      {!selection ? <div className="quipu-tech-empty"><span>Rope · Screen · Response</span><h3>A physical ritual supported by quiet technology.</h3><p>RFID, speech recognition, IoT communication and projection work together behind the interaction.</p><b>Try selecting an element on the left.</b></div> : <>
        <div className="quipu-tech-detail-head"><div><span>{selection==='rope'?'Sensing & transmission':'Visualization'}</span><h3>{selection==='rope'?'How the rope carries information':'How the screen returns meaning'}</h3></div>{selection==='rope'&&<div className="quipu-tech-tabs"><button className={ropeTab==='sensing'?'is-active':''} onClick={()=>setRopeTab('sensing')}>Sensing</button><button className={ropeTab==='transmission'?'is-active':''} onClick={()=>setRopeTab('transmission')}>Transmission</button></div>}</div>
        {selection==='rope'&&<p>{ropeTab==='sensing'?'RFID tags hidden in the auxiliary ropes identify the participant’s action while a microphone collects the spoken message.':'ESP32 and Bemfa connect recognition, light feedback and the software layer so the physical gesture can move through the system.'}</p>}
        {selection==='screen'?<VisualizationBoard/>:(ropeTab==='sensing'?<SensingBoard/>:<TransmissionBoard/>)}
      </>}
    </div>
  </div></Localize>
}

function QuipuInspiration() {
  return <Localize><section className="quipu-section quipu-inspiration-new" id="quipu-inspiration">
    <div className="quipu-inspiration-label">03 / Inspiration</div>
    <div className="quipu-inspiration-stage">{inspirationCards.map((item,i)=><motion.article className={`quipu-inspiration-card ${item.className}`} key={item.src} initial={{opacity:0,scale:.72,x:i%2?'-18%':'18%',y:'18%'}} whileInView={{opacity:1,scale:1,x:0,y:0}} viewport={{once:true,amount:.35}} transition={{duration:.75,delay:i*.1,ease:[.22,1,.36,1]}} whileHover={{scale:1.08,rotate:0,zIndex:30}}><Image src={item.src} alt={item.title} width={620} height={460}/><div><h3>{item.title}</h3><p>{item.text}</p></div></motion.article>)}</div>
  </section></Localize>
}

function MemoryTest() {
  const [choice,setChoice]=useState<'photo'|'uniform'|null>(null)
  return <Localize><div className="quipu-memory-content">
    <div className="quipu-memory-test">
      <span>A small memory test</span>
      <p>You are recalling graduation day ten years later. Which object brings the scene back more vividly: a group photo, or a uniform filled with handwritten names?</p>
      <div className="memory-options">
        <button type="button" aria-pressed={choice==='photo'} onClick={()=>setChoice('photo')}>A · Group photo</button>
        <button type="button" aria-pressed={choice==='uniform'} onClick={()=>setChoice('uniform')}>B · Uniform filled with names</button>
      </div>
    </div>
    {choice&&<motion.blockquote initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.38}}>
      <p>2D records contain more information, but why do they carry fewer memories, compared to 3D ones?</p>
      <p>{choice==='uniform'?'The uniform carries handwriting, touch, ownership and the imperfect traces left by many people. Humans, objects and memories become bound together through material presence.':'A photograph stores the scene clearly, yet its flat surface carries fewer tactile and relational traces than an object altered by the people who were there.'}</p>
      <cite>Freeman, L. A., Nienass, B., & Daniell, R. (2016). <i>Memory | Materiality | Sensuality.</i> Memory Studies, 9(1), 3–12. <a href="https://doi.org/10.1177/1750698015613969" target="_blank" rel="noreferrer">Read the source ↗</a></cite>
    </motion.blockquote>}
  </div></Localize>
}

const prototypeGroups = {
  material:{
    label:'Material and Knotting',
    text:'Material tests explored rope thickness, knot density and the balance between a soft tactile surface and a structure that could hold many individual traces.',
    images:[
      {src:'prototype1.png',width:226,height:382}, {src:'prototype1-1.png',width:150,height:191},
      {src:'prototype1-2.png',width:142,height:384}, {src:'prototype1-3.png',width:252,height:386},
      {src:'prototype1-4.png',width:312,height:384}, {src:'prototype1-5.png',width:556,height:384},
    ]
  },
  optics:{
    label:'Fiber Optics and Projection Testing',
    text:'Lighting and projection tests studied how fiber optics, colour and moving words could remain legible while still feeling integrated with the physical knots.',
    images:[
      {src:'prototype2.png',width:500,height:254}, {src:'prototype2-1.png',width:322,height:254},
      {src:'prototype2-2.png',width:386,height:254}, {src:'prototype2-3.png',width:320,height:352},
    ]
  }
} as const

function PrototypeGallery(){
  const [active,setActive]=useState<keyof typeof prototypeGroups>('material')
  const track=useRef<HTMLDivElement|null>(null)
  const group=prototypeGroups[active]
  const move=(direction:number)=>track.current?.scrollBy({left:direction*560,behavior:'smooth'})
  return <Localize><section className="quipu-section quipu-prototype" id="quipu-prototype">
    <div className="quipu-prototype-head">
      <div><span>07 / Prototype</span><h2>Making the interaction tangible.</h2></div>
      <div className="quipu-prototype-tabs" role="tablist" aria-label="Prototype tests">
        {(Object.keys(prototypeGroups) as (keyof typeof prototypeGroups)[]).map(key=><button key={key} role="tab" aria-selected={active===key} onClick={()=>setActive(key)}>{prototypeGroups[key].label}</button>)}
      </div>
    </div>
    <div className="quipu-prototype-summary"><h3>{group.label}</h3><p>{group.text}</p><div><button type="button" onClick={()=>move(-1)} aria-label="Previous prototype images">←</button><button type="button" onClick={()=>move(1)} aria-label="More prototype images">→</button></div></div>
    <div className="quipu-prototype-track" ref={track}>{group.images.map(image=><Image key={image.src} src={`/quipu/new-assets/${image.src}`} alt={`${group.label} test`} width={image.width} height={image.height}/>)}</div>
  </section></Localize>
}

function QuipuChapters() {
  return <Localize><div className="case-chapters case-quipu">
    <ChapterRail>
      <a href="#quipu-memory">01 / Memory clue</a>
      <a href="#quipu-problems">02 / Problems</a>
      <a href="#quipu-inspiration">03 / Inspiration</a>
      <a href="#quipu-direction">03 / Design direction</a>
      <a href="#quipu-interaction">04 / Interaction</a>
      <a href="#quipu-system">05 / System</a>
      <a href="#quipu-technology">06 / Technology</a>
      <a href="#quipu-prototype">07 / Prototype</a>
      <a href="#quipu-exhibition">08 / Exhibition</a>
    </ChapterRail>

    <section className="quipu-section quipu-memory-section" id="quipu-memory">
      <div className="quipu-section-head"><span>01 / Memory clue</span><h2>What makes a memory stay?</h2></div>
      <MemoryTest/>
    </section>

    <section className="quipu-section quipu-problems" id="quipu-problems">
      <div className="quipu-section-head"><span>02 / Problems</span><h2>What gets lost in digital communication?</h2></div>
      <div className="quipu-problem-grid">{problemCards.map((card,i)=><article key={card.title}><Image src={card.image} alt={card.title} width={900} height={900}/><div><span>{String(i+1).padStart(2,'0')}</span><h3>{card.title}</h3><p>{card.text}</p></div></article>)}</div>
    </section>

    <QuipuInspiration/>

    <section className="quipu-section quipu-direction" id="quipu-direction">
      <div className="quipu-section-head"><span>03 / Design direction</span><h2>A ritual for the digital age.</h2><p>An ancient physical gesture becomes an entry point to contemporary language processing, while technology remains behind the experience.</p></div>
      <div className="quipu-direction-list">{directions.map(item=><article key={item.title}><span className="quipu-direction-icon" style={{maskImage:`url("${item.icon}")`,WebkitMaskImage:`url("${item.icon}")`}}/><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div>
    </section>

    <QuipuInteraction/>

    <section className="quipu-section quipu-system" id="quipu-system">
      <div className="quipu-section-head"><span>05 / System</span><h2>A quiet system behind the ritual.</h2><p>The system links tactile input, recognition, language processing, lighting and projection without competing with the ritual itself.</p></div>
      <div className="quipu-system-layout"><figure><Image src="/quipu/new-assets/system map.png" alt="Quipu system map" width={1370} height={704}/></figure><SystemTable/></div>
    </section>

    <section className="quipu-section quipu-technology" id="quipu-technology">
      <TechnologyPanel/>
    </section>

    <PrototypeGallery/>

    <section className="quipu-section quipu-exhibition" id="quipu-exhibition">
      <div className="quipu-exhibition-head"><span>08 / Exhibition</span><h2>Individual stories. Collective memory.</h2><p>Visitors tied cords, narrated stories and watched the shared projection grow.</p></div>
      <div className="quipu-exhibition-row">
        <Image src="/quipu/new-assets/exhibition.png" alt="Quipu exhibition view 1" width={777} height={496}/>
        <Image src="/quipu/new-assets/exhibition3.png" alt="Quipu exhibition view 2" width={2050} height={1256}/>
        <Image src="/quipu/new-assets/exhibition4.png" alt="Quipu exhibition view 3" width={602} height={464}/>
      </div>
    </section>
  </div></Localize>
}

export default function CaseChapters({project}:{project:'aura'|'quipu'}) {
  return project==='quipu'?<Localize><QuipuChapters/></Localize>:<Localize><AuraChapters/></Localize>
}
