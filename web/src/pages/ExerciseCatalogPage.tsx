import { useEffect, useState } from "react";
import { api } from "../api";
import type { Exercise } from "../types";
import { ExerciseCard } from "../components/ExerciseCard";

export function ExerciseCatalogPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.getExercises().then(setExercises).finally(() => setLoading(false));
  }, []);

  const filtered = exercises.filter(e =>
    e.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <h1>Exercise Catalog</h1>
      <div style={{ margin: "0.75rem 0 1.25rem" }}>
        <input
          placeholder="Search exercise..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 360,
            padding: "0.5rem 0.75rem",
            borderRadius: 999,
            border: "1px solid #374151"
          }}
        />
      </div>

      {loading && <div>Loading exercises...</div>}

      {!loading && filtered.length === 0 && <div>No exercises found.</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {filtered.map(ex => (
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}
      </div>
    </div>
  );
}
