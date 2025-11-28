import type { Api } from "./base";
import { mockApi } from "./mockApi";
import { httpApi } from "./httpApi";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// Use mock while backend is not ready
export const api: Api = USE_MOCK ? mockApi : httpApi;
