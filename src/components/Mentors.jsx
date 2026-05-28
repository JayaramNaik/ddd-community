import { useState, useEffect } from "react";
import { FadeIn } from "../hooks/useInView.jsx";
import { useTranslation } from "../data/translations.js";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase.js";

export default function Mentors({ dark, lang, onMentorProfile }) {
  const t = useTranslation(lang);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const q = query(collection(db, "mentors"), where("status", "==", "approved"));
        const snap = await getDocs(q);
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMentors(list);
      } catch (err) {
        console.error("Failed to load mentors:", err);
      }
      setLoading(false);
    };
    fetchMentors();
  }, []);

  return (
    <section id="mentors" style={{padding:"100px 2rem",background:dark?"#040b1c":"#fff"}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <FadeIn><div style={{textAlign:"center",marginBottom:64}}>
          <div style={{fontSize:12,fontWeight:700,color:"#38bdf8",letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'Syne',sans-serif",marginBottom:12}}>MEET YOUR MENTORS</div>
          <h2 style={{fontSize:"clamp(2rem,4vw,3rem)",fontFamily:"'Playfair Display',serif",fontWeight:900,color:dark?"#f1f5f9":"#0f172a"}}>{t.mentors.title} <span style={{background:"linear-gradient(135deg,#38bdf8,#818cf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{t.mentors.highlight}</span></h2>
          <p style={{color:dark?"#64748b":"#94a3b8",marginTop:12,fontFamily:"'Lora',serif",fontSize:15}}>{t.mentors.subtitle}</p>
        </div></FadeIn>
        {loading ? (
          <div style={{textAlign:"center",color:dark?"#475569":"#94a3b8",fontFamily:"'Lora',serif",padding:"40px"}}>Loading mentors...</div>
        ) : mentors.length === 0 ? (
          <div style={{textAlign:"center",color:dark?"#475569":"#94a3b8",fontFamily:"'Lora',serif",padding:"40px"}}>No mentors found. Be the first to register!</div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:28}}>
            {mentors.map((mentor,i)=>(
              <FadeIn key={mentor.id} delay={i*0.15}>
                <div style={{background:dark?"rgba(255,255,255,0.04)":"#f8fafc",border:`1px solid ${dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.08)"}`,borderRadius:24,overflow:"hidden",transition:"transform 0.3s,box-shadow 0.3s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-8px)";e.currentTarget.style.boxShadow="0 24px 60px rgba(56,189,248,0.2)"}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
                  <div style={{height:6,background:`linear-gradient(90deg, ${mentor.gradientFrom||"#3b82f6"}, ${mentor.gradientTo||"#22d3ee"})`}}/>
                  <div style={{padding:"32px 28px"}}>
                    <div style={{width:72,height:72,borderRadius:"50%",overflow:"hidden",background:"linear-gradient(135deg,rgba(56,189,248,0.2),rgba(129,140,248,0.2))",border:"2px solid rgba(56,189,248,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,marginBottom:20}}>{mentor.emoji||"🎓"}</div>
                    <h3 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:22,color:dark?"#f1f5f9":"#0f172a",marginBottom:6}}>{mentor.name}</h3>
                    <div style={{fontSize:14,color:"#38bdf8",fontWeight:600,fontFamily:"'Syne',sans-serif",marginBottom:4}}>{mentor.stream}</div>
                    {mentor.institution&&<div style={{fontSize:13,color:dark?"#64748b":"#94a3b8",marginBottom:20,fontFamily:"'Lora',serif"}}>{mentor.institution}</div>}
                    {mentor.bio&&<p style={{fontSize:13,color:dark?"#94a3b8":"#64748b",fontFamily:"'Lora',serif",lineHeight:1.6,marginBottom:12}}>{mentor.bio}</p>}
                    <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>{(mentor.interests||[]).map(interest=>(<span key={interest} style={{background:"rgba(56,189,248,0.1)",border:"1px solid rgba(56,189,248,0.25)",color:"#38bdf8",fontSize:11,padding:"4px 10px",borderRadius:20,fontWeight:600,fontFamily:"'Syne',sans-serif"}}>{interest}</span>))}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
        {onMentorProfile&&(<FadeIn><div style={{textAlign:"center",marginTop:56}}>
          <div style={{display:"inline-block",background:dark?"rgba(129,140,248,0.08)":"rgba(129,140,248,0.06)",border:"1.5px solid rgba(129,140,248,0.2)",borderRadius:20,padding:"28px 40px"}}>
            <p style={{fontSize:36,marginBottom:12}}>👨‍🏫</p>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:22,color:dark?"#f1f5f9":"#0f172a",margin:"0 0 10px"}}>Want to become a mentor?</h3>
            <p style={{fontFamily:"'Lora',serif",color:dark?"#94a3b8":"#64748b",fontSize:14,margin:"0 0 20px",lineHeight:1.7}}>Guide students who are where you once were.</p>
            <button onClick={onMentorProfile} style={{background:"linear-gradient(135deg,#818cf8,#38bdf8)",color:"#fff",border:"none",borderRadius:14,padding:"12px 28px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Syne',sans-serif"}}>🚀 Register as Mentor →</button>
          </div>
        </div></FadeIn>)}
      </div>
    </section>
  );
}
