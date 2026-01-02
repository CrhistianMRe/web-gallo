import { useEffect, useState } from "react";
import { deleteWorkout, getWorkouts } from "../api/httpApi";
import type { WorkoutSummary } from "../types";

export function WorkoutHistoryPage() {
  const [workouts, setWorkouts] = useState<WorkoutSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(workoutId: number) {
    const ok = window.confirm(
      "Delete this workout? This will remove the workout and all its sets.",
    );
    if (!ok) return;

    try {
      setError(null);

      // Optimistic UI: remove immediately
      setWorkouts((prev) => prev.filter((w) => w.workout_id !== workoutId));

      await deleteWorkout(workoutId);
    } catch (e: any) {
      // If delete failed, reload from server to restore truth
      setError(e.message ?? String(e));
      await load();
    }
  }

  return (
    <div style={{ color: "white", fontFamily: "sans-serif" }}>
      <h1>Workout History</h1>

      {loading && <p>Loading workouts…</p>}
      {error && <p style={{ color: "#fca5a5" }}>Error: {error}</p>}

      {!loading && !error && workouts.length === 0 && (
        <p>No workouts yet. Try logging one from “Log Workout”.</p>
      )}

      {workouts.map((w) => (
        <div
          key={w.workout_id}
          style={{
            marginTop: "1rem",
            padding: "0.75rem 1rem",
            borderRadius: 8,
            background: "#020617",
            border: "1px solid #111827",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
            <div style={{ minWidth: 0 }}>
              <strong>{w.exercise_name}</strong>
              <div>
                Date: {String(w.workout_date).slice(0, 10)} — Length:{" "}
                {`${Number(w.workout_length)} min`}
              </div>
              <div>Body parts: {w.body_parts.join(", ")}</div>
            </div>

            <button
              onClick={() => handleDelete(w.workout_id)}
              style={{
                border: "none",
                borderRadius: 999,
                padding: "0.35rem 0.75rem",
                background: "#b91c1c",
                color: "white",
                cursor: "pointer",
                height: 34,
                alignSelf: "flex-start",
                flexShrink: 0,
              }}
              title="Delete workout"
            >
              Delete
            </button>
          </div>

          <div style={{ marginTop: "0.5rem" }}>Sets:</div>
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
