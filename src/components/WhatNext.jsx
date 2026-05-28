import { useState } from "react";
import { FadeIn } from "../hooks/useInView.jsx";
import CareerCard from "./whatnext/CareerCard.jsx";
import CareerQuiz from "./whatnext/CareerQuiz.jsx";
import { useTranslation } from "../data/translations.js";
import { AFTER_10TH, AFTER_12TH, MOTIVATIONAL_QUOTES } from "../data/whatNextData.js";

const STREAMS = [
  {key:"science",label:"Science",icon:"🔬",color:"#38bdf8",desc:"PCM / PCB path"},
  {key:"commerce",label:"Commerce",icon:"📊",color:"#34d399",desc:"Finance & Business"},
  {key:"arts",label:"Arts / Humanities",icon:"🎭",color:"#f472b6",desc:"Creative & Social"},
];

export default function WhatNext({ dark, lang }) {
  const t = useTranslation(lang);
  const [qualification, setQualification] = useState(null);
  const [stream, setStream] = useState(null);
  const [search, setSearch] = useState("");
  const [quoteIdx] = useState(() => Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));
  const quote = MOTIVATIONAL_QUOTES[quoteIdx];
  const careers = (() => { if (qualification==="10th") return AFTER_10TH; if (qualification==="12th"&&stream) return AFTER_12TH[stream]||[]; return []; })();
  const filtered = search.trim() ? careers.filter(c=>c.title.toLowerCase().includes(search.toLowerCase())||c.desc.toLowerCase().includes(search.toLowerCase())||c.careerScope.some(s=>s.toLowerCase().includes(search.toLowerCase()))) : careers;

  return (
    <section id="whatnext" style={{minHeight:"100vh",background:dark?"#040b1c":"#f8fafc",padding:"80px 2rem 120px"}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <FadeIn><div style={{textAlign:"center",marginBottom:72}}>
          <div style={{display:"inline-block",background:"linear-gradient(135deg,#38bdf822,#818cf822)",border:"1px solid #38bdf833",borderRadius:40,padding:"6px 20px",fontSize:12,fontWeight:700,color:"#38bdf8",letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'Syne',sans-serif",marginBottom:20}}>{t.whatNext?.badge||"Career Explorer"}</div>
          <h1 style={{fontSize:"clamp(2.4rem,5vw,4rem)",fontFamily:"'Playfair Display',serif",fontWeight:900,color:dark?"#f1f5f9":"#0f172a",margin:"0 0 20px",lineHeight:1.15}}>{t.whatNext?.title||"What Next?"} <span style={{background:"linear-gradient(135deg,#38bdf8,#818cf8,#f472b6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>🚀</span></h1>
          <p style={{fontSize:"clamp(1rem,2vw,1.2rem)",color:dark?"#64748b":"#64748b",fontFamily:"'Lora',serif",maxWidth:580,margin:"0 auto 16px",lineHeight:1.8}}>{t.whatNext?.subtitle||"Explore the best paths based on your interests, goals, and strengths."}</p>
        </div></FadeIn>
        <FadeIn delay={0.1}><div style={{background:dark?"linear-gradient(135deg,rgba(56,189,248,0.08),rgba(129,140,248,0.08))":"linear-gradient(135deg,rgba(56,189,248,0.08),rgba(129,140,248,0.06))",border:`1px solid ${dark?"rgba(56,189,248,0.15)":"rgba(56,189,248,0.2)"}`,borderLeft:"4px solid #38bdf8",borderRadius:16,padding:"20px 28px",marginBottom:56,display:"flex",alignItems:"flex-start",gap:16}}>
          <span style={{fontSize:28,flexShrink:0}}>💬</span>
          <div><p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:16,color:dark?"#e2e8f0":"#1e293b",margin:"0 0 6px",lineHeight:1.7}}>"{quote.quote}"</p><p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:"#38bdf8",margin:0,textTransform:"uppercase",letterSpacing:"0.08em"}}>— {quote.author}</p></div>
        </div></FadeIn>
        <FadeIn delay={0.15}><div style={{marginBottom:56}}>
          <div style={{textAlign:"center",marginBottom:32}}><p style={{fontSize:12,fontWeight:700,color:"#818cf8",letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'Syne',sans-serif",marginBottom:10}}>{t.whatNext?.step1||"Step 1"}</p><h2 style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:"clamp(1.5rem,3vw,2.2rem)",color:dark?"#f1f5f9":"#0f172a",margin:0}}>{t.whatNext?.step1Title||"Where are you right now?"}</h2></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:20}}>
            {[{key:"10th",icon:"🏫",label:t.whatNext?.after10th||"After 10th",sub:t.whatNext?.after10thSub||"Completed class 10th / SSLC",color:"#38bdf8"},{key:"12th",icon:"🎓",label:t.whatNext?.after12th||"After 12th",sub:t.whatNext?.after12thSub||"Completed PUC / 12th / Intermediate",color:"#818cf8"}].map(opt=>(
              <div key={opt.key} onClick={()=>{setQualification(opt.key);setStream(null);}} style={{background:qualification===opt.key?`linear-gradient(135deg,${opt.color}22,${opt.color}10)`:(dark?"rgba(255,255,255,0.04)":"#fff"),border:`2px solid ${qualification===opt.key?opt.color:(dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.07)")}`,borderRadius:24,padding:"36px 28px",cursor:"pointer",textAlign:"center",transition:"all 0.3s"}} onMouseEnter={e=>{if(qualification!==opt.key){e.currentTarget.style.borderColor=opt.color;e.currentTarget.style.transform="translateY(-4px)"}}} onMouseLeave={e=>{if(qualification!==opt.key){e.currentTarget.style.borderColor=dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.07)";e.currentTarget.style.transform=""}}}>
                <div style={{fontSize:52,marginBottom:16}}>{opt.icon}</div><h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:dark?"#f1f5f9":"#0f172a",margin:"0 0 8px"}}>{opt.label}</h3><p style={{fontFamily:"'Lora',serif",color:dark?"#64748b":"#94a3b8",fontSize:14,margin:0}}>{opt.sub}</p>{qualification===opt.key&&<div style={{marginTop:16,color:opt.color,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13}}>✓ Selected</div>}
              </div>
            ))}
          </div>
        </div></FadeIn>
        {qualification==="12th"&&(<FadeIn><div style={{marginBottom:56}}>
          <div style={{textAlign:"center",marginBottom:32}}><p style={{fontSize:12,fontWeight:700,color:"#f472b6",letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'Syne',sans-serif",marginBottom:10}}>{t.whatNext?.step2||"Step 2"}</p><h2 style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:"clamp(1.5rem,3vw,2.2rem)",color:dark?"#f1f5f9":"#0f172a",margin:0}}>{t.whatNext?.step2Title||"Which stream did you choose?"}</h2></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>
            {STREAMS.map(s=>(
              <div key={s.key} onClick={()=>setStream(s.key)} style={{background:stream===s.key?`linear-gradient(135deg,${s.color}22,${s.color}10)`:(dark?"rgba(255,255,255,0.04)":"#fff"),border:`2px solid ${stream===s.key?s.color:(dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.07)")}`,borderRadius:20,padding:"28px 20px",cursor:"pointer",textAlign:"center",transition:"all 0.3s"}} onMouseEnter={e=>{if(stream!==s.key)e.currentTarget.style.borderColor=s.color}} onMouseLeave={e=>{if(stream!==s.key)e.currentTarget.style.borderColor=dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.07)"}}>
                <div style={{fontSize:40,marginBottom:12}}>{s.icon}</div><h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:dark?"#f1f5f9":"#0f172a",margin:"0 0 4px"}}>{s.label}</h3><p style={{fontFamily:"'Lora',serif",color:dark?"#64748b":"#94a3b8",fontSize:13,margin:0}}>{s.desc}</p>{stream===s.key&&<div style={{marginTop:10,color:s.color,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12}}>✓ Selected</div>}
              </div>
            ))}
          </div>
        </div></FadeIn>)}
        {careers.length>0&&(<FadeIn><div style={{marginBottom:56}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16,marginBottom:32}}>
            <div><p style={{fontSize:12,fontWeight:700,color:"#34d399",letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'Syne',sans-serif",marginBottom:6}}>{qualification==="12th"?`Step 3 · ${stream?.charAt(0).toUpperCase()+stream?.slice(1)} Paths`:"Step 2 · Your Options"}</p><h2 style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:"clamp(1.4rem,2.5vw,2rem)",color:dark?"#f1f5f9":"#0f172a",margin:0}}>Explore Your Paths</h2></div>
            <div style={{position:"relative"}}><span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16}}>🔍</span><input type="text" placeholder={t.whatNext?.searchPlaceholder||"Search careers..."} value={search} onChange={e=>setSearch(e.target.value)} style={{background:dark?"rgba(255,255,255,0.06)":"#fff",border:`1.5px solid ${dark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.1)"}`,borderRadius:12,padding:"10px 16px 10px 42px",color:dark?"#f1f5f9":"#0f172a",fontFamily:"'Lora',serif",fontSize:14,outline:"none",width:220}}/></div>
          </div>
          {filtered.length===0?(<p style={{textAlign:"center",color:dark?"#64748b":"#94a3b8",fontFamily:"'Lora',serif",fontSize:15,padding:"40px 0"}}>No results for "{search}"</p>):(<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20}}>{filtered.map((career,i)=>(<CareerCard key={career.id} career={career} dark={dark} delay={i*0.07}/>))}</div>)}
        </div></FadeIn>)}
        {qualification&&(qualification==="10th"||stream)&&(<FadeIn><CareerQuiz dark={dark} qualification={qualification}/></FadeIn>)}
        {qualification&&(<FadeIn><div style={{marginTop:64,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:20}}>
          {[{icon:"🤝",title:"Ask a Senior",sub:"Still confused? Connect with mentors.",color:"#38bdf8",href:"#community"},{icon:"🏆",title:"Find Scholarships",sub:"Don't let finances stop your dreams.",color:"#818cf8",href:"#scholarships"},{icon:"💬",title:"Join the Community",sub:"Thousands of students discussing careers.",color:"#34d399",href:"#community"}].map(item=>(
            <div key={item.title} style={{background:dark?`${item.color}0f`:`${item.color}0d`,border:`1.5px solid ${item.color}33`,borderRadius:20,padding:"28px 24px",textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:12}}>{item.icon}</div><h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:18,color:dark?"#f1f5f9":"#0f172a",margin:"0 0 8px"}}>{item.title}</h3><p style={{fontFamily:"'Lora',serif",color:dark?"#64748b":"#94a3b8",fontSize:13,lineHeight:1.7,margin:"0 0 18px"}}>{item.sub}</p><a href={item.href} style={{display:"inline-block",background:item.color,color:"#fff",padding:"10px 24px",borderRadius:12,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,textDecoration:"none"}}>Go →</a>
            </div>
          ))}
        </div></FadeIn>)}
        <FadeIn><div style={{textAlign:"center",marginTop:80,padding:"48px 32px",background:dark?"linear-gradient(135deg,rgba(56,189,248,0.06),rgba(129,140,248,0.06))":"linear-gradient(135deg,rgba(56,189,248,0.05),rgba(129,140,248,0.05))",borderRadius:28,border:`1px solid ${dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.05)"}`}}>
          <p style={{fontSize:40,marginBottom:16}}>✨</p><h2 style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:"clamp(1.4rem,3vw,2.2rem)",color:dark?"#f1f5f9":"#0f172a",margin:"0 0 16px",lineHeight:1.4}}>{t.whatNext?.ctaTitle||"Your future is not limited to one path."}</h2><p style={{fontFamily:"'Lora',serif",color:dark?"#64748b":"#94a3b8",fontSize:16,maxWidth:480,margin:"0 auto"}}>{t.whatNext?.ctaSubtitle||"Explore, learn, and choose wisely."}</p>
        </div></FadeIn>
      </div>
    </section>
  );
}