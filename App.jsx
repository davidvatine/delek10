import { useState, useEffect } from "react";
import { BL, BLl, RD, WH, BG, BR, DK, DV_GRAD, DV_GRAD2, APP_VERSION, DAVID_LOGO, MHE, STORAGE_KEY, DEFAULT_CLIENTS, loadClients, saveClients } from "./constants.js";
import { getCtx, buildSchedule, deserializePosts, listSavedGantts, saveGanttToStorage, loadGanttFromStorage, deleteGanttFromStorage, makeShareId, saveGanttToSupabase, loadGanttFromSupabase, addComment, getComments, fmt, dn } from "./utils.js";
import { pMonday, pHoliday, pFun, pRecruit, callAI } from "./prompts.js";
import Badge from "./components/Badge.jsx";
import ExportModal from "./components/ExportModal.jsx";
import PostCard from "./components/PostCard.jsx";
import ClientPostRow from "./components/ClientPostRow.jsx";
import ClientSelectScreen from "./components/ClientSelectScreen.jsx";

const AUTO=["monday","holiday","fun","recruit"];

export default function TenGanttAI(){
  const now=new Date();
  const [year,setYear]=useState(now.getFullYear());
  const [month,setMonth]=useState(now.getMonth()+1);
  const [phase,setPhase]=useState("client-select");
  function goPhase(p){window.history.pushState({phase:p},"",window.location.pathname+window.location.search);setPhase(p);}

  const [posts,setPosts]=useState([]);
  const [progress,setProgress]=useState({done:0,total:0});
  const [ne,setNe]=useState("");
  const [showExport,setShowExport]=useState(false);
  const [saveStatus,setSaveStatus]=useState("");
  const [storageLoading,setStorageLoading]=useState(true);
  const [clients,setClients]=useState(loadClients);
  const [activeClient,setActiveClient]=useState(()=>loadClients()[0]||DEFAULT_CLIENTS[0]);
  const [savedGantts,setSavedGantts]=useState([]);
  const [shareId,setShareId]=useState(null);
  const [shareLoading,setShareLoading]=useState(false);
  const [shareCopied,setShareCopied]=useState(false);
  const [isClientView,setIsClientView]=useState(false);
  const [clientFeedback,setClientFeedback]=useState({});
  const [clientName,setClientName]=useState("");
  const [sending,setSending]=useState(false);
  const [sent,setSent]=useState(false);

  const c=getCtx(month);
  const doneCount=posts.filter(p=>p.copy).length;
  const autoTotal=posts.filter(p=>AUTO.includes(p.tk)).length;
  const isDone=progress.done>=autoTotal&&autoTotal>0;
  const pct=autoTotal>0?Math.round((progress.done/autoTotal)*100):0;

  /* ── CLIENT VIEW CHECK ── */
  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const gid=params.get("gantt");
    if(gid){
      setIsClientView(true);setShareId(gid);setPhase("gantt");
      loadGanttFromSupabase(gid).then(data=>{
        if(data){setYear(data.year);setMonth(data.month);setNe(data.ne||"");setPosts(deserializePosts(data.posts));}
        setStorageLoading(false);
      });
      getComments(gid).then(()=>{});
    }
  },[]);

  /* ── BROWSER BACK ── */
  useEffect(()=>{
    const handler=(e)=>{if(e.state?.phase)setPhase(e.state.phase);else goPhase("client-select");};
    window.addEventListener("popstate",handler);return()=>window.removeEventListener("popstate",handler);
  },[]);

  /* ── LOAD ON MOUNT ── */
  useEffect(()=>{
    async function load(){
      try{
        const list=listSavedGantts();setSavedGantts(list);
        const legacy=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");
        if(legacy&&legacy.posts&&legacy.posts.length>0){
          saveGanttToStorage(legacy.year||now.getFullYear(),legacy.month||now.getMonth()+1,legacy.ne||"",deserializePosts(legacy.posts));
          localStorage.removeItem(STORAGE_KEY);setSavedGantts(listSavedGantts());
        }
      }catch(e){}
      setStorageLoading(false);
    }
    load();
  },[]);

  /* ── AUTO SAVE ── */
  useEffect(()=>{
    if(posts.length===0||storageLoading)return;
    setSaveStatus("saving");
    const timer=setTimeout(()=>{
      try{saveGanttToStorage(year,month,ne,posts);setSavedGantts(listSavedGantts());setSaveStatus("saved");setTimeout(()=>setSaveStatus(""),2500);}
      catch(e){setSaveStatus("");}
    },800);
    return()=>clearTimeout(timer);
  },[posts,year,month,ne]);

  function upd(updated){setPosts(prev=>prev.map(p=>p.id===updated.id?updated:p));}

  function loadGantt(g){
    const data=loadGanttFromStorage(g.year,g.month);if(!data)return;
    setYear(data.year);setMonth(data.month);setNe(data.ne||"");
    setPosts(deserializePosts(data.posts));setPhase("gantt");
    setSaveStatus("loaded");setTimeout(()=>setSaveStatus(""),3000);
  }

  function deleteGantt(g){deleteGanttFromStorage(g.year,g.month);setSavedGantts(listSavedGantts());}

  async function sendClientFeedback(){
    setSending(true);
    try{
      const approved=posts.filter(p=>clientFeedback[p.id]?.approved).map(p=>p.type);
      const notes=posts.filter(p=>clientFeedback[p.id]?.note).map(p=>({type:p.type,note:clientFeedback[p.id].note}));
      const promos=posts.filter(p=>p.tk==="promo"&&clientFeedback[p.id]?.promoText).map(p=>({num:p.num,text:clientFeedback[p.id].promoText}));
      const summaryParts=[];
      if(clientName)summaryParts.push("מאת: "+clientName);
      summaryParts.push("\n✅ פוסטים מאושרים ("+approved.length+"/"+posts.length+"):\n"+(approved.join(", ")||"אין"));
      if(notes.length)summaryParts.push("\n✏️ הערות:\n"+notes.map(n=>"• "+n.type+": "+n.note).join("\n"));
      if(promos.length)summaryParts.push("\n📦 מבצעים:\n"+promos.map(p=>"• פוסט "+p.num+": "+p.text).join("\n"));
      const summary=summaryParts.join("\n");
      if(shareId)await addComment(shareId,"summary","סיכום",summary,clientName,window.location.href);
      await fetch("/api/notify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({gantt_id:shareId||"unknown",post_type:"סיכום פידבק",comment:summary,author_name:clientName||"לקוח",gantt_url:window.location.href})});
      setSent(true);
    }catch(e){console.error(e);}
    setSending(false);
  }

  async function shareGantt(){
    setShareLoading(true);
    try{
      const id=shareId||makeShareId(year,month);
      const ok=await saveGanttToSupabase(id,year,month,ne,posts);
      if(ok){setShareId(id);saveGanttToStorage(year,month,ne,posts);setSavedGantts(listSavedGantts());}
    }catch(e){}
    setShareLoading(false);
  }

  function copyShareLink(){
    const url=`${window.location.origin}?gantt=${shareId}`;
    navigator.clipboard.writeText(url).then(()=>{setShareCopied(true);setTimeout(()=>setShareCopied(false),3000);});
  }

  async function runAuto(arr){
    const auto=arr.filter(p=>AUTO.includes(p.tk));
    setProgress({done:0,total:auto.length});
    for(const post of auto){
      let prompt="";const localCtx=getCtx(month);
      if(post.tk==="monday")prompt=pMonday(post.date,localCtx,ne,"");
      else if(post.tk==="holiday")prompt=pHoliday(post.date,localCtx,ne,"");
      else if(post.tk==="fun")prompt=pFun(post.date,localCtx,ne,"");
      else if(post.tk==="recruit")prompt=pRecruit(post.date,localCtx,ne,"");
      let copy="";
      for(let attempt=0;attempt<2;attempt++){
        try{copy=await callAI(prompt);if(copy)break;}
        catch(e){if(attempt===0)await new Promise(r=>setTimeout(r,1500));}
      }
      setPosts(prev=>prev.map(p=>p.id===post.id?{...p,copy}:p));
      setProgress(prev=>({...prev,done:prev.done+1}));
    }
  }

  function handleBuild(){
    const arr=buildSchedule(year,month);
    setPosts(arr);setProgress({done:0,total:0});goPhase("gantt");runAuto(arr);
  }

  /* ── LOADING SCREEN ── */
  if(storageLoading)return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Arial,sans-serif",direction:"rtl"}}>
      <div style={{textAlign:"center",color:BL}}><div style={{fontSize:32,marginBottom:12}}>⏳</div><div style={{fontWeight:700,fontSize:16}}>טוען נתונים שמורים...</div></div>
    </div>
  );

  /* ── CLIENT SELECT ── */
  if(phase==="client-select")return(
    <ClientSelectScreen clients={clients}
      onSelect={cl=>{setActiveClient(cl);goPhase("setup");}}
      onAdd={cl=>{const u=[...clients,cl];setClients(u);saveClients(u);}}/>
  );

  /* ── SAVED LIST ── */
  if(phase==="list")return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Arial,sans-serif",direction:"rtl"}}>
      <div style={{background:`linear-gradient(135deg,${BL} 0%,#0D47A1 100%)`,padding:"13px 22px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:WH,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:BL,fontWeight:900,fontSize:17}}>1</span><span style={{color:RD,fontWeight:900,fontSize:17}}>0</span>
          </div>
          <div style={{color:WH,fontSize:17,fontWeight:900}}>גאנטים שמורים</div>
        </div>
        <button onClick={()=>goPhase("setup")} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",color:WH,borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:700}}>＋ גאנט חדש</button>
      </div>
      <div style={{maxWidth:600,margin:"28px auto",padding:"0 16px"}}>
        {savedGantts.length===0?(
          <div style={{background:WH,borderRadius:16,padding:40,textAlign:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
            <div style={{fontSize:48,marginBottom:12}}>📭</div>
            <div style={{color:DK,fontWeight:700,fontSize:16,marginBottom:8}}>אין גאנטים שמורים עדיין</div>
            <button onClick={()=>goPhase("setup")} style={{background:BL,color:WH,border:"none",borderRadius:10,padding:"12px 28px",fontSize:15,fontWeight:800,cursor:"pointer"}}>＋ צור גאנט חדש</button>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{fontSize:13,color:"#78909C",marginBottom:4}}>{savedGantts.length} גאנטים שמורים בדפדפן</div>
            {savedGantts.map(g=>(
              <div key={`${g.year}-${g.month}`} style={{background:WH,borderRadius:12,padding:"16px 20px",boxShadow:"0 2px 10px rgba(0,0,0,0.07)",border:`1px solid ${BR}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:900,color:BL,fontSize:17}}>{MHE[g.month]} {g.year}</div>
                  <div style={{fontSize:12,color:"#78909C",marginTop:3}}>{getCtx(g.month).emoji} {getCtx(g.month).season} • {g.doneCount>0?`${g.doneCount} פוסטים מוכנים`:"טרם הושלם"} • נשמר {new Date(g.savedAt).toLocaleDateString("he-IL")}</div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>loadGantt(g)} style={{background:BL,color:WH,border:"none",borderRadius:8,padding:"9px 18px",cursor:"pointer",fontSize:13,fontWeight:800}}>📂 פתח</button>
                  <button onClick={()=>{if(window.confirm(`למחוק את גאנט ${MHE[g.month]} ${g.year}?`))deleteGantt(g);}} style={{background:"#FFEBEE",color:RD,border:`1px solid #FFCDD2`,borderRadius:8,padding:"9px 12px",cursor:"pointer",fontSize:13,fontWeight:700}}>🗑️</button>
                </div>
              </div>
            ))}
            <button onClick={()=>goPhase("setup")} style={{background:WH,color:BL,border:`2px solid ${BL}`,borderRadius:10,padding:"13px 0",fontSize:15,fontWeight:800,cursor:"pointer",marginTop:4}}>＋ צור גאנט חדש</button>
          </div>
        )}
      </div>
    </div>
  );

  /* ── SETUP ── */
  if(phase==="setup")return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Arial,sans-serif",direction:"rtl"}}>
      <div style={{background:DV_GRAD,padding:"20px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:14}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{cursor:"pointer"}} onClick={()=>goPhase("client-select")}>
            <img src={DAVID_LOGO} style={{height:36,opacity:0.92,filter:"brightness(0) invert(1)"}} alt="David Vatine"/>
          </div>
          <div>
            <div style={{color:WH,fontSize:20,fontWeight:900}}>גאנט AI | {activeClient?.name||"לקוח"}</div>
            <div style={{color:"rgba(255,255,255,0.8)",fontSize:13}}>9 פוסטים חודשיים | שמירה אוטומטית | ייצוא קל</div>
            <div style={{color:"rgba(255,255,255,0.5)",fontSize:11,marginTop:2}}>{APP_VERSION}</div>
          </div>
        </div>
        {savedGantts.length>0&&(
          <button onClick={()=>goPhase("list")} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.4)",color:WH,borderRadius:8,padding:"9px 16px",cursor:"pointer",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
            📂 גאנטים שמורים <span style={{background:RD,borderRadius:"50%",width:20,height:20,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900}}>{savedGantts.length}</span>
          </button>
        )}
      </div>
      <div style={{maxWidth:600,margin:"32px auto",padding:"0 16px"}}>
        <div style={{background:WH,borderRadius:16,padding:32,boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
          <h2 style={{color:BL,fontSize:20,fontWeight:900,marginBottom:24,textAlign:"center"}}>בחר חודש לגאנט</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:18}}>
            <div>
              <label style={{fontSize:13,fontWeight:700,color:DK,display:"block",marginBottom:6}}>חודש</label>
              <select value={month} onChange={e=>setMonth(+e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`2px solid ${BL}`,fontSize:15,fontWeight:700}}>
                {MHE.slice(1).map((n,i)=><option key={i+1} value={i+1}>{n}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:13,fontWeight:700,color:DK,display:"block",marginBottom:6}}>שנה</label>
              <select value={year} onChange={e=>setYear(+e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`2px solid ${BL}`,fontSize:15,fontWeight:700}}>
                {[2025,2026,2027].map(y=><option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div style={{background:"#F0F7FF",borderRadius:10,padding:"13px 16px",marginBottom:16,border:`1px solid #BBDEFB`,fontSize:13,lineHeight:1.9}}>
            <div style={{fontWeight:800,color:BL,marginBottom:6}}>{c.emoji} הקשר ל-{MHE[month]} {year}</div>
            <div><strong>עונה:</strong> {c.season} | {c.weather}</div>
            <div><strong>חגים:</strong> {c.holidays.map(h=>`${h.n} (${h.d}.${month})`).join(", ")||"אין"}</div>
            <div style={{marginTop:5,color:"#455A64"}}><strong>תקשורת:</strong> {c.news}</div>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{fontSize:13,fontWeight:700,color:DK,display:"block",marginBottom:5}}>📰 הקשר תקשורתי נוסף</label>
            <textarea value={ne} onChange={e=>setNe(e.target.value)} placeholder="למשל: עלייה במחירי דלק, גל חום..."
              style={{width:"100%",height:66,padding:"9px 11px",borderRadius:8,border:`1px solid ${BR}`,fontSize:13,resize:"vertical",boxSizing:"border-box",fontFamily:"Arial"}}/>
          </div>
          <div style={{background:"#FFF8F8",borderRadius:10,padding:"12px 16px",marginBottom:24,border:`1px solid #FFCDD2`,fontSize:13,lineHeight:2}}>
            <div style={{fontWeight:800,color:RD,marginBottom:5}}>📌 מה יקרה</div>
            ✅ 5 פוסטים ייוצרו אוטומטית ← ⭕ 4 פוסטי מבצע ריקים<br/>
            💾 שמירה אוטומטית ← רענון הדף לא ימחק כלום<br/>
            📤 ייצוא: העתק טקסט / תצוגה מקדימה ללקוח
          </div>
          <button onClick={handleBuild} style={{width:"100%",background:BL,color:WH,border:"none",borderRadius:10,padding:"15px 0",fontSize:17,fontWeight:900,cursor:"pointer",boxShadow:`0 4px 16px ${BL}55`}}>
            🚀 בנה גאנט ל-{MHE[month]} {year}
          </button>
        </div>
      </div>
    </div>
  );

  /* ── GANTT ── */
  return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Arial,sans-serif",direction:"rtl"}}>
      {showExport&&<ExportModal posts={posts} month={month} year={year} c={c} onClose={()=>setShowExport(false)}/>}

      {/* Client header */}
      {isClientView&&(
        <div style={{background:DV_GRAD,padding:"14px 24px",display:"flex",alignItems:"center",gap:14}}>
          <img src={DAVID_LOGO} style={{height:32,opacity:0.9,filter:"brightness(0) invert(1)",flexShrink:0}} alt="David Vatine"/>
          <div style={{width:1,height:36,background:"rgba(255,255,255,0.3)",flexShrink:0}}/>
          <div style={{flex:1}}>
            <div style={{color:WH,fontSize:16,fontWeight:900}}>גאנט {MHE[month]} {year} — {activeClient?.name||"דלק Ten"}</div>
            <div style={{color:"rgba(255,255,255,0.75)",fontSize:11,marginTop:2}}>עברו על הפוסטים, אשרו או הוסיפו הערות, ולחצו שלח בסוף</div>
          </div>
        </div>
      )}

      {/* Manager header */}
      {!isClientView&&(
        <div style={{background:`linear-gradient(135deg,${BL} 0%,#0D47A1 100%)`,padding:"13px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{cursor:"pointer"}} onClick={()=>goPhase("client-select")}>
              <img src={DAVID_LOGO} style={{height:30,opacity:0.9,filter:"brightness(0) invert(1)"}} alt="David Vatine"/>
            </div>
            <div>
              <div style={{color:WH,fontSize:17,fontWeight:900}}>גאנט {MHE[month]} {year} — {activeClient?.name||"לקוח"}</div>
              <div style={{color:"rgba(255,255,255,0.75)",fontSize:11,display:"flex",alignItems:"center",gap:8}}>
                <span>{c.emoji} {c.season} | {doneCount}/{posts.length} מוכנים | {APP_VERSION}</span>
                {saveStatus==="saving"&&<span style={{background:"rgba(255,255,255,0.15)",padding:"1px 8px",borderRadius:10,fontSize:10}}>💾 שומר...</span>}
                {saveStatus==="saved"&&<span style={{background:"rgba(76,175,80,0.4)",padding:"1px 8px",borderRadius:10,fontSize:10}}>✅ נשמר</span>}
                {saveStatus==="loaded"&&<span style={{background:"rgba(255,193,7,0.4)",padding:"1px 8px",borderRadius:10,fontSize:10}}>📂 נטען</span>}
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button onClick={()=>setShowExport(true)} style={{background:"#4CAF50",color:WH,border:"none",borderRadius:8,padding:"8px 18px",cursor:"pointer",fontSize:13,fontWeight:800}}>📤 ייצוא</button>
            {!shareId?(
              <button onClick={shareGantt} disabled={shareLoading} style={{background:"#FF6F00",color:WH,border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:800,opacity:shareLoading?0.7:1}}>{shareLoading?"⏳ שומר...":"🔗 שתף ללקוח"}</button>
            ):(
              <button onClick={copyShareLink} style={{background:shareCopied?"#388E3C":"#FF6F00",color:WH,border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:800}}>{shareCopied?"✅ הועתק!":"🔗 העתק לינק ללקוח"}</button>
            )}
            <button onClick={()=>goPhase("list")} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",color:WH,borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:700}}>📂 גאנטים שמורים</button>
          </div>
        </div>
      )}

      <div style={{maxWidth:1060,margin:"0 auto",padding:"18px 16px"}}>
        {/* Progress bar */}
        {!isDone&&autoTotal>0&&(
          <div style={{background:WH,borderRadius:12,padding:"13px 18px",marginBottom:14,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{fontWeight:700,color:BL,fontSize:13}}>⚙️ מייצר {autoTotal} פוסטים אוטומטית...</span>
              <span style={{fontWeight:700,color:BL}}>{progress.done}/{autoTotal}</span>
            </div>
            <div style={{height:8,background:"#E3F2FD",borderRadius:8,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${BL},${BLl})`,borderRadius:8,transition:"width 0.4s"}}/>
            </div>
          </div>
        )}
        {isDone&&(
          <div style={{background:"#E8F5E9",border:"1px solid #A5D6A7",borderRadius:12,padding:"11px 18px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>✅</span>
            <div>
              <div style={{fontWeight:800,color:"#1B5E20",fontSize:14}}>5 פוסטים נוצרו ונשמרו! לחץ "שתף ללקוח" לשיתוף.</div>
              <div style={{fontSize:12,color:"#388E3C"}}>4 פוסטי מבצע ממתינים לפרטים מהלקוח</div>
            </div>
          </div>
        )}

        {/* News bar */}
        <div style={{background:"#FFF8E1",border:"1px solid #FFE082",borderRadius:10,padding:"9px 14px",marginBottom:12,fontSize:12,color:"#5D4037"}}>
          <strong>📰</strong> {ne||c.news}
        </div>

        {/* Summary table */}
        <div style={{background:WH,borderRadius:12,marginBottom:14,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",border:`1px solid ${BR}`}}>
          <div style={{background:BL,padding:"9px 16px",color:WH,fontWeight:800,fontSize:13}}>📋 סיכום גאנט | {MHE[month]} {year}</div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,direction:"rtl"}}>
            <thead>
              <tr style={{background:"#F0F7FF"}}>{["#","תאריך","יום","סוג פוסט","סטטוס"].map(h=><th key={h} style={{padding:"7px 13px",textAlign:"right",color:BL,fontWeight:700,fontSize:12}}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {posts.map((p,i)=>(
                <tr key={p.id} style={{borderTop:`1px solid ${BR}`,background:i%2===0?WH:"#FAFBFC"}}>
                  <td style={{padding:"7px 13px",fontWeight:700,color:BL}}>{p.num}</td>
                  <td style={{padding:"7px 13px",fontWeight:600}}>{p.date?fmt(p.date):"לפי מבצע"}</td>
                  <td style={{padding:"7px 13px"}}>{p.date?dn(p.date):""}</td>
                  <td style={{padding:"7px 13px"}}><Badge type={p.type}/></td>
                  <td style={{padding:"7px 13px",fontSize:12}}>{p.copy?<span style={{color:"#4CAF50",fontWeight:700}}>✅</span>:p.tk==="promo"?<span style={{color:RD,fontWeight:700}}>⭕</span>:<span style={{color:"#FF9800"}}>⏳</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Posts */}
        {isClientView?(
          <>
            <div style={{background:"white",borderRadius:10,padding:"12px 16px",marginBottom:14,fontSize:13,color:"#37474F",border:"1px solid #CFD8DC"}}>
              <strong>איך זה עובד:</strong> עבור כל פוסט — לחץ ✅ מאושר או הוסף הערה. בסוף לחץ <strong>שלח</strong>.
            </div>
            <input value={clientName} onChange={e=>setClientName(e.target.value)} placeholder="שמך (אופציונלי)"
              style={{width:"100%",padding:"9px 12px",borderRadius:8,border:"1px solid #CFD8DC",fontSize:13,marginBottom:12,boxSizing:"border-box",fontFamily:"Arial"}}/>
            {posts.map(p=><ClientPostRow key={p.id} post={p} feedback={clientFeedback[p.id]} onChange={fb=>setClientFeedback(prev=>({...prev,[p.id]:fb}))}/>)}
            {sent?(
              <div style={{background:"#E8F5E9",border:"1px solid #A5D6A7",borderRadius:12,padding:"20px",textAlign:"center",marginTop:8}}>
                <div style={{fontSize:28,marginBottom:8}}>🎉</div>
                <div style={{fontWeight:800,color:"#1B5E20",fontSize:16}}>הפידבק נשלח בהצלחה!</div>
                <div style={{color:"#388E3C",fontSize:13,marginTop:4}}>הצוות יקבל את ההערות שלך בקרוב</div>
              </div>
            ):(
              <button onClick={sendClientFeedback} disabled={sending}
                style={{width:"100%",background:DV_GRAD2,color:WH,border:"none",borderRadius:10,padding:"15px 0",fontSize:16,fontWeight:900,cursor:"pointer",marginTop:8,boxShadow:"0 4px 16px rgba(109,40,217,0.4)",opacity:sending?0.7:1}}>
                {sending?"⏳ שולח...":"📨 שלח פידבק לצוות"}
              </button>
            )}
          </>
        ):(
          posts.map(p=><PostCard key={p.id} post={p} c={c} month={month} ne={ne} onUpdate={upd} isClient={false}/>)
        )}

        <div style={{background:"#E8EAF6",borderRadius:10,padding:"13px 18px",fontSize:12,color:"#283593",border:"1px solid #9FA8DA",marginTop:6,lineHeight:1.8}}>
          <strong>📤 איך לשתף ללקוח:</strong><br/>
          לחץ <strong>"שתף ללקוח"</strong> ← העתק את הלינק ← שלח ללקוח<br/>
          הלקוח יוכל לאשר פוסטים, להוסיף הערות ולמלא פרטי מבצעים
        </div>
      </div>
    </div>
  );
}
