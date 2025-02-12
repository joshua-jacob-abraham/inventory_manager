import { app, BrowserWindow } from "electron";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
import { spawn } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow;
let pythonProcess;

function startFastAPI() {
  const isProd = process.env.NODE_ENV === "production";
  const backendPath = isProd
    ? path.join(process.resourcesPath, "backend")
    : path.join(__dirname, "../../backend");

  const pythonCommand = process.platform === "win32" ? "python" : "python3";

  pythonProcess = spawn(
    pythonCommand,
    ["-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"],
    {
      cwd: backendPath,
    }
  );

  pythonProcess.stdout.on("data", (data) => {
    console.log(`FastAPI: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`FastAPI Error: ${data}`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: __dirname + "/app_icon.ico",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
  });

  const startUrl = pathToFileURL(
    path.join(__dirname, "..", "dist", "index.html")
  ).href;
  mainWindow.loadURL(startUrl);
}

app.whenReady().then(() => {
  startFastAPI();
  createWindow();
});

app.on("window-all-closed", () => {
  if (pythonProcess) {
    process.platform === "win32"
      ? spawn("taskkill", ["/pid", pythonProcess.pid, "/f", "/t"])
      : pythonProcess.kill();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
