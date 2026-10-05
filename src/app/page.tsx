"use client";

    import { useState } from "react";
    import { Activity, Apple, ArrowRight, Check, ChevronDown, CircleHelp, Dumbbell, HeartPulse, Lightbulb, Menu, MessageCircleHeart, MoreHorizontal, Plus, Sparkles, SunMedium, Utensils, X } from "lucide-react";

    type Item = { id: string; time: string; title: string; detail: string; tag: string; icon: "move" | "meal" | "water"; done: boolean };
    const starterPlan: Item[] = [
      { id: "walk", time: "7:00 AM", title: "Morning walk", detail: "25 minutes · easy pace", tag: "Movement", icon: "move", done: true },
      { id: "breakfast", time: "8:15 AM", title: "Breakfast", detail: "Vegetable poha · 1 cup tea", tag: "Meal", icon: "meal", done: true },
      { id: "water", time: "10:30 AM", title: "Hydration break", detail: "A glass of water + 5 almonds", tag: "Wellness", icon: "water", done: false },
      { id: "lunch", time: "1:00 PM", title: "Lunch", detail: "Dal, 2 rotis, cucumber salad", tag: "Meal", icon: "meal", done: false },
      { id: "stretch", time: "5:30 PM", title: "Stretch & strength", detail: "15 minutes · chair-friendly", tag: "Movement", icon: "move", done: false },
      { id: "dinner", time: "8:00 PM", title: "Dinner", detail: "Moong khichdi · curd · vegetables", tag: "Meal", icon: "meal", done: false },
    ];

    function ItemIcon({ type }: { type: Item["icon"] }) { return type === "move" ? <Dumbbell size={17} /> : type === "meal" ? <Utensils size={17} /> : <Activity size={17} />; }

    export default function Home() {
      const [plan, setPlan] = useState(starterPlan);
      const [menu, setMenu] = useState(false);
      const [coach, setCoach] = useState(false);
      const [note, setNote] = useState("");
      const [reply, setReply] = useState("");
      const [loading, setLoading] = useState(false);
      const done = plan.filter((item) => item.done).length;
      const toggle = (id: string) => setPlan((items) => items.map((item) => item.id === id ? { ...item, done: !item.done } : item));
      const askCoach = async () => {
        setLoading(true);
        try {
          const response = await fetch("/api/coach", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note }) });
          const data = await response.json();
          setReply(data.reply || "Start with one small, repeatable change today.");
        } catch { setReply("The coach is resting right now. Keep the plan gentle and consistent today."); }
        finally { setLoading(false); }
      };

      return <main className="app-shell">
        <aside className={`sidebar ${menu ? "sidebar-open" : ""}`}>
          <div className="brand"><span className="brand-mark"><HeartPulse size={20} /></span>sidekick</div><button className="close-menu" onClick={() => setMenu(false)} aria-label="Close menu"><X size={20} /></button>
          <div className="profile-card"><span className="avatar">D</span><span><strong>Dad&apos;s plan</strong><small>56 years · Active</small></span><MoreHorizontal size={17} /></div>
          <nav><a className="nav-item active" href="#today"><SunMedium size={18} /> Today</a><a className="nav-item" href="#meals"><Utensils size={18} /> Meals</a><a className="nav-item" href="#movement"><Dumbbell size={18} /> Movement</a><a className="nav-item" href="#progress"><Activity size={18} /> Progress</a></nav>
          <div className="sidebar-bottom"><div className="streak-card"><span className="streak-icon">✦</span><span><strong>4 day rhythm</strong><small>Keep it going</small></span></div><a className="help-link" href="#how-it-works"><CircleHelp size={17} /> How sidekick works</a><div className="powered"><i /> Powered by Gemma <b>Built with GitHub</b></div></div>
        </aside>
        <section className="main-content" id="today">
          <header className="topbar"><button className="menu-button" onClick={() => setMenu(true)} aria-label="Open menu"><Menu size={21} /></button><div className="date-select"><span className="eyebrow">TUESDAY, OCTOBER 6</span><button>Today <ChevronDown size={15} /></button></div><div className="top-actions"><button className="icon-button" aria-label="Messages"><MessageCircleHeart size={20} /></button><span className="mini-avatar">D</span></div></header>
          <div className="content-grid"><div className="primary-column">
            <section className="welcome-row"><div><p className="eyebrow accent">A GOOD DAY STARTS SMALL</p><h1>Good morning, Dad<span>.</span></h1><p className="muted">Here&apos;s a gentle plan for a strong, steady Tuesday.</p></div><div className="sun-badge"><SunMedium size={26} /><span>24°<small>pleasant</small></span></div></section>
            <section className="progress-strip"><div className="progress-copy"><span className="progress-ring"><Check size={15} /></span><span><strong>{done} of {plan.length} done</strong><small>You&apos;re building a lovely rhythm.</small></span></div><div className="progress-bar"><i style={{ width: `${done / plan.length * 100}%` }} /></div><b>{Math.round(done / plan.length * 100)}%</b></section>
            <div className="section-heading"><div><p className="eyebrow">YOUR DAY</p><h2>Today&apos;s rhythm</h2></div><button className="text-button"><Plus size={16} /> Add to day</button></div>
            <section className="timeline">{plan.map((item) => <div className={`timeline-row ${item.done ? "is-done" : ""}`} key={item.id}><span className="time-label">{item.time}</span><span className="timeline-line"><i /></span><button className="plan-card" onClick={() => toggle(item.id)}><span className={`plan-icon icon-${item.icon}`}><ItemIcon type={item.icon} /></span><span className="plan-info"><strong>{item.title}</strong><small>{item.detail}</small></span><span className="plan-tag">{item.tag}</span><span className={`check-box ${item.done ? "checked" : ""}`}>{item.done && <Check size={14} />}</span></button></div>)}</section>
            <button className="coach-banner" onClick={() => setCoach(true)}><span className="coach-spark"><Sparkles size={20} /></span><span><strong>Make tomorrow feel easier</strong><small>Ask your open-source Gemma coach for a plan that fits your week.</small></span><ArrowRight size={19} /></button>
          </div><aside className="right-column">
            <section className="side-panel" id="meals"><div className="panel-heading"><div><p className="eyebrow">ON THE PLATE</p><h3>Meals for today</h3></div><MoreHorizontal size={18} /></div><div className="meal-list"><div className="meal-row"><small>8:15 AM</small><i>☀</i><span><strong>Vegetable poha</strong><small>with peanuts &amp; tea</small></span></div><div className="meal-row"><small>1:00 PM</small><i>◒</i><span><strong>Dal &amp; roti</strong><small>cucumber salad on the side</small></span></div><div className="meal-row"><small>8:00 PM</small><i>☾</i><span><strong>Moong khichdi</strong><small>curd &amp; sautéed vegetables</small></span></div></div><button className="outline-button"><Apple size={16} /> See full meal plan</button></section>
            <section className="side-panel" id="movement"><div className="panel-heading"><div><p className="eyebrow">MOVE WELL</p><h3>Movement note</h3></div><span className="tiny-pill">15 min</span></div><div className="movement-content"><div className="movement-illustration"><Dumbbell size={26} /><small>easy does it</small></div><div><strong>Chair-friendly strength</strong><p>Wall push-ups, seated leg lifts, and a little stretch. No rushing.</p></div></div><button className="dark-button" onClick={() => toggle("stretch")}><Check size={16} /> {plan.find((item) => item.id === "stretch")?.done ? "Completed today" : "Mark as done"}</button></section>
            <section className="side-panel note-panel"><span className="note-icon"><Lightbulb size={18} /></span><div><p className="eyebrow">A NOTE FROM YOUR SIDEKICK</p><p className="note-copy">Consistency beats intensity. A ten-minute walk still counts as taking care of yourself.</p><small>Made with care for Dad</small></div></section>
          </aside></div>
        </section>
        {coach && <div className="modal-backdrop" onClick={() => setCoach(false)}><div className="coach-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setCoach(false)} aria-label="Close"><X size={18} /></button><span className="modal-icon"><Sparkles size={24} /></span><p className="eyebrow accent">GEMMA COACH · OPEN SOURCE</p><h2>What would make this week easier?</h2><p className="muted">Tell your sidekick what Dad likes, avoids, or wants to improve. Gemma shapes a practical plan around it.</p><div className="prompt-chips"><button onClick={() => setNote("More vegetarian meals")}>More vegetarian meals</button><button onClick={() => setNote("Gentle knee-friendly exercise")}>Gentle knee-friendly exercise</button><button onClick={() => setNote("Better sleep routine")}>Better sleep routine</button></div><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Or write a note for your sidekick..." rows={3} />{reply && <p className="coach-reply">{reply}</p>}<button className="dark-button" onClick={askCoach} disabled={loading}>{loading ? "Gemma is thinking..." : "Build a thoughtful plan"} {!loading && <ArrowRight size={17} />}</button><small className="modal-footnote">Gemma suggestions are for planning only, not medical advice.</small></div></div>}
      </main>;
    }
