import { useEffect, useMemo, useState } from "react";
import { getBodyParts, getExercisesByBodyPartId } from "../api/httpApi";
import type { BodyPart, ExerciseByBodyPartRow } from "../types";
import { ExerciseCard } from "../components/ExerciseCard";

export function ExerciseCatalogPage() {
  const [bodyParts, setBodyParts] = useState<BodyPart[]>([]);
  const [selectedBodyPartId, setSelectedBodyPartId] = useState<number | null>(
    null
  );
  const [exercises, setExercises] = useState<ExerciseByBodyPartRow[]>([]);
  const [loadingParts, setLoadingParts] = useState(true);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // find the currently selected body part object
  const selectedBodyPart = useMemo(
    () =>
      bodyParts.find(bp => bp.id === selectedBodyPartId) ?? null,
    [bodyParts, selectedBodyPartId]
  );

  // 1) Load body parts on mount
  useEffect(() => {
    async function loadBodyParts() {
      try {
        setLoadingParts(true);
        setError(null);
        const parts = await getBodyParts();
        setBodyParts(parts);
        if (parts.length > 0) {
          setSelectedBodyPartId(prev =>
            prev !== null ? prev : parts[0].id
          );
        }
      } catch (e: any) {
        setError(e.message ?? String(e));
      } finally {
        setLoadingParts(false);
      }
    }

    loadBodyParts();
  }, []);

  // 2) Whenever selected body part changes, load its exercises
  useEffect(() => {
    if (selectedBodyPartId === null) return;

    async function loadExercises() {
      try {
        setLoadingExercises(true);
        setError(null);
        const rows = await getExercisesByBodyPartId(selectedBodyPartId);
        setExercises(rows);
      } catch (e: any) {
        setError(e.message ?? String(e));
      } finally {
        setLoadingExercises(false);
      }
    }

    loadExercises();
  }, [selectedBodyPartId]);

  return (
    <div style={{ color: "white", fontFamily: "sans-serif" }}>
      <h1>Exercise Catalog</h1>

      {error && (
        <p style={{ color: "#fca5a5" }}>
          Error: {error}
        </p>
      )}

      {/* Body part filter row */}
      <section style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "0.95rem", opacity: 0.9 }}>Filter by body part</h2>
        {loadingParts && <p>Loading body parts…</p>}
        {!loadingParts && bodyParts.length === 0 && (
          <p>No body parts defined in the database.</p>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.4rem",
            marginTop: "0.5rem",
          }}
        >
          {bodyParts.map(bp => {
            const isActive = bp.id === selectedBodyPartId;
            return (
              <button
                key={bp.id}
                onClick={() => setSelectedBodyPartId(bp.id)}
                style={{
                  padding: "0.25rem 0.75rem",
                  borderRadius: 999,
                  border: "1px solid #1f2937",
                  background: isActive ? "#22c55e" : "#020617",
                  color: isActive ? "#020617" : "#e5e7eb",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                {bp.name}
              </button>
            );
          })}
        </div>

        {selectedBodyPart && (
          <div
            style={{
              marginTop: "0.75rem",
              background: "#020617",
              border: "1px solid #111827",
              borderRadius: 12,
              padding: "0.75rem 1rem",
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
            }}
          >
            {selectedBodyPart.image_url && (
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  overflow: "hidden",
                  flexShrink: 0,
                  background: "#0f172a",
                }}
              >
                <img
                  src={selectedBodyPart.image_url}
                  alt={selectedBodyPart.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}

            <div style={{ minWidth: 0 }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  marginBottom: "0.15rem",
                }}
              >
                {selectedBodyPart.name}
              </div>
              {selectedBodyPart.description && (
                <div style={{ fontSize: "0.85rem", opacity: 0.9 }}
                >
                  {selectedBodyPart.description}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Exercises grid */}
      <section>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "0.75rem",
            marginBottom: "0.5rem",
          }}
        >
          <h2 style={{ fontSize: "1rem", margin: 0 }}>
            {selectedBodyPart
              ? `Exercises for ${selectedBodyPart.name}`
              : "Exercises"}
          </h2>
          <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>
            {exercises.length} exercise{exercises.length === 1 ? "" : "s"}
          </span>
        </div>

        {loadingExercises && <p>Loading exercises…</p>}

        {!loadingExercises && exercises.length === 0 && (
          <p>No exercises found for this body part.</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "0.75rem",
            marginTop: "0.5rem",
          }}
        >
          {exercises.map(ex => (
            <ExerciseCard
              key={ex.exercise_id}
              name={ex.name}
              description={ex.description}
              weightRequired={!!ex.weight_required}
              imageUrl={ex.image_url ?? undefined}
              bodyParts={
                selectedBodyPart ? [selectedBodyPart.name] : undefined
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
