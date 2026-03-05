import { BL, WH } from "../constants.js";
import { fmt, dn } from "../utils.js";
import Badge from "./Badge.jsx";

export default function ClientPostRow({post,feedback,onChange}){
  const fb=feedback||{approved:false,note:"",promoText:post.promoText||""};
  return(
    <div style={{background:WH,borderRadius:12,border:`1px solid ${fb.approved?"#A5D6A7":"#CFD8DC"}`,marginBottom:10,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.05)",direction:"rtl",borderRight:`4px solid ${fb.approved?"#4CAF50":"#CFD8DC"}`}}>
      {/* Header */}
      <div style={{padding:"11px 16px",display:"flex",alignItems:"center",gap:9,background:fb.approved?"#F1F8E9":"#FAFBFC"}}>
        <span style={{fontWeight:800,color:BL,fontSize:13,minWidth:24}}>#{post.num}</span>
        <span style={{fontWeight:700,color:"#37474F",fontSize:13}}>{post.date?`${fmt(post.date)} | ${dn(post.date)}`:"תאריך לפי מבצע"}</span>
        <Badge type={post.type}/>
        <div style={{marginRight:"auto"}}>
          <button onClick={()=>onChange({...fb,approved:!fb.approved})}
            style={{background:fb.approved?"#4CAF50":"white",color:fb.approved?"white":"#4CAF50",border:"2px solid #4CAF50",borderRadius:7,padding:"5px 16px",cursor:"pointer",fontSize:13,fontWeight:800}}>
            {fb.approved?"✅ מאושר":"אישור"}
          </button>
        </div>
      </div>
      {/* Image */}
      {post.image&&(
        <div style={{padding:"10px 16px",borderTop:"1px solid #ECEFF1"}}>
          <img src={post.image} alt="פוסט" style={{width:120,height:120,borderRadius:10,objectFit:"cover",boxShadow:"0 2px 8px rgba(0,0,0,0.12)"}}/>
        </div>
      )}
      {/* Post text */}
      {post.copy&&(
        <div style={{padding:"10px 16px",fontSize:13,lineHeight:1.8,color:"#37474F",whiteSpace:"pre-wrap",background:"#FAFBFC",borderTop:"1px solid #ECEFF1"}}>{post.copy}</div>
      )}
      {/* Promo input */}
      {post.tk==="promo"&&(
        <div style={{padding:"10px 16px",background:"#FFFDE7",borderTop:"1px solid #FFE082"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#F57F17",marginBottom:5}}>📦 פרטי המבצע</div>
          <input value={fb.promoText||""} onChange={e=>onChange({...fb,promoText:e.target.value})}
            placeholder="פרטי המבצע — מוצר, מחיר, תוקף..."
            style={{width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #FFE082",fontSize:13,fontFamily:"Arial",boxSizing:"border-box"}}/>
        </div>
      )}
      {/* Note */}
      {post.copy&&(
        <div style={{padding:"8px 16px 12px",borderTop:"1px solid #ECEFF1"}}>
          <textarea value={fb.note||""} onChange={e=>onChange({...fb,note:e.target.value})}
            placeholder="הערה לצוות (אופציונלי)..."
            style={{width:"100%",height:52,padding:"7px 10px",borderRadius:7,border:"1px solid #CFD8DC",fontSize:12,resize:"vertical",boxSizing:"border-box",fontFamily:"Arial",background:"#FAFBFC"}}/>
        </div>
      )}
    </div>
  );
}
