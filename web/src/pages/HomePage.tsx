import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getWorkouts } from "../api/httpApi";
import type { WorkoutSummary } from "../types";

function formatDate(date: string | Date): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) {
    // fallback: just show YYYY-MM-DD if possible
    return String(date).slice(0, 10);
  }
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function HomePage() {
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

  const stats = useMemo(() => {
    if (workouts.length === 0) {
      return {
        totalWorkouts: 0,
        totalSets: 0,
        uniqueExercises: 0,
        lastWorkoutLabel: "No workouts logged yet",
      };
    }

    const totalWorkouts = workouts.length;
    const totalSets = workouts.reduce((sum, w) => sum + w.sets.length, 0);
    const uniqueExerciseNames = new Set(workouts.map(w => w.exercise_name));

    // workouts[].workout_date is ISO-like; max string is the latest
    const lastWorkoutRaw = workouts
      .map(w => w.workout_date)
      .sort()
      .at(-1)!;

    const lastWorkoutLabel = formatDate(lastWorkoutRaw);

    return {
      totalWorkouts,
      totalSets,
      uniqueExercises: uniqueExerciseNames.size,
      lastWorkoutLabel,
    };
  }, [workouts]);

  return (
    <div
      style={{
        color: "white",
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      {/* Hero */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 700 }}>
          Gallo
        </h1>
        <p style={{ margin: 0, fontSize: "0.95rem", opacity: 0.9 }}>
          Track your workouts, see your history, and keep exercises organized.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
          <Link
            to="/workouts/new"
            style={{
              padding: "0.55rem 1.1rem",
              borderRadius: 999,
              background: "#22c55e",
              color: "#020617",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Log a workout
          </Link>
          <Link
            to="/workouts"
            style={{
              padding: "0.55rem 1.1rem",
              borderRadius: 999,
              border: "1px solid #374151",
              color: "#e5e7eb",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            View history
          </Link>
          <Link
            to="/exercises"
            style={{
              padding: "0.55rem 1.1rem",
              borderRadius: 999,
              border: "1px solid #374151",
              color: "#e5e7eb",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Browse exercises
          </Link>
        </div>
      </section>

      {/* Live stats */}
      <section>
        <h2
          style={{
            margin: 0,
            marginBottom: "0.5rem",
            fontSize: "1rem",
            opacity: 0.9,
          }}
        >
          Overview
        </h2>

        {error && (
          <p style={{ color: "#fca5a5" }}>
            Error loading stats: {error}
          </p>
        )}

        {loading && !error && <p>Loading stats…</p>}

        {!loading && !error && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                borderRadius: 12,
                padding: "0.75rem 1rem",
                background: "#020617",
                border: "1px solid #111827",
              }}
            >
              <div
                style={{
                  fontSize: "0.8rem",
                  opacity: 0.8,
                  marginBottom: "0.2rem",
                }}
              >
                Total workouts
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                {stats.totalWorkouts}
              </div>
            </div>

            <div
              style={{
                borderRadius: 12,
                padding: "0.75rem 1rem",
                background: "#020617",
                border: "1px solid #111827",
              }}
            >
              <div
                style={{
                  fontSize: "0.8rem",
                  opacity: 0.8,
                  marginBottom: "0.2rem",
                }}
              >
                Total sets
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                {stats.totalSets}
              </div>
            </div>

            <div
              style={{
                borderRadius: 12,
                padding: "0.75rem 1rem",
                background: "#020617",
                border: "1px solid #111827",
              }}
            >
              <div
                style={{
                  fontSize: "0.8rem",
                  opacity: 0.8,
                  marginBottom: "0.2rem",
                }}
              >
                Unique exercises
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                {stats.uniqueExercises}
              </div>
            </div>

            <div
              style={{
                borderRadius: 12,
                padding: "0.75rem 1rem",
                background: "#020617",
                border: "1px solid #111827",
              }}
            >
              <div
                style={{
                  fontSize: "0.8rem",
                  opacity: 0.8,
                  marginBottom: "0.2rem",
                }}
              >
                Last workout
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 500 }}>
                {stats.lastWorkoutLabel}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Optional “how to use” section for professor / users */}
      <section style={{ marginTop: "0.5rem", fontSize: "0.85rem", opacity: 0.85 }}>
        <h2 style={{ fontSize: "0.95rem" }}>How this web client works</h2>
        <p style={{ marginTop: "0.25rem" }}>
          This page calls the Node.js backend at <code>http://localhost:3000</code> to
          load your workouts from the MariaDB database and computes these stats
          on the client side. Other pages reuse the same REST API to browse
          exercises and log new workouts.
        </p>
      </section>
    </div>
  );
}
