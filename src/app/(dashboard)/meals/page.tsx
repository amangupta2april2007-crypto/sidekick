"use client";

import { useState, useEffect } from "react";
import {
  Utensils,
  Sun,
  Coffee,
  Moon,
  Check,
  GlassWater,
  Lightbulb,
} from "lucide-react";

const tips = [
  "Include a handful of nuts every day for healthy fats.",
  "Curd after lunch aids digestion and keeps the gut happy.",
  "A glass of warm water with lemon in the morning boosts metabolism.",
  "Eat dinner at least 2 hours before bedtime for better sleep.",
  "Seasonal fruits are the best source of natural vitamins.",
  "Chewing food slowly helps with digestion and satiety.",
  "Keep hydration steady throughout the morning hours.",
];

const dailyMeals = [
  { id: 1, title: "Breakfast", time: "8:15 AM", desc: "Vegetable poha with peanuts & tea.", cal: 320, pro: 8, icon: "☀" },
  { id: 2, title: "Mid-morning snack", time: "10:30 AM", desc: "A glass of water + 5 almonds.", cal: 80, pro: 3, icon: "🥛" },
  { id: 3, title: "Lunch", time: "1:00 PM", desc: "Dal, 2 rotis, cucumber raita, seasonal sabzi.", cal: 520, pro: 18, icon: "◒" },
  { id: 4, title: "Dinner", time: "8:00 PM", desc: "Moong khichdi, curd, sautéed vegetables.", cal: 420, pro: 15, icon: "☾" },
];

const weeklyPlan = [
  { day: "Monday", breakfast: "Poha & tea", lunch: "Dal, 2 rotis, cucumber salad", dinner: "Khichdi & curd" },
  { day: "Tuesday", breakfast: "Upma with veggies", lunch: "Rajma & brown rice", dinner: "Palak paneer with roti" },
  { day: "Wednesday", breakfast: "Idli & sambar", lunch: "Chole & 2 rotis", dinner: "Moong dal & rice" },
  { day: "Thursday", breakfast: "Methi paratha & curd", lunch: "Dal tadka & jeera rice", dinner: "Vegetable pulao" },
  { day: "Friday", breakfast: "Dosa & coconut chutney", lunch: "Kadhi & steamed rice", dinner: "Aloo gobi with phulka" },
  { day: "Saturday", breakfast: "Besan cheela", lunch: "Sambar rice & beans poriyal", dinner: "Paneer bhurji & roti" },
  { day: "Sunday", breakfast: "Vegetable sandwich & tea", lunch: "Special vegetable biryani & raita", dinner: "Light vegetable soup & toast" },
];

export default function MealsPage() {
  const [completedMeals, setCompletedMeals] = useState<number[]>([1]);
  const [hydration, setHydration] = useState<boolean[]>([true, true, true, false, false, false, false, false]);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    setTipIndex(new Date().getDay() % tips.length);
  }, []);

  const toggleMeal = (id: number) => {
    setCompletedMeals((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const toggleWater = (index: number) => {
    setHydration((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const waterCount = hydration.filter(Boolean).length;

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <p className="eyebrow accent">NOURISH WITH CARE</p>
        <h1>Meal planner</h1>
        <p className="muted">
          Simple, familiar meals that keep Dad strong, satisfied, and energized.
        </p>
      </div>

      {/* Today's Meals Section */}
      <div className="section-heading" style={{ marginBottom: 20 }}>
        <div>
          <p className="eyebrow">TODAY&apos;S NOURISHMENT</p>
          <h2>On the plate today</h2>
        </div>
        <span className="plan-tag">
          {completedMeals.length} of {dailyMeals.length} done
        </span>
      </div>

      <div className="meals-grid">
        {dailyMeals.map((meal) => {
          const isDone = completedMeals.includes(meal.id);
          return (
            <div
              key={meal.id}
              className={`meals-card ${isDone ? "is-done" : ""}`}
              onClick={() => toggleMeal(meal.id)}
            >
              <div className="meals-card-header">
                <span className="meals-card-icon">{meal.icon}</span>
                <span className={`check-box ${isDone ? "checked" : ""}`}>
                  {isDone && <Check size={14} />}
                </span>
              </div>
              <h3 className="meals-card-title">{meal.title}</h3>
              <p className="meals-card-desc">{meal.desc}</p>
              <div className="meals-card-meta">
                <span>Time: <strong>{meal.time}</strong></span>
                <span>Cal: <strong>~{meal.cal}</strong></span>
                <span>Protein: <strong>{meal.pro}g</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hydration Tracker */}
      <div className="side-panel" style={{ marginBottom: 48, padding: 24 }}>
        <div className="section-heading" style={{ marginBottom: 12 }}>
          <div>
            <p className="eyebrow">HYDRATION TRACKER</p>
            <h2>Water intake</h2>
          </div>
          <span className="tiny-pill">{waterCount} of 8 glasses</span>
        </div>
        <p className="muted" style={{ marginBottom: 16 }}>
          Click each glass to mark as finished. Staying hydrated supports Dad&apos;s energy and joint mobility.
        </p>
        <div className="hydration-track">
          {hydration.map((filled, idx) => (
            <button
              key={idx}
              type="button"
              className={`hydration-glass ${filled ? "filled" : ""}`}
              onClick={() => toggleWater(idx)}
              title={`Glass ${idx + 1} ${filled ? "(Done)" : "(Pending)"}`}
            >
              <GlassWater size={22} style={{ color: filled ? "#2b7396" : "#899e94" }} />
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Plan */}
      <div className="section-heading" style={{ marginBottom: 20 }}>
        <div>
          <p className="eyebrow">7-DAY ROTATION</p>
          <h2>Weekly meal guide</h2>
        </div>
      </div>

      <div className="meals-weekly">
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Breakfast</th>
              <th>Lunch</th>
              <th>Dinner</th>
            </tr>
          </thead>
          <tbody>
            {weeklyPlan.map((row) => (
              <tr key={row.day}>
                <td className="day-name">{row.day}</td>
                <td>{row.breakfast}</td>
                <td>{row.lunch}</td>
                <td>{row.dinner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Daily Nutrition Tip */}
      <div className="tip-card">
        <span className="note-icon">
          <Lightbulb size={20} />
        </span>
        <div>
          <p className="eyebrow" style={{ marginBottom: 4 }}>NUTRITION WISDOM</p>
          <p>{tips[tipIndex]}</p>
        </div>
      </div>
    </div>
  );
}
