export default function AdminBar({ onGoToDashboard, onGoToHome }) {
  return (
    <div style={{position:"fixed",top:0,left:0,right:0,zIndex:99999,background:"linear-gradient(90deg,#0f172a,#1e1b4b)",borderBottom:"1px solid rgba(129,140,248,0.3)",padding:"7px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:14}}>🔐</span>
        <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:"#818cf8",letterSpacing:"0.06em"}}>ADMIN MODE</span>
        <span style={{width:1,height:14,background:"rgba(255,255,255,0.15)",display:"inline-block"}}/>
        <span style={{fontFamily:"'Lora',serif",fontSize:12,color:"rgba(255,255,255,0.5)"}}>Viewing site as admin</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        {onGoToHome&&(<button onClick={onGoToHome} style={{padding:"5px 14px",borderRadius:20,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.7)",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,cursor:"pointer",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>← Back to Site</button>)}
        {onGoToDashboard&&(<button onClick={onGoToDashboard} style={{padding:"5px 16px",borderRadius:20,border:"1px solid rgba(129,140,248,0.4)",background:"rgba(129,140,248,0.12)",color:"#818cf8",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,cursor:"pointer",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>Dashboard →</button>)}
      </div>
    </div>
  );
}