import type { Exercise, Workout, NewWorkout } from "../types";

export interface Api {
  register(email: string, password: string): Promise<{ token: string; userId: number }>;
  login(email: string, password: string): Promise<{ token: string; userId: number }>;
  getExercises(): Promise<Exercise[]>;
  getWorkouts(): Promise<Workout[]>;
  getWorkout(id: number): Promise<Workout | null>;
  createWorkout(payload: NewWorkout): Promise<Workout>;
}
