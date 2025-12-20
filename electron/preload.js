const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("galloDesktop", {
  /**
   * Export workouts to a CSV or JSON file.
   * @param {{ workouts: any[]; format: "csv" | "json" }} payload
   * @returns {Promise<{ success: boolean; filePath?: string; error?: string }>}
   */
  exportWorkouts: (payload) =>
    ipcRenderer.invoke("export-workouts", payload),
});
