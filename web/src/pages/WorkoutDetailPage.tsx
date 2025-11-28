import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import type { Workout } from "../types";

export function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .getWorkout(Number(id))
      .then(setWorkout)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div style={{ marginTop: "1.5rem" }}>Loading workout...</div>;
  }

  if (!workout) {
    return <div style={{ marginTop: "1.5rem" }}>Workout not found.</div>;
  }

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <h1>Workout Detail</h1>
      <div style={{ marginBottom: "0.5rem" }}>
        <strong>Date:</strong> {new Date(workout.date).toLocaleString()}
      </div>
      {workout.notes && (
        <div style={{ marginBottom: "1rem" }}>
          <strong>Notes:</strong> {workout.notes}
        </div>
      )}

      <h2 style={{ fontSize: "1rem", marginTop: "1rem" }}>Sets</h2>
      <ul style={{ paddingLeft: "1.25rem", fontSize: "0.9rem" }}>
        {workout.sets.map(set => (
          <li key={set.id}>
            Exercise #{set.exerciseId} – {set.reps} reps
            {set.weight !== undefined && ` @ ${set.weight} kg`}
            {set.toFailure && " (to failure)"}
          </li>
        ))}
      </ul>
    </div>
  );
}
