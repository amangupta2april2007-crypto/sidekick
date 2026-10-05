"use client";

import { useState } from "react";
import {
  Dumbbell,
  Heart,
  Footprints,
  Timer,
  Check,
  Leaf,
  Activity,
  AlertTriangle,
  Calendar,
} from "lucide-react";

const exercises = [
  { id: 1, name: "Morning Walk", duration: "25 min", difficulty: "easy" as const, desc: "A gentle walk around the colony. No rushing, enjoy the morning air.", Icon: Footprints },
  { id: 2, name: "Chair Squats", duration: "10 min", difficulty: "easy" as const, desc: "10 slow squats using a chair for support. Great for knee strength.", Icon: Dumbbell },
  { id: 3, name: "Wall Push-ups", duration: "8 min", difficulty: "moderate" as const, desc: "3 sets of 10 against the wall. Builds upper body without strain.", Icon: Activity },
  { id: 4, name: "Seated Leg Lifts", duration: "10 min", difficulty: "easy" as const, desc: "Lift each leg 15 times while sitting. Good for circulation.", Icon: Activity },
  { id: 5, name: "Gentle Stretching", duration: "15 min", difficulty: "easy" as const, desc: "Full body stretch focusing on shoulders, back, and hamstrings.", Icon: Heart },
  { id: 6, name: "Evening Walk", duration: "20 min", difficulty: "easy" as const, desc: "A calm post-dinner stroll. Aids digestion and relaxation.", Icon: Footprints },
];

const schedule = [
  { day: "Mon", plan: "Walk + Stretch", status: "completed" as const },
  { day: "Tue", plan: "Walk + Chair exercises", status: "completed" as const },
  { day: "Wed", plan: "Rest day 🌿", status: "rest" as const },
  { day: "Thu", plan: "Walk + Wall push-ups", status: "today" as const },
  { day: "Fri", plan: "Walk + Stretch", status: "upcoming" as const },
  { day: "Sat", plan: "Light yoga", status: "upcoming" as const },
  { day: "Sun", plan: "Family walk 🌳", status: "upcoming" as const },
];

export default function MovementPage() {
  const [done, setDone] = useState<number[]>([]);

  const toggleExercise = (id: number) =>
    setDone((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));

  const doneCount = done.length;

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <p className="eyebrow accent">MOVE WELL · FEEL WELL</p>
        <h1>Movement plan</h1>
        <p className="muted">
          Gentle, consistent movement that keeps Dad strong and flexible.
        </p>
      </div>

      {/* Activity Stats */}
      <div className="move-stats">
        <div className="move-stat-card">
          <Footprints size={28} style={{ color: "var(--green)", marginBottom: 8 }} />
          <div className="move-stat-number">4,000</div>
          <div className="move-stat-label">of 6,000 steps</div>
          <div className="move-stat-bar">
            <i style={{ width: "66%" }} />
          </div>
        </div>
        <div className="move-stat-card">
          <Timer size={28} style={{ color: "#5ba0c0", marginBottom: 8 }} />
          <div className="move-stat-number" style={{ color: "#5ba0c0" }}>25</div>
          <div className="move-stat-label">of 30 min active</div>
          <div className="move-stat-bar">
            <i style={{ width: "83%", background: "#5ba0c0" }} />
          </div>
        </div>
        <div className="move-stat-card">
          <Activity size={28} style={{ color: "#a46e29", marginBottom: 8 }} />
          <div className="move-stat-number" style={{ color: "#a46e29" }}>2</div>
          <div className="move-stat-label">of 3 stretch sessions</div>
          <div className="move-stat-bar">
            <i style={{ width: "66%", background: "#a46e29" }} />
          </div>
        </div>
      </div>

      {/* Exercises */}
      <div className="section-heading" style={{ marginBottom: 20 }}>
        <div>
          <p className="eyebrow">THIS WEEK</p>
          <h2>Exercises</h2>
        </div>
        <span className="plan-tag">{doneCount} of {exercises.length} done</span>
      </div>

      <div className="move-grid">
        {exercises.map((ex) => {
          const isDone = done.includes(ex.id);
          return (
            <div key={ex.id} className={`move-card ${isDone ? "is-done" : ""}`}>
              <div className="move-card-header">
                <div className="move-card-icon">
                  <ex.Icon size={24} />
                </div>
                <div>
                  <div className="move-card-title">{ex.name}</div>
                  <div className="move-card-meta">
                    <span><Timer size={14} /> {ex.duration}</span>
                    <span className={`move-difficulty ${ex.difficulty}`}>
                      {ex.difficulty === "easy" ? "Easy" : "Moderate"}
                    </span>
                  </div>
                </div>
              </div>
              <p className="move-card-desc">{ex.desc}</p>
              <button
                className={isDone ? "outline-button" : "dark-button"}
                onClick={() => toggleExercise(ex.id)}
              >
                <Check size={16} /> {isDone ? "Completed ✓" : "Mark as done"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Weekly Schedule */}
      <div className="section-heading" style={{ marginBottom: 20, marginTop: 48 }}>
        <div>
          <p className="eyebrow">WEEKLY VIEW</p>
          <h2>Schedule</h2>
        </div>
        <Calendar size={20} style={{ color: "var(--muted)" }} />
      </div>

      <div className="move-weekly">
        {schedule.map((d) => (
          <div
            key={d.day}
            className={`move-day ${d.status === "today" ? "today" : ""} ${d.status === "completed" ? "completed" : ""} ${d.status === "rest" ? "rest" : ""}`}
          >
            <div className="move-day-name">{d.day}</div>
            <div className="move-day-detail">{d.plan}</div>
            {d.status === "completed" && (
              <Check size={16} style={{ color: "var(--green)", marginTop: 6 }} />
            )}
            {d.status === "today" && (
              <span className="tiny-pill" style={{ marginTop: 6 }}>Today</span>
            )}
          </div>
        ))}
      </div>

      {/* Safety Note */}
      <div className="safety-note">
        <div className="safety-icon">
          <AlertTriangle size={20} />
        </div>
        <div>
          <p>
            <strong>Safety first:</strong> These exercises are designed to be gentle. If
            Dad feels any pain or discomfort, stop immediately and consult a doctor. Always
            warm up before exercise.
          </p>
        </div>
      </div>
    </div>
  );
}
