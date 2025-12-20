import { useEffect, useState } from "react";
import {
  getBodyParts,
  getWorkouts,
  createWorkout,
  createWorkoutSets,
  deleteWorkout,
} from "../api/httpApi";
import type { BodyPart, WorkoutSummary } from "../types";

export function BackendTestPage() {
  const [bodyParts, setBodyParts] = useState<BodyPart[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const [bp, w] = await Promise.all([getBodyParts(), getWorkouts()]);
      setBodyParts(bp);
      setWorkouts(w);
    } catch (e: any) {
      setError(e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateSampleWorkout() {
    try {
      setCreating(true);
      setError(null);

      const workoutRes = await createWorkout({
        workout_date: "2024-11-30",
        workout_length: 45,
        exercise_id: 3,
      });

      const workoutId = workoutRes.id;

      await createWorkoutSets({
        sets: [
          { rep_amount: 10, weight_amount: 30, to_failure: 0, workout_id: workoutId },
          { rep_amount: 8, weight_amount: 35, to_failure: 1, workout_id: workoutId },
          { rep_amount: 6, weight_amount: 40, to_failure: 0, workout_id: workoutId },
        ],
      });

      await loadData();
    } catch (e: any) {
      setError(e.message ?? String(e));
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(workoutId: number) {
    try {
      setError(null);
      setWorkouts((prev) => prev.filter((w) => w.workout_id !== workoutId));
      await deleteWorkout(workoutId);
    } catch (e: any) {
      setError(e.message ?? String(e));
      await loadData();
    }
  }

  return (
    <div style={{ padding: "1.5rem", color: "white", fontFamily: "sans-serif" }}>
      <h1>Backend Test Tools</h1>

      {loading && <p>Loading data…</p>}
      {error && <p style={{ color: "#fca5a5" }}>Error: {error}</p>}

      <button
        onClick={handleCreateSampleWorkout}
        disabled={creating}
        style={{
          padding: "0.5rem 0.9rem",
          borderRadius: 999,
          border: "none",
          background: "#22c55e",
          color: "#020617",
          fontWeight: 600,
          cursor: creating ? "not-allowed" : "pointer",
          marginBottom: "1rem",
        }}
      >
        {creating ? "Creating sample workout..." : "Create sample workout in DB"}
      </button>

      <section style={{ marginTop: "1rem" }}>
        <h2>Body Parts</h2>
        <ul>
          {bodyParts.map((bp) => (
            <li key={bp.id}>{bp.name}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>Workouts</h2>
        {workouts.length === 0 && <p>No workouts yet.</p>}

        {workouts.map((w) => (
          <div
            key={w.workout_id}
            style={{
              marginBottom: "1rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: "#020617",
              border: "1px solid #111827",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
              <div>
                <div>
                  <strong>{w.exercise_name}</strong>
                </div>
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
                }}
              >
                Delete
              </button>
            </div>

            <div style={{ marginTop: "0.5rem" }}>Sets:</div>
            <ul>
              {w.sets.map((s, i) => (
                <li key={i}>
                  {s.rep_amount} reps × {s.weight_amount} kg{" "}
                  {s.to_failure ? "(to failure)" : ""}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
