import { useState, useEffect } from "react";
import { BL, RD, WH, BR, DK } from "../constants.js";
import { fmt, dn } from "../utils.js";
import { pMonday, pHoliday, pFun, pRecruit, pPromo, callAI } from "../prompts.js";
import Badge from "./Badge.jsx";

export default function PostCard({post,c,month,ne,onUpdate,isClient=false}){
  const [editing,setEditing]=useState(false);
  const [editVal,setEditVal]=useState(post.copy||"");
  const [notes,setNotes]=useState("");
  const [promoIn,setPromoIn]=useState(post.promoText||"");
  const [loading,setLoading]=useState(false);
  const [valResult,setValResult]=useState(post.val||"");
  const [valLoading,setValLoading]=useState(false);
  const [imgData,setImgData]=useState(post.image||null);

  useEffect(()=>{setEditVal(post.copy||"");},[post.copy]);
  const status=post.copy?"done":post.tk==="promo"&&!post.promoText?"empty":"wait";

  async function gen(n){
    if(isClient)return;setLoading(true);let p="";
    if(post.tk==="monday")p=pMonday(post.date,c,ne,n||notes);
    else if(post.tk==="holiday")p=pHoliday(post.date,c,ne,n||notes);
    else if(post.tk==="fun")p=pFun(post.date,c,ne,n||notes);
    else if(post.tk==="recruit")p=pRecruit(post.date,c,ne,n||notes);
    else if(post.tk==="promo")p=pPromo(promoIn||post.promoText,month,n||notes);
    const copy=await callAI(p);
    setEditVal(copy);setValResult("");onUpdate({...post,copy,promoText:promoIn,val:""});setLoading(false);
  }

  async function validate(){
    if(isClient)return;setValLoading(true);
    const r=await callAI(`בדוק פוסט זה של Ten בקצרה:\n---\n${post.copy||editVal}\n---\nבדוק: 1) יש מקף ארוך (—)? 2) שגיאות שפה? 3) טון מתאים? 4) CTA ברור?\nציון 1-10 ושיפור אחד. קצר, בעברית.`);
    setValResult(r);onUpdate({...post,val:r});setValLoading(false);
  }

  function handleImageUpload(e){
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{const data=ev.target.result;setImgData(data);onUpdate({...post,image:data});};
    reader.readAsDataURL(file);
  }

  return(
    <div style={{background:WH,borderRadius:12,border:`1px solid ${BR}`,marginBottom:10,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.05)",direction:"rtl"}}>
      {/* Header */}
      <div style={{padding:"11px 16px",display:"flex",alignItems:"center",gap:9,background:status==="done"?"#F9FFFE":status==="empty"?"#FFF8F8":"#FAFBFC"}}>
        <span style={{fontWeight:800,color:BL,fontSize:13,minWidth:24}}>#{post.num}</span>
        <span style={{fontWeight:700,color:DK,fontSize:13}}>{post.date?`${fmt(post.date)} | ${dn(post.date)}`:"תאריך לפי מבצע"}</span>
        <Badge type={post.type}/>
        <span style={{marginRight:"auto",fontSize:11,fontWeight:800,color:status==="done"?"#4CAF50":status==="empty"?"#E53935":"#FF9800"}}>
          {status==="done"?"✅ מוכן":status==="empty"?"⭕ ממתין למבצע":"⏳"}
        </span>
        {loading&&<span style={{fontSize:11,color:BL,fontWeight:700}}>מייצר...</span>}
      </div>

      <div style={{borderTop:`1px solid ${BR}`}}>
        {/* Promo input */}
        {post.tk==="promo"&&(
          <div style={{padding:"10px 16px",background:"#FFFDE7",borderBottom:`1px solid ${BR}`}}>
            <div style={{fontSize:12,fontWeight:700,color:"#F57F17",marginBottom:5}}>📦 פרטי המבצע</div>
            {isClient?(
              <input value={promoIn} onChange={e=>{setPromoIn(e.target.value);onUpdate({...post,promoText:e.target.value});}}
                placeholder="פרטי המבצע — מוצר, מחיר, תוקף..."
                style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1px solid ${BR}`,fontSize:13,fontFamily:"Arial",boxSizing:"border-box"}}/>
            ):(
              <div style={{display:"flex",gap:8}}>
                <input value={promoIn} onChange={e=>setPromoIn(e.target.value)}
                  placeholder="למשל: קומפרסור 2 בוכנות ב-229 ש'ח, באפליקציה 199 ש'ח, עד 30.4.26"
                  style={{flex:1,padding:"7px 10px",borderRadius:8,border:`1px solid ${BR}`,fontSize:12,fontFamily:"Arial"}}/>
                <button onClick={()=>{onUpdate({...post,promoText:promoIn});gen("");}} disabled={!promoIn||loading}
                  style={{background:BL,color:WH,border:"none",borderRadius:8,padding:"7px 16px",cursor:"pointer",fontSize:12,fontWeight:700,opacity:!promoIn||loading?0.5:1}}>
                  {loading?"...":"צור פוסט"}
                </button>
              </div>
            )}
          </div>
        )}

        {post.copy?(
          <div style={{display:"grid",gridTemplateColumns:isClient?"1fr":"1fr 240px"}}>
            {/* Text */}
            <div style={{padding:"14px 18px",borderLeft:isClient?"none":`1px solid ${BR}`}}>
              <div style={{fontSize:13.5,lineHeight:1.8,color:DK,whiteSpace:"pre-wrap",background:"#FAFBFC",padding:"10px 13px",borderRadius:8,border:`1px solid ${BR}`,minHeight:100}}>{post.copy}</div>
              {!isClient&&(
                <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap",alignItems:"center"}}>
                  <input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="הערה לייצור מחדש..."
                    style={{flex:1,minWidth:130,padding:"5px 9px",borderRadius:7,border:`1px solid ${BR}`,fontSize:11,fontFamily:"Arial"}}/>
                  <button onClick={()=>gen(notes)} disabled={loading} style={{background:RD,color:WH,border:"none",borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:11,fontWeight:700,opacity:loading?0.5:1}}>{loading?"...":"↺ מחדש"}</button>
                  <button onClick={()=>{if(editing){setEditing(false);onUpdate({...post,copy:editVal});}else setEditing(true);}} style={{background:"none",border:`1px solid ${BL}`,color:BL,borderRadius:7,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>{editing?"💾 שמור":"✏️ ערוך"}</button>
                  <button onClick={()=>navigator.clipboard.writeText(post.copy)} style={{background:"none",border:`1px solid ${BL}`,color:BL,borderRadius:7,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>📋</button>
                  <button onClick={validate} disabled={valLoading} style={{background:"none",border:"1px solid #7B1FA2",color:"#7B1FA2",borderRadius:7,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>{valLoading?"...":"🔍 בדוק"}</button>
                </div>
              )}
              {!isClient&&editing&&(
                <textarea value={editVal} onChange={e=>setEditVal(e.target.value)}
                  style={{width:"100%",height:180,padding:"10px 12px",borderRadius:8,border:`2px solid ${BL}`,fontSize:13,lineHeight:1.75,resize:"vertical",boxSizing:"border-box",fontFamily:"Arial",direction:"rtl",marginTop:8}}/>
              )}
              {!isClient&&valResult&&(
                <div style={{marginTop:8,background:"#F3E5F5",border:"1px solid #CE93D8",borderRadius:8,padding:"9px 12px",fontSize:11.5,lineHeight:1.7,color:"#4A148C",whiteSpace:"pre-wrap"}}>{valResult}</div>
              )}
            </div>
            {/* Image panel */}
            {!isClient&&(
              <div style={{padding:"14px",display:"flex",flexDirection:"column",alignItems:"center",gap:10,background:"#F0F4F8"}}>
                <span style={{fontSize:11,fontWeight:800,color:RD,alignSelf:"flex-start"}}>🖼️ תמונה לפוסט</span>
                {imgData?(
                  <div style={{position:"relative",width:"100%"}}>
                    <img src={imgData} alt="post" style={{width:"100%",borderRadius:10,display:"block",boxShadow:"0 4px 12px rgba(0,0,0,0.15)"}}/>
                    <button onClick={()=>{setImgData(null);onUpdate({...post,image:null});}} style={{position:"absolute",top:6,left:6,background:"rgba(0,0,0,0.55)",color:WH,border:"none",borderRadius:"50%",width:24,height:24,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                  </div>
                ):(
                  <label style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",minHeight:140,border:"2px dashed #90A4AE",borderRadius:10,cursor:"pointer",gap:8,background:"white"}}>
                    <span style={{fontSize:28}}>📤</span>
                    <span style={{fontSize:11,color:"#78909C",textAlign:"center",fontWeight:600}}>העלה תמונה מעוצבת<br/><span style={{color:"#B0BEC5",fontWeight:400}}>לחץ או גרור לכאן</span></span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{display:"none"}}/>
                  </label>
                )}
              </div>
            )}
          </div>
        ):(
          <div style={{padding:"20px",textAlign:"center"}}>
            {post.tk!=="promo"&&(loading?<div style={{color:BL,fontWeight:700,fontSize:13}}>⏳ מייצר...</div>:<div style={{color:"#90A4AE",fontSize:13}}>⏳ ממתין לייצור אוטומטי</div>)}
          </div>
        )}
      </div>
    </div>
  );
}
