import { useEffect, useState } from "react";
import { api } from "../api";
import type { Workout } from "../types";
import { Link } from "react-router-dom";

export function WorkoutHistoryPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getWorkouts().then(setWorkouts).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <h1>Workout History</h1>
      {loading && <div>Loading workouts...</div>}
      {!loading && workouts.length === 0 && <div>No workouts logged yet.</div>}

      <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {workouts.map(w => (
          <Link
            key={w.id}
            to={`/workouts/${w.id}`}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              background: "#020617",
              border: "1px solid #111827"
            }}
          >
            <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>
              {new Date(w.date).toLocaleString()}
            </div>
            <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>
              {w.sets.length} sets{w.notes ? ` • ${w.notes}` : ""}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
