import { Link, useLocation } from "react-router-dom";

const navStyle: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
  alignItems: "center",
  padding: "1rem 1.5rem",
  background: "#020617",
  borderBottom: "1px solid #1f2937"
};

const linkBase: React.CSSProperties = {
  padding: "0.35rem 0.75rem",
  borderRadius: "9999px",
  fontSize: "0.9rem"
};

function NavLink({ to, label }: { to: string; label: string }) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      style={{
        ...linkBase,
        background: active ? "#22c55e" : "transparent",
        color: active ? "#020617" : "#e5e7eb"
      }}
    >
      {label}
    </Link>
  );
}

export function NavBar() {
  return (
    <nav style={navStyle}>
      <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>Gallo</div>
      <NavLink to="/exercises" label="Exercises" />
      <NavLink to="/workouts" label="Workouts" />
      <NavLink to="/workouts/new" label="Log Workout" />
      <div style={{ marginLeft: "auto", fontSize: "0.85rem", opacity: 0.8 }}>
        {/* later: user info */}
      </div>
    </nav>
  );
}
