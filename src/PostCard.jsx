import React,{useState,useRef,useEffect}from"react";
import{PU,WH,BR,DK,BL,RD}from"./constants.js";
import{Badge,callAI,buildPrompt,uploadImage}from"./utils.jsx";

export default function PostCard({post,ctx,onUpdate,isSharedView,allPosts}){
  const[editing,setEditing]=useState(false);
  const[txt,setTxt]=useState(post.copy||"");
  const[loading,setLoading]=useState(false);
  const[promoText,setPromoText]=useState(post.promoText||"");
  const[note,setNote]=useState("");
  const fileRef=useRef();
  const[img,setImg]=useState(post.image||null);
  const isPromo=post.type==="פוסט מבצע";

  useEffect(()=>{setPromoText(post.promoText||"");},[post.promoText]);

  async function regen(){
    setLoading(true);
    // Build list of events already used in approved/generated posts in this gantt
    const usedEvents=(allPosts||[])
      .filter(p=>p.id!==post.id && p.copy && p.copy.length>10)
      .map(p=>{
        // Extract what event/theme each post used based on its type and copy snippet
        if(p.type==="חג / אירוע") return p.copy.substring(0,40).trim();
        return null;
      })
      .filter(Boolean);
    const res=await callAI(buildPrompt(post.type,ctx,post.date,post.day,promoText,usedEvents)+(note?`\nהוראה נוספת: ${note}`:""));
    setTxt(res); onUpdate({...post,copy:res,promoText}); setLoading(false); setNote("");
  }
  function save(){onUpdate({...post,copy:txt});setEditing(false);}

  async function handleImg(file){ const url=await uploadImage(file); if(url){setImg(url);onUpdate({...post,image:url});} }

  const statusIcon=post.copy?"✅":isPromo?"🔴":"⏳";
  const statusTxt=post.copy?"מוכן":"ממתין לייצור אוטומטי";

  return(
    <div style={{background:WH,borderRadius:16,border:`1px solid ${BR}`,overflow:"hidden",marginBottom:12}}>
      {/* header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 16px",borderBottom:`1px solid ${BR}`,background:"#FAFAFA"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{background:"#F1F5F9",color:PU,width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:11}}>#{post.id}</span>
          <span style={{fontWeight:700,color:DK,fontSize:13}}>{post.date||"לפי מבצע"} | יום {post.day??""}
          </span>
          <Badge t={post.type}/>
        </div>
        <span style={{fontSize:13,color:post.copy?"#16A34A":isPromo?"#DC2626":"#94A3B8"}}>{statusIcon} {statusTxt}</span>
      </div>

      {/* body */}
      <div style={{display:"flex",flexWrap:"wrap"}}>
        {/* תמונה */}
        <div style={{width:"40%",minWidth:220,maxWidth:420,padding:14,background:"#F9FAFB",display:"flex",flexDirection:"column",alignItems:"center",gap:8,borderLeft:`1px solid ${BR}`,flexShrink:0}}>
          {img?(
            <img src={img} style={{width:"100%",maxWidth:380,height:"auto",objectFit:"contain",borderRadius:8,background:"#F8FAFC",cursor:isSharedView?"default":"pointer"}} onClick={()=>!isSharedView&&fileRef.current?.click()}/>
          ):(!isSharedView?(
            <div onClick={()=>fileRef.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleImg(f);}}
              style={{width:"100%",height:200,border:"2px dashed #CBD5E1",borderRadius:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#94A3B8",fontSize:11,textAlign:"center",cursor:"pointer"}}>
              <span style={{fontSize:22}}>🖼️</span>
              <span>העלאה תמונה מעוצבת</span>
              <span style={{fontSize:10,marginTop:2}}>לחץ או גרור לכאן</span>
            </div>
          ):null)}
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{if(e.target.files[0])handleImg(e.target.files[0]);}}/>
        </div>

        {/* טקסט */}
        <div style={{flex:1,padding:14,minWidth:260}}>
          {isPromo&&!isSharedView&&(
            <input value={promoText} onChange={e=>setPromoText(e.target.value)} placeholder="פרטי המבצע (מוצר + מחיר + מחיר אפליקציה)..."
              style={{width:"100%",marginBottom:10,padding:"8px 12px",borderRadius:8,border:`1px solid ${BR}`,fontSize:12,fontFamily:"system-ui",direction:"rtl",boxSizing:"border-box"}}/>
          )}
          {editing?(
            <textarea value={txt} onChange={e=>setTxt(e.target.value)}
              style={{width:"100%",minHeight:200,padding:10,borderRadius:8,border:`1px solid ${PU}`,fontSize:13,fontFamily:"system-ui",direction:"rtl",resize:"vertical",boxSizing:"border-box"}}/>
          ):(
            <div style={{fontSize:13,color:DK,lineHeight:1.7,whiteSpace:"pre-wrap",direction:"rtl",minHeight:80}}>
              {loading?<span style={{color:"#94A3B8",fontStyle:"italic"}}>⏳ מייצר פוסט...</span>:(post.copy||<span style={{color:"#94A3B8",fontStyle:"italic"}}>ממתין לייצור אוטומטי...</span>)}
            </div>
          )}

          {!isSharedView&&(
            <div style={{marginTop:10,display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
              {editing?(
                <button onClick={save} style={{padding:"6px 14px",background:PU,color:WH,border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"}}>שמור</button>
              ):(
                <button onClick={()=>setEditing(true)} style={{padding:"6px 14px",background:"#F1F5F9",color:DK,border:`1px solid ${BR}`,borderRadius:8,fontSize:12,cursor:"pointer"}}>✏️ ערוך</button>
              )}
              <button onClick={regen} disabled={loading} style={{padding:"6px 14px",background:loading?"#E2E8F0":"#DC2626",color:WH,border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:loading?"wait":"pointer"}}>
                {loading?"...":"ט מחדש"}
              </button>
              <input value={note} onChange={e=>setNote(e.target.value)} placeholder="הערה לייצור מחדש..."
                style={{flex:1,minWidth:120,padding:"6px 10px",borderRadius:8,border:`1px solid ${BR}`,fontSize:12,fontFamily:"system-ui",direction:"rtl"}}/>
              <button onClick={()=>{onUpdate({...post,approved:!post.approved});}} style={{padding:"6px 10px",background:post.approved?"#DCFCE7":"#F1F5F9",color:post.approved?"#166534":DK,border:`1px solid ${post.approved?"#86EFAC":BR}`,borderRadius:8,fontSize:12,cursor:"pointer"}}>
                {post.approved?"✅ מאושר":"אשר"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
