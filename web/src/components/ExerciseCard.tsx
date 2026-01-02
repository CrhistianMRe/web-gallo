import React, { useEffect, useMemo, useState } from "react";

export interface ExerciseCardProps {
  name: string;
  description?: string | null;
  weightRequired: boolean;
  imageUrl?: string | null;
  bodyParts?: string[];
}

// Inline SVG placeholder (no extra assets needed)
const PLACEHOLDER_SVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#0f172a"/>
      <stop offset="1" stop-color="#111827"/>
    </linearGradient>
  </defs>
  <rect width="144" height="144" rx="18" fill="url(#g)"/>
  <path d="M34 98l22-24 18 20 12-14 24 28H34z" fill="#1f2937"/>
  <circle cx="56" cy="56" r="10" fill="#1f2937"/>
  <text x="72" y="126" font-size="12" text-anchor="middle" fill="#94a3b8" font-family="sans-serif">
    No image
  </text>
</svg>
`);
const PLACEHOLDER_SRC = `data:image/svg+xml,${PLACEHOLDER_SVG}`;

function normalizeText(v?: string | null): string {
  if (v == null) return "";
  const s = String(v).trim();
  return s;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  name,
  description,
  weightRequired,
  imageUrl,
  bodyParts = [],
}) => {
  const safeName = useMemo(() => normalizeText(name) || "Unnamed exercise", [name]);
  const safeDesc = useMemo(() => {
    const s = normalizeText(description);
    return s || "No description available yet.";
  }, [description]);

  const [src, setSrc] = useState<string>(() => {
    const u = normalizeText(imageUrl);
    return u ? u : PLACEHOLDER_SRC;
  });

  // Keep image in sync when props change (e.g., switching body parts)
  useEffect(() => {
    const u = normalizeText(imageUrl);
    setSrc(u ? u : PLACEHOLDER_SRC);
  }, [imageUrl]);

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
      {/* Always render an image tile (with fallback) */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 12,
          overflow: "hidden",
          flexShrink: 0,
          background: "#0f172a",
          border: "1px solid #1f2937",
        }}
      >
        <img
          src={src}
          alt={safeName}
          onError={() => {
            // If the upstream URL is broken/blocked, fall back.
            if (src !== PLACEHOLDER_SRC) setSrc(PLACEHOLDER_SRC);
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

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
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={safeName}
          >
            {safeName}
          </h3>

          <span
            style={{
              fontSize: "0.8rem",
              padding: "0.05rem 0.4rem",
              borderRadius: 999,
              background: weightRequired ? "#f97316" : "#22c55e",
              color: "#020617",
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {weightRequired ? "Weights" : "Bodyweight"}
          </span>
        </div>

        {/* Always show a description (with fallback text) */}
        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            opacity: 0.9,
            lineHeight: 1.25,
          }}
        >
          {safeDesc}
        </p>

        {bodyParts.length > 0 && (
          <div
            style={{
              marginTop: "0.4rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.25rem",
            }}
          >
            {bodyParts.map((bp) => (
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
