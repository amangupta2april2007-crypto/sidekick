"use client";

import { useState, useEffect } from "react";
import {
  Flame,
  Star,
  Trophy,
  Droplets,
  Activity,
  Dumbbell,
  Check,
  Lock,
  TrendingUp,
  Sparkles,
  Quote,
} from "lucide-react";

export default function ProgressPage() {
  const [dayOfWeek, setDayOfWeek] = useState(0);

  useEffect(() => {
    setDayOfWeek(new Date().getDay());
  }, []);

  const quotes = [
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
    { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
    { text: "Health is not about the weight you lose, but about the life you gain.", author: "Unknown" },
    { text: "Small daily improvements lead to staggering long-term results.", author: "Unknown" },
    { text: "Your body can stand almost anything. It's your mind that you have to convince.", author: "Unknown" },
  ];

  const currentQuote = quotes[dayOfWeek] || quotes[1];

  const weekDays = [
    { name: "Mon", num: 12, completed: true, dots: ["meals", "movement", "hydration"] },
    { name: "Tue", num: 13, completed: true, dots: ["meals", "movement"] },
    { name: "Wed", num: 14, completed: true, dots: ["meals", "movement", "hydration"] },
    { name: "Thu", num: 15, completed: true, dots: ["meals"] },
    { name: "Fri", num: 16, today: true, dots: ["meals"] },
    { name: "Sat", num: 17, upcoming: true, dots: [] },
    { name: "Sun", num: 18, upcoming: true, dots: [] },
  ];

  const badges = [
    { id: 1, name: "First Day", desc: "Completed your first full day", icon: "🌟", status: "earned" as const },
    { id: 2, name: "3-Day Streak", desc: "3 consecutive healthy days", icon: "🔥", status: "earned" as const },
    { id: 3, name: "Hydration Hero", desc: "Drank 8 glasses every day for a week", icon: "💧", status: "earned" as const },
    { id: 4, name: "Move Maker", desc: "Completed 10 movement sessions", icon: "🏃", status: "earned" as const },
    { id: 5, name: "Meal Master", desc: "Followed the meal plan for 2 weeks", icon: "🌿", status: "in-progress" as const, progress: 71 },
    { id: 6, name: "30-Day Champion", desc: "30 days of consistent healthy rhythm", icon: "⭐", status: "locked" as const, progress: 13 },
  ];

  const weeklyConsistency = [
    { label: "Wk 1", pct: 72 },
    { label: "Wk 2", pct: 85 },
    { label: "Wk 3", pct: 91 },
    { label: "Wk 4", pct: 78 },
  ];

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <p className="eyebrow accent">EVERY STEP COUNTS</p>
        <h1>Your progress</h1>
        <p className="muted">
          A look at how far Dad has come. Consistency is the real superpower.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="prog-stats">
        <div className="prog-stat-card">
          <div className="prog-stat-icon">🔥</div>
          <div className="prog-stat-number">4 days</div>
          <div className="prog-stat-label">Current streak</div>
        </div>
        <div className="prog-stat-card">
          <div className="prog-stat-icon">⭐</div>
          <div className="prog-stat-number">12 days</div>
          <div className="prog-stat-label">Best streak</div>
        </div>
        <div className="prog-stat-card">
          <div className="prog-stat-icon">🥗</div>
          <div className="prog-stat-number">85%</div>
          <div className="prog-stat-label">Meals followed</div>
        </div>
        <div className="prog-stat-card">
          <div className="prog-stat-icon">✨</div>
          <div className="prog-stat-number">18</div>
          <div className="prog-stat-label">Exercises this month</div>
        </div>
      </div>

      {/* Weekly Rhythm */}
      <div className="section-heading" style={{ marginBottom: 20 }}>
        <div>
          <p className="eyebrow">THIS WEEK</p>
          <h2>Daily consistency</h2>
        </div>
        <span className="tiny-pill">October 12 – 18</span>
      </div>

      <div className="prog-weekly">
        {weekDays.map((d) => (
          <div
            key={d.name}
            className={`prog-day ${d.today ? "today" : ""} ${d.completed ? "completed" : ""} ${d.upcoming ? "upcoming" : ""}`}
          >
            <div className="prog-day-name">{d.name}</div>
            <div className="prog-day-num">{d.num}</div>
            <div className="prog-day-dots">
              {d.dots.length > 0 ? (
                d.dots.map((dot, idx) => (
                  <span key={idx} className={`prog-dot ${dot}`} title={dot} />
                ))
              ) : (
                <span className="prog-dot empty" />
              )}
            </div>
            {d.completed && (
              <Check size={14} style={{ color: "var(--green)", marginTop: 6 }} />
            )}
            {d.today && (
              <span className="tiny-pill" style={{ marginTop: 6, fontSize: 10, padding: "2px 6px" }}>
                Today
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Monthly Chart */}
      <div className="section-heading" style={{ marginBottom: 20, marginTop: 48 }}>
        <div>
          <p className="eyebrow">TRENDS</p>
          <h2>Monthly completion</h2>
        </div>
        <span className="plan-tag">Past 4 weeks</span>
      </div>

      <div className="prog-chart">
        {weeklyConsistency.map((w) => (
          <div key={w.label} className="prog-chart-bar">
            <span className="prog-bar-value">{w.pct}%</span>
            <div
              className="prog-bar-fill"
              style={{ height: `${w.pct * 1.4}px` }}
            />
            <span className="prog-bar-label">{w.label}</span>
          </div>
        ))}
      </div>

      {/* Achievement Badges */}
      <div className="section-heading" style={{ marginBottom: 20, marginTop: 48 }}>
        <div>
          <p className="eyebrow">MILESTONES</p>
          <h2>Badges &amp; achievements</h2>
        </div>
        <span className="tiny-pill">4 of 6 earned</span>
      </div>

      <div className="prog-badges">
        {badges.map((b) => (
          <div key={b.id} className={`prog-badge ${b.status}`}>
            <span className="prog-badge-icon">{b.icon}</span>
            <div className="prog-badge-name">{b.name}</div>
            <div className="prog-badge-desc">{b.desc}</div>
            {b.status === "in-progress" && (
              <div className="prog-badge-bar">
                <i style={{ width: `${b.progress}%` }} />
              </div>
            )}
            {b.status === "locked" && (
              <div className="prog-badge-bar">
                <i style={{ width: `${b.progress}%`, background: "#9ca3af" }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Motivational Quote */}
      <div className="prog-quote" style={{ marginTop: 48 }}>
        <span className="note-icon" style={{ marginTop: 2 }}>
          <Quote size={20} />
        </span>
        <div style={{ flex: 1 }}>
          <p className="eyebrow accent" style={{ marginBottom: 6 }}>DAILY INSPIRATION</p>
          <blockquote>&ldquo;{currentQuote.text}&rdquo;</blockquote>
          <cite>&mdash; {currentQuote.author}</cite>
        </div>
      </div>
    </div>
  );
}
