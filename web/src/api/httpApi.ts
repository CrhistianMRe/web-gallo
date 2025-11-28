import type { Api } from "./base";
import type { Exercise, Workout, NewWorkout } from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

export const httpApi: Api = {
  async register(email: string, password: string) {
    return request<{ token: string; userId: number }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
  },

  async login(email: string, password: string) {
    return request<{ token: string; userId: number }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
  },

  async getExercises() {
    return request<Exercise[]>("/api/exercises");
  },

  async getWorkouts() {
    return request<Workout[]>("/api/workouts");
  },

  async getWorkout(id: number) {
    return request<Workout>(`/api/workouts/${id}`);
  },

  async createWorkout(payload: NewWorkout) {
    return request<Workout>("/api/workouts", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }
};
