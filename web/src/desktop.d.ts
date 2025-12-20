import type { WorkoutSummary } from "./types";

export interface ExportWorkoutsResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

declare global {
  interface Window {
    galloDesktop?: {
      exportWorkouts: (payload: {
        workouts: WorkoutSummary[];
        format: "csv" | "json";
      }) => Promise<ExportWorkoutsResult>;
    };
  }
}

export {};
