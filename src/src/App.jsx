import { useState, useRef, useEffect } from "react";

const TOOLS = [
  { id: "cv", icon: "📄", label: "CV / Resume", desc: "Professional resume for any job", cost: 2 },
  { id: "cover", icon: "✉️", label: "Cover Letter", desc: "Stand out to any employer", cost: 2 },
  { id: "business", icon: "💼", label: "Business Letter", desc: "Proposals, contracts & formal letters", cost: 2 },
  { id: "essay", icon: "📝", label: "Essay / Assignment", desc: "Academic writing & reports", cost: 3 },
  { id: "email", icon: "📧", label: "Professional Email", desc: "Emails that get results", cost: 1 },
  { id: "social", icon: "📱", label: "Social Media", desc: "Captions for any platform", cost: 1 },
  { id: "bio", icon: "🧑", label: "Personal Bio", desc: "LinkedIn, website & app bios", cost: 1 },
  { id: "sales", icon: "💰", label: "Sales Copy", desc: "Product descriptions & ads", cost: 2 },
  { id: "speech", icon: "🎤", label: "Speech / Presentation", desc: "Weddings, events, pitches", cost: 3 },
  { id: "blog", icon: "✍️", label: "Blog Post", desc: "SEO-ready articles & posts", cost: 3 },
  { id: "legal", icon: "⚖️", label: "Legal Document", desc: "Agreements, NDAs & notices", cost: 3 },
  { id: "translate", icon: "🌐", label: "Translate & Rewrite", desc: "Translate or rewrite any text", cost: 2 },
];

const PLANS = [
  { id: "basic", label: "Basic", credits: 10, price: "$1.99", color: "#6C63FF", sub: "One-time top-up" },
  { id: "pro", label: "Pro", credits: 50, price: "$6.99", color: "#00C896", sub: "Most popular", badge: "Best Value" },
  { id: "unlimited", label: "Unlimited", credits: 9999, price: "$12.99/mo", color: "#FF6B6B", sub: "Unlimited writes", badge: "🔥 Hot" },
];

const TONES = ["Professional", "Friendly", "Formal", "Persuasive", "Casual", "Confident"];
const LANGUAGES = ["English", "French", "Spanish", "Arabic", "Portuguese", "German", "Chinese", "Swahili"];

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [credits, setCredits] = useState(5);
  const [selectedTool, setSelectedTool] = useState(null);
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [language, setLanguage] = useState("English");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [toast, setToast] = useState("");
  const [activeTab, setActiveTab] = useState("tools");
  const outputRef = useRef(null);

  useEffect(() => {
    if (screen === "splash") {
      const t = setTimeout(() => setScreen("home"), 2600);
      return () => clearTimeout(t);
    }
  }, [screen]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = (msg) => setToast(msg);

  const handleGenerate = async () => {
    if (!topic.trim()) { setError("Please describe what you want to write."); return; }
    if (credits < selectedTool.cost) { setShowPaywall(true); return; }
    setError("");
    setLoading(true);
    setOutput("");

    const prompts = {
      cv: `Create a polished, professional CV/Resume. Details: ${topic}. Include: Profile Summary, Work Experience, Education, Skills, Achievements. Output in ${language}.`,
      cover: `Write a compelling cover letter. Details: ${topic}. Tone: ${tone}. Output in ${language}.`,
      business: `Write a professional business letter. Details: ${topic}. Tone: ${tone}. Output in ${language}.`,
      essay: `Write a well-structured essay. Topic: ${topic}. Tone: ${tone}. Output in ${language}.`,
      email: `Write a professional email. Details: ${topic}. Tone: ${tone}. Include subject line. Output in ${language}.`,
      social: `Write an engaging social media caption. About: ${topic}. Tone: ${tone}. Include hashtags. Output in ${language}.`,
      bio: `Write a compelling personal bio. Details: ${topic}. Tone: ${tone}. Output in ${language}.`,
      sales: `Write persuasive sales copy. About: ${topic}. Tone: ${tone}. Output in ${language}.`,
      speech: `Write an engaging speech. About: ${topic}. Tone: ${tone}. Output in ${language}.`,
      blog: `Write a complete blog post. Topic: ${topic}. Tone: ${tone}. Output in ${language}.`,
      legal: `Draft a basic legal document. Details: ${topic}. Output in ${language}.`,
      translate: `Rewrite or translate: ${topic}. Target language: ${language}.`,
    };

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are WriteAI, a world-class AI writing assistant. Produce high-quality, professional writing for any country or context.",
          messages: [{ role: "user", content: prompts[selectedTool.id] }],
        }),
      });
      const data = await res.json();
      const text = data?.content?.[0]?.text || "Something went wrong. Please try again.";
      setOutput(text);
      setCredits(c => c - selectedTool.cost);
      showToast(`✅ Done! ${selectedTool.cost} credits used`);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      setOutput("❌ Error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(output);
    showToast("📋 Copied!");
  };

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800;900&family=Satoshi:wght@400;500;700&display=swap');
    * { box-sizing: border-box; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
    @keyframes spin { to{transform:rotate(360deg)} }
    @keyframes pulse { 0%,100%{opacity:0.4;transform:scale(0.85)} 50%{opacity:1;transform:scale(1)} }
    @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
    @keyframes orbFloat { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-20px)} }
    .tool-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; }
    .plan-card:hover { transform: scale(1.02); }
    textarea:focus { border-color: #6C63FF !important; outline: none; }
  `;

  if (screen === "splash") return (
    <div style={s.splash}>
      <style>{globalStyles}</style>
      <div style={s.splashOrb1} />
      <div style={s.splashOrb2} />
      <div style={{position:"relative",textAlign:"center",animation:"fadeUp 0.9s ease forwards"}}>
        <div style={s.splashIcon}>✦</div>
        <h1 style={s.splashTitle}>WriteAI</h1>
        <p style={s.splashTagline}>The world's writing assistant</p>
        <div style={s.dotRow}>
          {[0,0.25,0.5].map((d,i) => <span key={i} style={{...s.dot, animationDelay:`${d}s`}} />)}
        </div>
      </div>
    </div>
  );

  if (showPaywall) return (
    <div style={s.container}>
      <style>{globalStyles}</style>
      {toast && <div style={s.toast}>{toast}</div>}
      <div style={s.header}>
        <button onClick={() => setShowPaywall(false)} style={s.backBtn}>← Back</button>
        <span style={s.headerTitle}>Get Credits</span>
        <span />
      </div>
      <div style={{padding:"0 20px 40px"}}>
        <div style={s.paywallHero}>
          <div style={{fontSize:48,marginBottom:12}}>⚡</div>
          <h2 style={{fontFamily:"Cabinet Grotesk",color:"#fff",margin:"0 0 6px",fontSize:24}}>Top Up Credits</h2>
          <p style={{color:"rgba(255,255,255,0.75)",fontSize:14,margin:0}}>Write more, pay only for what you use</p>
        </div>
        {PLANS.map(p => (
          <div key={p.id} className="plan-card" style={{...s.planCard, borderColor:p.color}}
            onClick={() => { setCredits(c => c + (p.credits === 9999 ? 100 : p.credits)); setShowPaywall(false); showToast(`🎉 Credits added!`); }}>
            {p.badge && <span style={{...s.badge, background:p.color}}>{p.badge}</span>}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontFamily:"Cabinet Grotesk",fontSize:20,fontWeight:800,color:"#0f0f0f"}}>{p.label}</div>
                <div style={{color:"#888",fontSize:13,marginTop:2}}>{p.sub}</div>
              </div>
              <div style={{fontFamily:"Cabinet Grotesk",fontSize:22,fontWeight:900,color:p.color}}>{p.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (selectedTool) return (
    <div style={s.container}>
      <style>{globalStyles}</style>
      {toast && <div style={s.toast}>{toast}</div>}
      <div style={s.header}>
        <button onClick={() => { setSelectedTool(null); setOutput(""); setTopic(""); setError(""); }} style={s.backBtn}>← Back</button>
        <span style={s.headerTitle}>{selectedTool.icon} {selectedTool.label}</span>
        <span style={s.credBadge}>⚡{credits}</span>
      </div>
      <div style={{padding:"0 20px 100px"}}>
        <div style={s.costTag}>Uses {selectedTool.cost} credits</div>
        <label style={s.label}>What do you want to write?</label>
        <textarea value={topic} onChange={e => { setTopic(e.target.value); setError(""); }} placeholder="Describe what you want to write in detail..." style={s.textarea} rows={5} />
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:4}}>
          <div>
            <label style={s.label}>Tone</label>
            <select value={tone} onChange={e => setTone(e.target.value)} style={s.select}>
              {TONES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>Language</label>
            <select value={language} onChange={e => setLanguage(e.target.value)} style={s.select}>
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
        {error && <div style={s.errorBox}>{error}</div>}
        <button onClick={handleGenerate} disabled={loading} style={{...s.genBtn, opacity:loading?0.75:1}}>
          {loading && <span style={s.spinner} />}
          {loading ? " Generating..." : `✦ Generate — ${selectedTool.cost} credits`}
        </button>
        {output && (
          <div ref={outputRef} style={s.outputBox}>
            <div style={s.outputTop}>
              <span style={{fontFamily:"Cabinet Grotesk",fontWeight:800,fontSize:15,color:"#0f0f0f"}}>Your Content</span>
              <button onClick={copyText} style={s.copyBtn}>📋 Copy</button>
            </div>
            <p style={s.outputText}>{output}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={s.container}>
      <style>{globalStyles}</style>
      {toast && <div style={s.toast}>{toast}</div>}
      <div style={s.hero}>
        <div style={s.heroOrb} />
        <div style={{position:"relative"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div>
              <p style={s.heroEyebrow}>✦ AI Writing Assistant</p>
              <h1 style={s.heroTitle}>WriteAI</h1>
              <p style={s.heroSub}>Write anything. Any language. Any country.</p>
            </div>
            <button onClick={() => setShowPaywall(true)} style={s.credBtn}>
              <span style={{fontSize:18}}>⚡</span>
              <span style={{fontFamily:"Cabinet Grotesk",fontWeight:900,fontSize:20,lineHeight:1}}>{credits}</span>
              <span style={{fontSize:10,opacity:0.75}}>credits</span>
            </button>
          </div>
          <div style={s.heroStats}>
            <span style={s.stat}>🌍 190+ Countries</span>
            <span style={s.stat}>📝 12 Tools</span>
            <span style={s.stat}>🗣️ 8 Languages</span>
          </div>
        </div>
      </div>
      <div style={s.tabBar}>
        {["tools","plans"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{...s.tab, ...(activeTab===tab ? s.tabActive : {})}}>
            {tab === "tools" ? "✦ Writing Tools" : "⚡ Get Credits"}
          </button>
        ))}
      </div>
      <div style={{padding:"0 20px 100px"}}>
        {activeTab === "tools" && (
          <>
            {credits <= 2 && <div style={s.lowBanner} onClick={() => setShowPaywall(true)}>⚡ Low credits — tap to top up →</div>}
            <div style={s.grid}>
              {TOOLS.map((tool, i) => (
                <div key={tool.id} className="tool-card" style={{...s.toolCard, animationDelay:`${i*0.05}s`}}
                  onClick={() => { setSelectedTool(tool); setOutput(""); setTopic(""); setError(""); }}>
                  <div style={s.toolIcon}>{tool.icon}</div>
                  <div style={s.toolName}>{tool.label}</div>
                  <div style={s.toolDesc}>{tool.desc}</div>
                  <div style={s.toolCredit}>⚡ {tool.cost}</div>
                </div>
              ))}
            </div>
          </>
        )}
        {activeTab === "plans" && (
          <div style={{marginTop:16}}>
            <h2 style={{fontFamily:"Cabinet Grotesk",fontSize:22,fontWeight:900,color:"#0f0f0f",marginBottom:4}}>Choose a Plan</h2>
            <p style={{color:"#888",fontSize:14,marginBottom:24}}>Pay once or subscribe for unlimited writes</p>
            {PLANS.map(p => (
              <div key={p.id} className="plan-card" style={{...s.planCard, borderColor:p.color}}
                onClick={() => { setCredits(c => c + (p.credits === 9999 ? 100 : p.credits)); showToast("🎉 Credits added!"); }}>
                {p.badge && <span style={{...s.badge, background:p.color}}>{p.badge}</span>}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontFamily:"Cabinet Grotesk",fontSize:20,fontWeight:800,color:"#0f0f0f"}}>{p.label}</div>
                    <div style={{color:"#888",fontSize:13,marginTop:2}}>{p.sub}</div>
                  </div>
                  <div style={{fontFamily:"Cabinet Grotesk",fontSize:22,fontWeight:900,color:p.color}}>{p.price}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  splash: { minHeight:"100vh", background:"#0a0a0f", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Satoshi',sans-serif", overflow:"hidden", position:"relative" },
  splashOrb1: { position:"absolute", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(108,99,255,0.35) 0%,transparent 70%)", top:"-10%", left:"-10%" },
  splashOrb2: { position:"absolute", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(0,200,150,0.25) 0%,transparent 70%)", bottom:"5%", right:"-5%" },
  splashIcon: { fontSize:48, color:"#6C63FF", marginBottom:16, display:"block" },
  splashTitle: { fontFamily:"Cabinet Grotesk", fontSize:52, fontWeight:900, color:"#fff", margin:"0 0 8px", letterSpacing:"-2px" },
  splashTagline: { color:"rgba(255,255,255,0.55)", fontSize:16, margin:"0 0 32px" },
  dotRow: { display:"flex", gap:10, justifyContent:"center" },
  dot: { width:9, height:9, borderRadius:"50%", background:"#6C63FF", display:"inline-block", animation:"pulse 1.2s ease-in-out infinite" },
  container: { minHeight:"100vh", background:"#f8f8fc", fontFamily:"'Satoshi',sans-serif", maxWidth:430, margin:"0 auto", position:"relative" },
  header: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", background:"#fff", borderBottom:"1px solid #ebebf0", position:"sticky", top:0, zIndex:10 },
  backBtn: { background:"none", border:"none", fontFamily:"'Satoshi',sans-serif", fontSize:15, color:"#6C63FF", cursor:"pointer", fontWeight:700, padding:0 },
  headerTitle: { fontFamily:"Cabinet Grotesk", fontWeight:800, fontSize:16, color:"#0f0f0f" },
  credBadge: { background:"#0f0f0f", color:"#6C63FF", borderRadius:20, padding:"4px 12px", fontSize:13, fontWeight:800, fontFamily:"Cabinet Grotesk" },
  hero: { background:"#0f0f0f", padding:"28px 20px 24px", position:"relative", overflow:"hidden" },
  heroOrb: { position:"absolute", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(108,99,255,0.2) 0%,transparent 70%)", top:"-50%", right:"-10%", pointerEvents:"none" },
  heroEyebrow: { color:"#6C63FF", fontSize:12, fontWeight:700, letterSpacing:"1px", margin:"0 0 6px", textTransform:"uppercase" },
  heroTitle: { fontFamily:"Cabinet Grotesk", fontSize:36, fontWeight:900, color:"#fff", margin:"0 0 6px", letterSpacing:"-1.5px" },
  heroSub: { color:"rgba(255,255,255,0.55)", fontSize:14, margin:"0 0 16px" },
  heroStats: { display:"flex", gap:8, flexWrap:"wrap" },
  stat: { background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, padding:"5px 12px", fontSize:12, color:"rgba(255,255,255,0.7)" },
  credBtn: { background:"rgba(108,99,255,0.15)", border:"1.5px solid rgba(108,99,255,0.4)", borderRadius:16, padding:"8px 14px", display:"flex", flexDirection:"column", alignItems:"center", cursor:"pointer", color:"#6C63FF", gap:1 },
  tabBar: { display:"flex", background:"#fff", borderBottom:"1px solid #ebebf0", padding:"0 20px" },
  tab: { flex:1, border:"none", background:"none", padding:"14px 0", fontSize:13, fontWeight:700, color:"#aaa", cursor:"pointer", fontFamily:"'Satoshi',sans-serif", borderBottom:"2.5px solid transparent", transition:"all 0.2s" },
  tabActive: { color:"#6C63FF", borderBottomColor:"#6C63FF" },
  grid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:20 },
  toolCard: { background:"#fff", borderRadius:18, padding:"16px 14px", cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.05)", border:"1.5px solid #ebebf0", transition:"all 0.2s", animation:"fadeUp 0.5s ease forwards", opacity:0 },
  toolIcon: { fontSize:26, marginBottom:8 },
  toolName: { fontFamily:"Cabinet Grotesk", fontWeight:800, fontSize:14, color:"#0f0f0f", marginBottom:4 },
  toolDesc: { fontSize:12, color:"#999", lineHeight:1.4, marginBottom:10 },
  toolCredit: { fontSize:11, color:"#6C63FF", fontWeight:700, background:"rgba(108,99,255,0.08)", borderRadius:8, padding:"3px 8px", display:"inline-block" },
  lowBanner: { background:"linear-gradient(90deg,#fff3cd,#fff8e7)", border:"1.5px solid #f4c842", borderRadius:12, padding:"11px 16px", fontSize:13, fontWeight:700, color:"#7d4e00", cursor:"pointer", marginTop:16 },
  label: { display:"block", fontFamily:"Cabinet Grotesk", fontWeight:800, fontSize:14, color:"#0f0f0f", marginBottom:8, marginTop:20 },
  textarea: { width:"100%", borderRadius:14, border:"1.5px solid #ddd", padding:"14px", fontSize:14, fontFamily:"'Satoshi',sans-serif", resize:"vertical", background:"#fff", lineHeight:1.6 },
  select: { width:"100%", borderRadius:12, border:"1.5px solid #ddd", padding:"11px 14px", fontSize:14, fontFamily:"'Satoshi',sans-serif", background:"#fff", color:"#0f0f0f", cursor:"pointer", outline:"none" },
  errorBox: { background:"#fff0f0", border:"1.5px solid #ffb3b3", borderRadius:12, padding:"10px 14px", fontSize:13, color:"#cc0000", marginTop:12 },
  costTag: { background:"rgba(108,99,255,0.08)", border:"1.5px solid rgba(108,99,255,0.2)", borderRadius:10, padding:"7px 14px", fontSize:13, color:"#6C63FF", fontWeight:700, marginTop:16, display:"inline-block" },
  genBtn: { width:"100%", background:"linear-gradient(135deg,#6C63FF,#4f46e5)", color:"#fff", border:"none", borderRadius:16, padding:"17px", fontSize:16, fontFamily:"Cabinet Grotesk", fontWeight:800, cursor:"pointer", marginTop:20, display:"flex", alignItems:"center", justifyContent:"center", gap:8
