import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createWorkout, createWorkoutSets } from "../api/httpApi";

interface SetRow {
  repAmount: number;
  weightAmount: number;
  toFailure: boolean;
}

export function NewWorkoutPage() {
  const navigate = useNavigate();

  const [date, setDate] = useState<string>(() => {
    // Default to today in YYYY-MM-DD
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [lengthMinutes, setLengthMinutes] = useState<number>(45);
  const [exerciseId, setExerciseId] = useState<number>(3); // default for now
  const [sets, setSets] = useState<SetRow[]>([
    { repAmount: 10, weightAmount: 30, toFailure: false },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  function updateSet(index: number, changes: Partial<SetRow>) {
    setSets(prev =>
      prev.map((s, i) =>
        i === index ? { ...s, ...changes } : s
      )
    );
  }

  function addSetRow() {
    setSets(prev => [
      ...prev,
      { repAmount: 8, weightAmount: 35, toFailure: false },
    ]);
  }

  function removeSetRow(index: number) {
    setSets(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!date) {
      setError("Please choose a date.");
      return;
    }
    if (!exerciseId || exerciseId <= 0) {
      setError("Exercise ID must be a positive number.");
      return;
    }
    if (sets.length === 0) {
      setError("Please add at least one set.");
      return;
    }

    try {
      setSubmitting(true);

      // 1) Create workout
      const workoutRes = await createWorkout({
        workout_date: date,
        workout_length: Number(lengthMinutes),
        exercise_id: Number(exerciseId),
      });

      const workoutId = workoutRes.id;

      // 2) Create sets for that workout
      await createWorkoutSets({
        sets: sets.map(s => ({
          rep_amount: Number(s.repAmount),
          weight_amount: Number(s.weightAmount),
          to_failure: s.toFailure ? 1 : 0,
          workout_id: workoutId,
        })),
      });

      setSuccessMsg("Workout saved successfully!");
      // Optionally navigate after a short delay:
      setTimeout(() => {
        navigate("/workouts");
      }, 800);
    } catch (err: any) {
      setError(err.message ?? String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ color: "white", fontFamily: "sans-serif" }}>
      <h1>Log New Workout</h1>

      {error && <p style={{ color: "#fca5a5" }}>Error: {error}</p>}
      {successMsg && <p style={{ color: "#22c55e" }}>{successMsg}</p>}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: 480,
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Date
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{
              padding: "0.25rem 0.5rem",
              borderRadius: 6,
              border: "1px solid #374151",
              background: "#020617",
              color: "white",
            }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Workout length (minutes)
          <input
            type="number"
            min={1}
            value={lengthMinutes}
            onChange={e => setLengthMinutes(Number(e.target.value))}
            style={{
              padding: "0.25rem 0.5rem",
              borderRadius: 6,
              border: "1px solid #374151",
              background: "#020617",
              color: "white",
            }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Exercise ID
          <input
            type="number"
            min={1}
            value={exerciseId}
            onChange={e => setExerciseId(Number(e.target.value))}
            style={{
              padding: "0.25rem 0.5rem",
              borderRadius: 6,
              border: "1px solid #374151",
              background: "#020617",
              color: "white",
            }}
          />
          <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>
            (Temporary: enter an existing exercise_id from the database; later
            this will be a dropdown.)
          </span>
        </label>

        <div>
          <h2>Sets</h2>
          {sets.map((set, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <input
                type="number"
                min={1}
                value={set.repAmount}
                onChange={e =>
                  updateSet(index, { repAmount: Number(e.target.value) })
                }
                placeholder="Reps"
                style={{
                  width: 80,
                  padding: "0.25rem 0.5rem",
                  borderRadius: 6,
                  border: "1px solid #374151",
                  background: "#020617",
                  color: "white",
                }}
              />
              <input
                type="number"
                min={0}
                step={0.5}
                value={set.weightAmount}
                onChange={e =>
                  updateSet(index, { weightAmount: Number(e.target.value) })
                }
                placeholder="Weight (kg)"
                style={{
                  width: 120,
                  padding: "0.25rem 0.5rem",
                  borderRadius: 6,
                  border: "1px solid #374151",
                  background: "#020617",
                  color: "white",
                }}
              />
              <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <input
                  type="checkbox"
                  checked={set.toFailure}
                  onChange={e =>
                    updateSet(index, { toFailure: e.target.checked })
                  }
                />
                to failure
              </label>
              {sets.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSetRow(index)}
                  style={{
                    border: "none",
                    borderRadius: 999,
                    padding: "0.25rem 0.5rem",
                    background: "#b91c1c",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  X
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addSetRow}
            style={{
              marginTop: "0.25rem",
              border: "none",
              borderRadius: 999,
              padding: "0.25rem 0.75rem",
              background: "#1d4ed8",
              color: "white",
              cursor: "pointer",
            }}
          >
            + Add set
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            marginTop: "0.75rem",
            padding: "0.5rem 1rem",
            borderRadius: 999,
            border: "none",
            background: "#22c55e",
            color: "#020617",
            fontWeight: 600,
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Saving..." : "Save workout"}
        </button>
      </form>
    </div>
  );
}
