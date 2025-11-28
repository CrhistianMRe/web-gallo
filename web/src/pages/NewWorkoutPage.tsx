import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import type { Exercise, NewWorkoutSet } from "../types";

export function NewWorkoutPage() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 16)); // datetime-local
  const [notes, setNotes] = useState("");
  const [sets, setSets] = useState<NewWorkoutSet[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getExercises().then(setExercises);
  }, []);

  function addSet() {
    const defaultExerciseId = exercises[0]?.id ?? 1;
    setSets(prev => [
      ...prev,
      {
        exerciseId: defaultExerciseId,
        reps: 10,
        weight: undefined,
        toFailure: false
      }
    ]);
  }

  function updateSet(index: number, patch: Partial<NewWorkoutSet>) {
    setSets(prev => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function removeSet(index: number) {
    setSets(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (sets.length === 0) return;

    setSaving(true);
    try {
      const payload = {
        userId: 1, // TODO: replace with real logged-in user
        date: new Date(date).toISOString(),
        notes: notes || undefined,
        sets
      };
      const created = await api.createWorkout(payload);
      navigate(`/workouts/${created.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <h1>Log Workout</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 600 }}
      >
        <label>
          <div style={{ fontSize: "0.85rem" }}>Date & time</div>
          <input
            type="datetime-local"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{
              width: "100%",
              padding: "0.45rem 0.6rem",
              borderRadius: 8,
              border: "1px solid #374151"
            }}
          />
        </label>

        <label>
          <div style={{ fontSize: "0.85rem" }}>Notes (optional)</div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              padding: "0.45rem 0.6rem",
              borderRadius: 8,
              border: "1px solid #374151",
              resize: "vertical"
            }}
          />
        </label>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "1rem", margin: 0 }}>Sets</h2>
            <button
              type="button"
              onClick={addSet}
              style={{
                padding: "0.35rem 0.7rem",
                borderRadius: 999,
                border: "none",
                background: "#22c55e",
                color: "#020617",
                cursor: "pointer",
                fontSize: "0.85rem"
              }}
            >
              + Add set
            </button>
          </div>

          {sets.length === 0 && (
            <div style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
              No sets yet. Add your first set.
            </div>
          )}

          <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {sets.map((set, index) => (
              <div
                key={index}
                style={{
                  padding: "0.75rem",
                  borderRadius: "0.75rem",
                  background: "#020617",
                  border: "1px solid #111827",
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr auto",
                  gap: "0.5rem",
                  alignItems: "center"
                }}
              >
                <select
                  value={set.exerciseId}
                  onChange={e => updateSet(index, { exerciseId: Number(e.target.value) })}
                  style={{ padding: "0.35rem 0.5rem", borderRadius: 8, border: "1px solid #374151" }}
                >
                  {exercises.map(ex => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min={1}
                  value={set.reps}
                  onChange={e => updateSet(index, { reps: Number(e.target.value) })}
                  style={{ padding: "0.35rem 0.5rem", borderRadius: 8, border: "1px solid #374151" }}
                  placeholder="Reps"
                />

                <input
                  type="number"
                  min={0}
                  value={set.weight ?? ""}
                  onChange={e =>
                    updateSet(index, {
                      weight: e.target.value === "" ? undefined : Number(e.target.value)
                    })
                  }
                  style={{ padding: "0.35rem 0.5rem", borderRadius: 8, border: "1px solid #374151" }}
                  placeholder="Weight (kg)"
                />

                <label style={{ fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <input
                    type="checkbox"
                    checked={set.toFailure}
                    onChange={e => updateSet(index, { toFailure: e.target.checked })}
                  />
                  To failure
                </label>

                <button
                  type="button"
                  onClick={() => removeSet(index)}
                  style={{
                    marginLeft: "0.5rem",
                    borderRadius: 999,
                    border: "none",
                    background: "#ef4444",
                    color: "#f9fafb",
                    padding: "0.3rem 0.6rem",
                    cursor: "pointer",
                    fontSize: "0.75rem"
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving || sets.length === 0}
          style={{
            marginTop: "0.5rem",
            padding: "0.6rem 0.9rem",
            borderRadius: 999,
            border: "none",
            background: sets.length === 0 ? "#4b5563" : "#22c55e",
            color: "#020617",
            cursor: sets.length === 0 ? "not-allowed" : "pointer",
            fontWeight: 600
          }}
        >
          {saving ? "Saving..." : "Save workout"}
        </button>
      </form>
    </div>
  );
}
