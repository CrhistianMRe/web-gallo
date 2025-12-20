const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs").promises;

const WEB_DEV_URL = "http://localhost:5173";
const isDev = process.env.NODE_ENV === "development";

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    win.loadURL(WEB_DEV_URL); //if u want dev tools then ctrl + shift + i
  } else {
    const indexHtml = path.join(__dirname, "..", "web", "dist", "index.html");
    win.loadFile(indexHtml);
  }
}

// Helper: CSV escaping
function escapeCsv(value) {
  if (value == null) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Helper: convert WorkoutSummary[] to CSV string
function workoutsToCsv(workouts) {
  const header = [
    "workout_date",
    "exercise_name",
    "workout_length_min",
    "body_parts",
    "set_index",
    "rep_amount",
    "weight_amount",
    "to_failure",
  ];

  const rows = [header.join(",")];

  for (const w of workouts || []) {
    const bodyParts = Array.isArray(w.body_parts)
      ? w.body_parts.join("; ")
      : "";

    if (!Array.isArray(w.sets) || w.sets.length === 0) {
      rows.push(
        [
          escapeCsv(w.workout_date),
          escapeCsv(w.exercise_name),
          escapeCsv(w.workout_length),
          escapeCsv(bodyParts),
          "",
          "",
          "",
          "",
        ].join(","),
      );
      continue;
    }

    w.sets.forEach((s, index) => {
      rows.push(
        [
          escapeCsv(w.workout_date),
          escapeCsv(w.exercise_name),
          escapeCsv(w.workout_length),
          escapeCsv(bodyParts),
          String(index + 1),
          escapeCsv(s.rep_amount),
          escapeCsv(s.weight_amount),
          s.to_failure ? "1" : "0",
        ].join(","),
      );
    });
  }

  return rows.join("\n");
}

// IPC handler: export workouts to CSV or JSON
ipcMain.handle("export-workouts", async (_event, payload) => {
  try {
    const { workouts, format } = payload || {};

    if (!Array.isArray(workouts) || workouts.length === 0) {
      return { success: false, error: "No workouts to export." };
    }

    const filters =
      format === "json"
        ? [{ name: "JSON", extensions: ["json"] }]
        : [{ name: "CSV", extensions: ["csv"] }];

    const { canceled, filePath } = await dialog.showSaveDialog({
      title: "Export workouts",
      defaultPath:
        format === "json" ? "workouts.json" : "workouts.csv",
      filters,
    });

    if (canceled || !filePath) {
      return { success: false, error: "canceled" };
    }

    let dataToWrite;
    if (format === "json") {
      dataToWrite = JSON.stringify(workouts, null, 2);
    } else {
      dataToWrite = workoutsToCsv(workouts);
    }

    await fs.writeFile(filePath, dataToWrite, "utf-8");

    return { success: true, filePath };
  } catch (err) {
    console.error("export-workouts error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
});

// App lifecycle
app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
