import { MD, DHE, MHE, STORAGE_KEY, GANTT_LIST_KEY, ganttKey, SUPABASE_URL, SUPABASE_KEY } from "./constants.js";

/* ─── CONTEXT ─────────────────────────────────────────────────────── */
export function getCtx(month){ return MD[month]||MD[1]; }

/* ─── DATE UTILS ──────────────────────────────────────────────────── */
export function fmt(d){ return d?`${d.getDate()}.${d.getMonth()+1}`:""; }
export function dn(d){ return d?DHE[d.getDay()]:""; }
export function pickDate(year,month,day){ return new Date(year,month-1,day); }

export function getMondays(year,month){
  const mondays=[];const d=new Date(year,month-1,1);
  while(d.getMonth()===month-1){if(d.getDay()===1)mondays.push(new Date(d));d.setDate(d.getDate()+1);}
  return mondays;
}

/* ─── SCHEDULE BUILDER ────────────────────────────────────────────── */
export function buildSchedule(year,month){
  const c=getCtx(month);const mondays=getMondays(year,month);const posts=[];let num=1;
  mondays.slice(0,4).forEach((mon,i)=>{
    if(i===0){posts.push({id:`p${num}`,num,tk:"monday",type:"שני חסכוני",date:mon,copy:"",val:"",image:null});num++;}
    else if(i===1){const hasH=c.holidays.some(h=>Math.abs(h.d-mon.getDate())<=10);posts.push({id:`p${num}`,num,tk:hasH?"holiday":"fun",type:hasH?"חג / אירוע":"מצחיק / אפליקציה",date:mon,copy:"",val:"",image:null});num++;}
    else if(i===2){posts.push({id:`p${num}`,num,tk:"monday",type:"שני חסכוני",date:mon,copy:"",val:"",image:null});num++;}
    else if(i===3){posts.push({id:`p${num}`,num,tk:"recruit",type:"דרושים",date:mon,copy:"",val:"",image:null});num++;}
  });
  const midDate=pickDate(year,month,14);const hasMidH=c.holidays.some(h=>Math.abs(h.d-14)<=8);
  posts.push({id:`p${num}`,num,tk:hasMidH?"holiday":"fun",type:hasMidH?"חג / אירוע":"מצחיק / אפליקציה",date:midDate,copy:"",val:"",image:null});num++;
  for(let i=0;i<4;i++){posts.push({id:`p${num}`,num,tk:"promo",type:"פוסט מבצע",date:null,copy:"",promoText:"",val:"",image:null});num++;}
  return posts;
}

/* ─── SERIALIZE ───────────────────────────────────────────────────── */
export function serializePosts(posts){ return posts.map(p=>({...p,date:p.date?p.date.toISOString():null})); }
export function deserializePosts(posts){ return posts.map(p=>({...p,date:p.date?new Date(p.date):null})); }

/* ─── LOCAL STORAGE ───────────────────────────────────────────────── */
export function listSavedGantts(){
  try{const list=JSON.parse(localStorage.getItem(GANTT_LIST_KEY)||"[]");return list.sort((a,b)=>b.year*100+b.month-(a.year*100+a.month));}catch(e){return[];}
}
export function saveGanttToStorage(year,month,ne,posts){
  try{
    const key=ganttKey(year,month);
    const data={year,month,ne,posts:serializePosts(posts),savedAt:new Date().toISOString(),doneCount:posts.filter(p=>p.copy).length};
    localStorage.setItem(key,JSON.stringify(data));
    const list=listSavedGantts().filter(g=>!(g.year===year&&g.month===month));
    list.push({year,month,savedAt:data.savedAt,doneCount:data.doneCount});
    localStorage.setItem(GANTT_LIST_KEY,JSON.stringify(list));
  }catch(e){}
}
export function loadGanttFromStorage(year,month){
  try{return JSON.parse(localStorage.getItem(ganttKey(year,month))||"null");}catch(e){return null;}
}
export function deleteGanttFromStorage(year,month){
  try{localStorage.removeItem(ganttKey(year,month));const list=listSavedGantts().filter(g=>!(g.year===year&&g.month===month));localStorage.setItem(GANTT_LIST_KEY,JSON.stringify(list));}catch(e){}
}

/* ─── SUPABASE ────────────────────────────────────────────────────── */
export function makeShareId(year,month){ return `gantt-${year}-${String(month).padStart(2,"0")}-${Math.random().toString(36).slice(2,6)}`; }

export async function saveGanttToSupabase(id,year,month,ne,posts){
  try{
    const res=await fetch(`${SUPABASE_URL}/rest/v1/gantts`,{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`,"Prefer":"resolution=merge-duplicates"},body:JSON.stringify({id,year,month,ne,posts:serializePosts(posts),updated_at:new Date().toISOString()})});
    return res.ok||res.status===409;
  }catch(e){return false;}
}
export async function loadGanttFromSupabase(id){
  try{
    const res=await fetch(`${SUPABASE_URL}/rest/v1/gantts?id=eq.${id}&select=*`,{headers:{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`}});
    if(!res.ok)return null;const data=await res.json();return data[0]||null;
  }catch(e){return null;}
}
export async function addComment(ganttId,postId,postType,comment,authorName,ganttUrl){
  try{await fetch(`${SUPABASE_URL}/rest/v1/comments`,{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`},body:JSON.stringify({gantt_id:ganttId,post_id:postId,post_type:postType,comment,author_name:authorName||"לקוח",gantt_url:ganttUrl,created_at:new Date().toISOString()})});}catch(e){}
}
export async function getComments(ganttId){
  try{const res=await fetch(`${SUPABASE_URL}/rest/v1/comments?gantt_id=eq.${ganttId}&select=*&order=created_at.desc`,{headers:{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`}});if(!res.ok)return[];return await res.json();}catch(e){return[];}
}
