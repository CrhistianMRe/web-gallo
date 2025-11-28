import type { Exercise } from "../types";

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "0.75rem",
        background: "#020617",
        border: "1px solid #111827",
        display: "flex",
        gap: "1rem"
      }}
    >
      {exercise.imageUrl && (
        <img
          src={exercise.imageUrl}
          alt={exercise.name}
          style={{ width: 64, height: 64, borderRadius: 12, objectFit: "cover" }}
        />
      )}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <h3 style={{ margin: 0, fontSize: "1rem" }}>{exercise.name}</h3>
          {exercise.weightRequired && (
            <span
              style={{
                fontSize: "0.75rem",
                padding: "0.15rem 0.5rem",
                borderRadius: 999,
                border: "1px solid #4b5563"
              }}
            >
              + Weights
            </span>
          )}
        </div>
        {exercise.description && (
          <p style={{ margin: "0.25rem 0", fontSize: "0.85rem", opacity: 0.9 }}>
            {exercise.description}
          </p>
        )}
        {exercise.bodyParts.length > 0 && (
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.35rem" }}>
            {exercise.bodyParts.map(bp => (
              <span
                key={bp.id}
                style={{
                  fontSize: "0.7rem",
                  padding: "0.1rem 0.4rem",
                  borderRadius: 999,
                  background: "#111827"
                }}
              >
                {bp.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
