import { useEffect, useState } from "react";
import { getWorkouts } from "../api/httpApi";
import type { WorkoutSummary } from "../types";

export function WorkoutHistoryPage() {
  const [workouts, setWorkouts] = useState<WorkoutSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getWorkouts();
        setWorkouts(data);
      } catch (e: any) {
        setError(e.message ?? String(e));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div style={{ color: "white", fontFamily: "sans-serif" }}>
      <h1>Workout History</h1>

      {loading && <p>Loading workouts…</p>}
      {error && <p style={{ color: "#fca5a5" }}>Error: {error}</p>}

      {(!loading && !error && workouts.length === 0) && (
        <p>No workouts yet. Try logging one from “Log Workout”.</p>
      )}

      {workouts.map((w, idx) => (
        <div
          key={idx}
          style={{
            marginTop: "1rem",
            padding: "0.75rem 1rem",
            borderRadius: 8,
            background: "#020617",
            border: "1px solid #111827",
          }}
        >
          <strong>{w.exercise_name}</strong>
          <div>
            Date: {String(w.workout_date).slice(0, 10)} — Length: {`${Number(w.workout_length)} min`}
          </div>
          <div>Body parts: {w.body_parts.join(", ")}</div>
          <div style={{ marginTop: "0.25rem" }}>Sets:</div>
          <ul style={{ marginTop: 0 }}>
            {w.sets.map((s, i) => (
              <li key={i}>
                {s.rep_amount} reps × {s.weight_amount} kg{" "}
                {s.to_failure ? "(to failure)" : ""}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
