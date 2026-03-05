import { useState } from "react";
import { BL, WH, BR, DK, DV_PURPLE, DAVID_LOGO } from "../constants.js";

export default function ClientSelectScreen({clients,onSelect,onAdd}){
  const [showAdd,setShowAdd]=useState(false);
  const [newName,setNewName]=useState("");
  const [newColor,setNewColor]=useState("#1565C0");

  function addClient(){
    if(!newName.trim())return;
    const nc={id:"c-"+Date.now(),name:newName.trim(),logo:null,color:newColor};
    onAdd(nc);setNewName("");setNewColor("#1565C0");setShowAdd(false);
  }

  return(
    <div style={{minHeight:"100vh",background:"#F5F0FF",fontFamily:"Arial,sans-serif",direction:"rtl",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:WH,borderRadius:20,padding:36,boxShadow:"0 8px 40px rgba(0,0,0,0.12)",maxWidth:460,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <img src={DAVID_LOGO} style={{height:48,display:"block",margin:"0 auto 16px"}} alt="David Vatine"/>
          <div style={{fontSize:22,fontWeight:900,color:DV_PURPLE}}>בחר לקוח</div>
          <div style={{fontSize:13,color:"#78909C",marginTop:4}}>בחר לקוח ליצירת גאנט</div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
          {clients.map(cl=>(
            <button key={cl.id} onClick={()=>onSelect(cl)}
              style={{display:"flex",alignItems:"center",gap:14,background:"#F8FAFF",border:`2px solid ${cl.color||BL}`,borderRadius:14,padding:"14px 18px",cursor:"pointer",textAlign:"right",width:"100%"}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:cl.color||BL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{color:"white",fontWeight:900,fontSize:22}}>{cl.name[0]}</span>
              </div>
              <div style={{flex:1,fontWeight:800,fontSize:16,color:DK}}>{cl.name}</div>
              <span style={{color:cl.color||BL,fontWeight:700,fontSize:20}}>←</span>
            </button>
          ))}
        </div>

        {showAdd?(
          <div style={{background:"#F8FAFF",borderRadius:12,padding:18,border:`1px solid ${BR}`}}>
            <div style={{fontWeight:700,fontSize:14,color:DK,marginBottom:12}}>לקוח חדש</div>
            <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="שם הלקוח"
              style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${BR}`,fontSize:14,fontFamily:"Arial",boxSizing:"border-box",marginBottom:10}}/>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <label style={{fontSize:13,color:"#78909C"}}>צבע:</label>
              <input type="color" value={newColor} onChange={e=>setNewColor(e.target.value)} style={{width:40,height:32,border:"none",borderRadius:6,cursor:"pointer"}}/>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={addClient} disabled={!newName.trim()} style={{flex:1,background:BL,color:WH,border:"none",borderRadius:8,padding:"9px 0",fontWeight:800,fontSize:14,cursor:"pointer",opacity:newName.trim()?1:0.5}}>➕ הוסף</button>
              <button onClick={()=>setShowAdd(false)} style={{background:"none",border:`1px solid ${BR}`,borderRadius:8,padding:"9px 16px",cursor:"pointer",fontSize:14}}>ביטול</button>
            </div>
          </div>
        ):(
          <button onClick={()=>setShowAdd(true)} style={{width:"100%",background:"none",border:`2px dashed ${BR}`,borderRadius:14,padding:"13px 0",cursor:"pointer",color:"#78909C",fontSize:14,fontWeight:700}}>
            ➕ הוסף לקוח חדש
          </button>
        )}
      </div>
    </div>
  );
}
