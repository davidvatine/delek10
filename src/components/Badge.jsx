import { BL } from "../constants.js";

export default function Badge({type}){
  const m={
    "שני חסכוני":["#E3F2FD",BL,"#90CAF9"],
    "חג / אירוע":["#E8F5E9","#1B5E20","#A5D6A7"],
    "מצחיק / אפליקציה":["#FFF3E0","#E65100","#FFCC80"],
    "דרושים":["#FCE4EC","#C62828","#F48FB1"],
    "פוסט מבצע":["#FFF8E1","#E65100","#FFE082"]
  };
  const [bg,color,border]=m[type]||["#F5F5F5","#333","#DDD"];
  return(
    <span style={{display:"inline-block",padding:"3px 11px",borderRadius:20,fontSize:11,fontWeight:800,background:bg,color,border:`1px solid ${border}`,whiteSpace:"nowrap"}}>
      {type}
    </span>
  );
}
