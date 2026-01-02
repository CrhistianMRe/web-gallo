import { Link, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ExerciseCatalogPage } from "./pages/ExerciseCatalogPage";
import { WorkoutHistoryPage } from "./pages/WorkoutHistoryPage";
import { NewWorkoutPage } from "./pages/NewWorkoutPage";
import { BackendTestPage } from "./pages/BackendTestPage";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "white" }}>
      <nav
        style={{
          display: "flex",
          gap: "1rem",
          padding: "0.75rem 1.5rem",
          borderBottom: "1px solid #111827",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>Gallo</span>
        <Link to="/">Home</Link>
        <Link to="/exercises">Exercises</Link>
        <Link to="/workouts">Workouts</Link>
        <Link to="/workouts/new">Log Workout</Link>
        <Link
          to="/backend-test"
          style={{ marginLeft: "auto", fontSize: "0.8rem", opacity: 0.8 }}
        >
          Backend Test
        </Link>
      </nav>

      <main style={{ padding: "1.5rem" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exercises" element={<ExerciseCatalogPage />} />
          <Route path="/workouts" element={<WorkoutHistoryPage />} />
          <Route path="/workouts/new" element={<NewWorkoutPage />} />
          <Route path="/backend-test" element={<BackendTestPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
