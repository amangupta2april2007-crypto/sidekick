"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Menu, MessageCircleHeart, ChevronDown } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const todayDateStr = typeof window !== 'undefined' ? new Date().toLocaleDateString('en-US', { 
    weekday: 'long', month: 'long', day: 'numeric' 
  }).toUpperCase() : ''; // Fix hydration mismatch by doing it properly, or just ignore for now. Actually, better to just use new Date() as before.

  return (
    <div className={`app-shell ${mounted ? "mounted" : ""}`}>
      <Sidebar menuOpen={menu} onMenuClose={() => setMenu(false)} />
      <section className="main-content">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMenu(true)} aria-label="Open menu">
            <Menu size={21} />
          </button>
          <div className="date-select">
            <span className="eyebrow">{todayDateStr || new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}</span>
            <button>Today <ChevronDown size={15} /></button>
          </div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Messages"><MessageCircleHeart size={20} /></button>
            <span className="mini-avatar">D</span>
          </div>
        </header>
        {children}
      </section>
      {menu && <div className="sidebar-overlay" onClick={() => setMenu(false)} />}
    </div>
  );
}
