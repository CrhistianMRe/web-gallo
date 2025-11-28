import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/LoginPage";
import { ExerciseCatalogPage } from "./pages/ExerciseCatalogPage";
import { WorkoutHistoryPage } from "./pages/WorkoutHistoryPage";
import { WorkoutDetailPage } from "./pages/WorkoutDetailPage";
import { NewWorkoutPage } from "./pages/NewWorkoutPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/exercises" element={<ExerciseCatalogPage />} />
        <Route path="/workouts" element={<WorkoutHistoryPage />} />
        <Route path="/workouts/new" element={<NewWorkoutPage />} />
        <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
        <Route path="*" element={<Navigate to="/exercises" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
