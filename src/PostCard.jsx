import React,{useState,useRef}from"react";
import{PU,WH,BR,DK,BL,RD}from"./constants.js";
import{Badge,callAI,buildPrompt,uploadImage}from"./utils.jsx";

export default function PostCard({post,ctx,onUpdate,isSharedView}){
  const[editing,setEditing]=useState(false);
  const[txt,setTxt]=useState(post.copy||"");
  const[loading,setLoading]=useState(false);
  const[promoText,setPromoText]=useState(post.promoText||"");
  const[note,setNote]=useState("");
  const fileRef=useRef();
  const[img,setImg]=useState(post.image||null);
  const isPromo=post.type==="פוסט מבצע";

  async function regen(){
    setLoading(true);
    const res=await callAI(buildPrompt(post.type,ctx,post.date,post.day,promoText)+(note?`\nהערה: ${note}`:""));
    setTxt(res); onUpdate({...post,copy:res,promoText}); setLoading(false); setNote("");
  }
  function save(){onUpdate({...post,copy:txt});setEditing(false);}

 async function handleImg(file){ const url=await uploadImage(file); if(url){setImg(url);onUpdate({...post,image:url});} }

  const statusIcon=post.copy?"✅":isPromo?"⭕":"⏳";
  const statusTxt=post.copy?"מוכן":"ממתין לייצור אוטומטי";

  return(
    <div style={{background:WH,borderRadius:16,border:`1px solid ${BR}`,overflow:"hidden",marginBottom:12}}>
      {/* header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 16px",borderBottom:`1px solid ${BR}`,background:"#FAFAFA"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{background:"#F1F5F9",color:PU,width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:11}}>#{post.id}</span>
          <span style={{fontWeight:700,color:DK,fontSize:13}}>{post.date||"לפי מבצע"}{post.day?" | "+post.day:""}</span>
          <Badge t={post.type}/>
        </div>
        <span style={{fontSize:13,color:post.copy?"#16A34A":isPromo?"#DC2626":"#94A3B8"}}>{statusIcon} {statusTxt}</span>
      </div>

      {/* body */}
      <div style={{display:"flex",flexWrap:"wrap"}}>
        {/* תמונה */}
       <div style={{width:"40%",minWidth:220,maxWidth:420,padding:14,background:"#F9FAFB",display:"flex",flexDirection:"column",alignItems:"center",gap:8,borderLeft:`1px solid ${BR}`,flexShrink:0}}>
          <div style={{fontSize:11,color:"#64748B",fontWeight:700}}>🖼️ תמונה לפוסט</div>
          {img?(
            <img src={img} style={{width:"100%",maxWidth:380,height:"auto",objectFit:"contain",borderRadius:8,background:"#F8FAFC",cursor:isSharedView?"default":"pointer"}} onClick={()=>!isSharedView&&fileRef.current?.click()}/>
          ):(
            <div onClick={()=>!isSharedView&&fileRef.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleImg(f);}}
              style={{width:400,height:320,border:"2px dashed #CBD5E1",borderRadius:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#94A3B8",fontSize:11,textAlign:"center",cursor:"pointer"}}>
              <span style={{fontSize:22}}>📤</span>
              <span>העלה תמונה מעוצבת</span>
              <span style={{fontSize:10,marginTop:2}}>לחץ או גרור לכאן</span>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{if(e.target.files[0])handleImg(e.target.files[0]);}}/>
        </div>

        {/* טקסט */}
        <div style={{flex:1,padding:16,minWidth:260}}>
          {isPromo&&!post.copy&&(
            <div style={{marginBottom:10}}>
              <div style={{fontSize:11,color:"#64748B",fontWeight:700,marginBottom:5}}>📦 פרטי המבצע</div>
              <input value={promoText} onChange={e=>setPromoText(e.target.value)} placeholder="תאר את המבצע: מוצר, הנחה, תנאים..."
                style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1px solid ${BR}`,fontSize:12,fontFamily:"system-ui"}}/>
            </div>
          )}

          {loading?(
            <div style={{background:"#F0F9FF",borderRadius:10,padding:14,color:BL,fontSize:13,textAlign:"center"}}>🪄 מייצר תוכן...</div>
          ):editing?(
            <textarea value={txt} onChange={e=>setTxt(e.target.value)}
              style={{width:"100%",padding:12,borderRadius:10,border:`1px solid ${PU}`,fontSize:13,lineHeight:1.7,minHeight:150,resize:"vertical",fontFamily:"system-ui"}}/>
          ):(
            <div style={{background:"#F8FAFC",borderRadius:10,padding:12,fontSize:13,color:"#334155",lineHeight:1.8,whiteSpace:"pre-wrap",minHeight:70}}>
              {post.copy||<span style={{color:"#94A3B8"}}>{isSharedView?"ממתין לאישור":"⏳ ממתין לייצור אוטומטי"}</span>}
            </div>
          )}

          {!isSharedView&&(
            <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap",alignItems:"center"}}>
              <button onClick={regen} style={{background:RD,color:WH,border:"none",padding:"6px 12px",borderRadius:7,fontWeight:700,cursor:"pointer",fontSize:12}}>↺ מחדש</button>
              {editing?(
                <button onClick={save} style={{background:"#16A34A",color:WH,border:"none",padding:"6px 12px",borderRadius:7,fontWeight:700,cursor:"pointer",fontSize:12}}>💾 שמור</button>
              ):(
                <button onClick={()=>{setTxt(post.copy||"");setEditing(true);}} style={{background:"#F1F5F9",color:DK,border:"none",padding:"6px 12px",borderRadius:7,fontWeight:700,cursor:"pointer",fontSize:12}}>✏️ ערוך</button>
              )}
              {post.copy&&<button onClick={()=>navigator.clipboard.writeText(post.copy)} style={{background:"#F1F5F9",color:DK,border:"none",padding:"6px 12px",borderRadius:7,fontWeight:700,cursor:"pointer",fontSize:12}}>📋</button>}
              <input value={note} onChange={e=>setNote(e.target.value)} placeholder="הערה לייצור מחדש..." style={{flex:1,minWidth:120,padding:"5px 8px",borderRadius:7,border:`1px solid ${BR}`,fontSize:11,fontFamily:"system-ui"}}/>
            </div>
          )}

          {isSharedView&&(
            <div style={{display:"flex",gap:6,marginTop:10}}>
              <button onClick={()=>onUpdate({...post,approved:true})} style={{background:post.approved?"#16A34A":"#F1F5F9",color:post.approved?WH:DK,border:`1px solid ${post.approved?"#16A34A":BR}`,padding:"6px 14px",borderRadius:7,fontWeight:700,cursor:"pointer",fontSize:12}}>
                {post.approved?"✅ מאושר":"✅ מאושר"}
              </button>
              <input placeholder="✏️ יש הערה..." style={{flex:1,padding:"5px 8px",borderRadius:7,border:`1px solid ${BR}`,fontSize:11,fontFamily:"system-ui"}}
                onChange={e=>onUpdate({...post,clientNote:e.target.value})}/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
