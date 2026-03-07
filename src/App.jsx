import React, { useState, useEffect } from "react";

// --- הגדרות עיצוב (David Vatine Premium) ---
const DV_PURPLE = "#6D28D9", DV_GRAD1 = "#7C3AED", DV_GRAD2 = "#4F46E5";
const BG_SOFT = "#F5F3FF", WH = "#fff", BR = "#E2E8F0", DK = "#1E293B";
const MHE = ["","ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];

// לוגו Ten ב-Base64 (כדי שיעבוד מיד)
const TEN_LOGO = "https://upload.wikimedia.org/wikipedia/he/thumb/3/30/Ten_logo.svg/1200px-Ten_logo.svg.png";

export default function App() {
  const [view, setView] = useState("select-client"); // views: select-client, setup, gantt
  const [selectedClient, setSelectedClient] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  // --- מסך 1: בחירת לקוח ---
  if (view === "select-client") {
    return (
      <div style={{ minHeight: "100vh", background: BG_SOFT, display: "flex", alignItems: "center", justifyContent: "center", direction: "rtl", fontFamily: "system-ui" }}>
        <div style={{ background: WH, padding: 40, borderRadius: 32, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)", textAlign: "center", width: "100%", maxWidth: 450 }}>
          <div style={{ background: "black", width: 80, height: 40, margin: "0 auto 20px", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#D946EF", fontWeight: 900, fontSize: 18 }}>David</span>
          </div>
          <h2 style={{ color: DV_PURPLE, fontWeight: 800, fontSize: 28, marginBottom: 8 }}>בחר לקוח</h2>
          <p style={{ color: "#64748B", marginBottom: 32 }}>בחר לקוח ליצירת גאנט</p>

          <div 
            onClick={() => { setSelectedClient("Ten"); setView("setup"); }}
            style={{ border: `2px solid ${DV_PURPLE}`, borderRadius: 20, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", transition: "all 0.2s" }}
          >
            <span style={{ color: DV_PURPLE, fontSize: 20 }}>←</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 20, color: DK }}>דלק Ten</span>
              <img src={TEN_LOGO} alt="Ten" style={{ width: 40, height: 40, borderRadius: "50%" }} />
            </div>
          </div>

          <button style={{ marginTop: 20, width: "100%", background: "none", border: `2px dashed ${BR}`, padding: 18, borderRadius: 20, color: "#94A3B8", fontWeight: 700, cursor: "not-allowed" }}>
            + הוסף לקוח חדש
          </button>
        </div>
      </div>
    );
  }

  // --- מסך 2: בחירת חודש (Setup) ---
  if (view === "setup") {
    return (
      <div style={{ minHeight: "100vh", background: BG_SOFT, display: "flex", alignItems: "center", justifyContent: "center", direction: "rtl", fontFamily: "system-ui" }}>
        <div style={{ background: WH, padding: 40, borderRadius: 32, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)", textAlign: "center", width: "100%", maxWidth: 450 }}>
          <div style={{ background: DV_PURPLE, width: 60, height: 60, borderRadius: 18, margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", color: WH, fontWeight: 900, fontSize: 22 }}>DV</div>
          <h2 style={{ color: DK, fontWeight: 800, fontSize: 32, marginBottom: 12 }}>מערכת גאנט תוכן</h2>
          <p style={{ color: "#64748B", marginBottom: 32 }}>ניהול תוכן חכם לרשת {selectedClient}</p>

          <select 
            value={month} 
            onChange={(e) => setMonth(+e.target.value)}
            style={{ width: "100%", padding: 18, borderRadius: 16, border: `2px solid ${BR}`, marginBottom: 24, fontSize: 18, fontWeight: 700, textAlign: "center", appearance: "none", outline: "none" }}
          >
            {MHE.map((m, i) => i > 0 && <option key={i} value={i}>{m}</option>)}
          </select>

          <button 
            onClick={() => setView("gantt")}
            style={{ width: "100%", padding: 20, background: `linear-gradient(135deg, ${DV_GRAD1}, ${DV_GRAD2})`, color: WH, border: "none", borderRadius: 18, fontSize: 18, fontWeight: 900, cursor: "pointer", boxShadow: "0 10px 25px rgba(109,40,217,0.3)" }}
          >
            צור גאנט {MHE[month]} 🚀
          </button>
          
          <button onClick={() => setView("select-client")} style={{ marginTop: 16, background: "none", border: "none", color: "#64748B", cursor: "pointer", fontWeight: 600 }}>חזור לבחירת לקוח</button>
        </div>
      </div>
    );
  }

  // --- מסך 3: הגאנט עצמו ---
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", direction: "rtl", fontFamily: "system-ui" }}>
      <header style={{ background: WH, padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${BR}`, sticky: "top" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: DV_PURPLE, color: WH, padding: "8px 14px", borderRadius: 10, fontWeight: 900 }}>DV</div>
          <h1 style={{ fontSize: 20, fontWeight: 800 }}>גאנט {selectedClient} | {MHE[month]} 2025</h1>
        </div>
        <button onClick={() => setView("setup")} style={{ background: "#F1F5F9", border: "none", padding: "10px 20px", borderRadius: 12, fontWeight: 700, cursor: "pointer", color: "#475569" }}>חזרה</button>
      </header>
      <main style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
        <div style={{ textAlign: "center", color: "#94A3B8", paddingTop: 100 }}>
          <p fontSize="20px">הגאנט בבנייה...</p>
        </div>
      </main>
    </div>
  );
}
