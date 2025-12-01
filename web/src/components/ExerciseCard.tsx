import React from "react";

export interface ExerciseCardProps {
  name: string;
  description?: string | null;
  weightRequired: boolean;
  imageUrl?: string | null;
  bodyParts?: string[];
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  name,
  description,
  weightRequired,
  imageUrl,
  bodyParts = [],
}) => {
  return (
    <div
      style={{
        background: "#020617",
        borderRadius: 12,
        padding: "0.75rem 1rem",
        border: "1px solid #111827",
        display: "flex",
        gap: "0.75rem",
      }}
    >
      {imageUrl && (
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 12,
            overflow: "hidden",
            flexShrink: 0,
            background: "#0f172a",
          }}
        >
          <img
            src={imageUrl}
            alt={name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "0.4rem",
            marginBottom: "0.25rem",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            {name}
          </h3>
          <span
            style={{
              fontSize: "0.8rem",
              padding: "0.05rem 0.4rem",
              borderRadius: 999,
              background: weightRequired ? "#f97316" : "#22c55e",
              color: "#020617",
              fontWeight: 600,
            }}
          >
            {weightRequired ? "Weights" : "Bodyweight"}
          </span>
        </div>

        {description && (
          <p
            style={{
              margin: 0,
              fontSize: "0.85rem",
              opacity: 0.9,
            }}
          >
            {description}
          </p>
        )}

        {bodyParts.length > 0 && (
          <div
            style={{
              marginTop: "0.4rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.25rem",
            }}
          >
            {bodyParts.map(bp => (
              <span
                key={bp}
                style={{
                  fontSize: "0.75rem",
                  padding: "0.1rem 0.4rem",
                  borderRadius: 999,
                  background: "#0f172a",
                  border: "1px solid #1f2937",
                }}
              >
                {bp}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
