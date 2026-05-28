import { FadeIn } from "../hooks/useInView.jsx";

export default function NotFound({ dark, onGoHome }) {
  return (
    <section style={{minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center",background:dark?"#020818":"#f8fafc",padding:"80px 2rem"}}>
      <FadeIn>
        <div style={{textAlign:"center",maxWidth:500,margin:"0 auto"}}>
          <div style={{fontSize:"clamp(5rem,15vw,8rem)",marginBottom:24}}>🔍</div>
          <h1 style={{fontSize:"clamp(2rem,5vw,3rem)",fontFamily:"'Playfair Display',serif",fontWeight:900,color:dark?"#f1f5f9":"#0f172a",margin:"0 0 16px",lineHeight:1.2}}>Page Not Found</h1>
          <p style={{fontFamily:"'Lora',serif",color:dark?"#94a3b8":"#64748b",fontSize:16,lineHeight:1.8,margin:"0 0 32px"}}>The page you're looking for doesn't exist or may have moved. Let's get you back on track.</p>
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:32}}>
            {[{label:"🏠 Go Home",href:"#home"},{label:"🎓 Explore Exams",href:"#exams"},{label:"🏆 Scholarships",href:"#scholarships"},{label:"💬 Community",href:"#community"},{label:"🤝 Find a Mentor",href:"#mentors"}].map(l=>(
              <a key={l.label} href={l.href} onClick={e=>{e.preventDefault();onGoHome();}} style={{display:"block",background:dark?"rgba(255,255,255,0.04)":"#fff",border:`1.5px solid ${dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.08)"}`,borderRadius:14,padding:"12px 20px",color:dark?"#e2e8f0":"#0f172a",fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:14,textDecoration:"none"}}>{l.label}</a>
            ))}
          </div>
          <button onClick={onGoHome} style={{background:"linear-gradient(135deg,#38bdf8,#818cf8)",color:"#fff",border:"none",borderRadius:14,padding:"13px 28px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Syne',sans-serif"}}>← Back to Home</button>
        </div>
      </FadeIn>
    </section>
  );
}