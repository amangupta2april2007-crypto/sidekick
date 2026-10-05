"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, CircleHelp, Dumbbell, HeartPulse, MoreHorizontal, SunMedium, Utensils, X } from "lucide-react";

export default function Sidebar({ menuOpen, onMenuClose }: { menuOpen?: boolean; onMenuClose?: () => void }) {
  const pathname = usePathname();
  const activeNav = pathname === "/" ? "today" : pathname?.substring(1);

  return (
    <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
      <div className="brand"><span className="brand-mark"><HeartPulse size={20} /></span>sidekick</div>
      <button className="close-menu" onClick={onMenuClose} aria-label="Close menu"><X size={20} /></button>
      <div className="profile-card"><span className="avatar">D</span><span><strong>Dad&apos;s plan</strong><small>56 years · Active</small></span><MoreHorizontal size={17} /></div>
      <nav>
        <Link className={`nav-item ${activeNav === "today" ? "active" : ""}`} href="/" onClick={onMenuClose}><SunMedium size={18} /> Today</Link>
        <Link className={`nav-item ${activeNav === "meals" ? "active" : ""}`} href="/meals" onClick={onMenuClose}><Utensils size={18} /> Meals</Link>
        <Link className={`nav-item ${activeNav === "movement" ? "active" : ""}`} href="/movement" onClick={onMenuClose}><Dumbbell size={18} /> Movement</Link>
        <Link className={`nav-item ${activeNav === "progress" ? "active" : ""}`} href="/progress" onClick={onMenuClose}><Activity size={18} /> Progress</Link>
      </nav>
      <div className="sidebar-bottom">
        <div className="streak-card"><span className="streak-icon">✦</span><span><strong>4 day rhythm</strong><small>Keep it going</small></span></div>
        <a className="help-link" href="#how-it-works"><CircleHelp size={17} /> How sidekick works</a>
        <div className="powered"><i />&nbsp;Powered by Gemma <b>Built with GitHub</b></div>
      </div>
    </aside>
  );
}
