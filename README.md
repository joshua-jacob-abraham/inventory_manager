# Inventory Management App Setup Guide

## Overview
This guide walks through the steps to set up and compile the backend, configure MySQL, and integrate everything into the Electron-based frontend.

---

## 1. Compile the Backend
The backend is built using FastAPI and needs to be compiled into an executable for deployment.

### Steps:
1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Use `pyinstaller` to compile all backend files:
   ```sh
   pyinstaller --onefile main.py
   ```
3. After compilation, the built files will be located inside the `dist/` folder.
4. Move the `dist/` folder into the `backend/` directory for easy access.

---

## 2. Set Up MySQL
The MySQL database is stored inside the Electron app directory under the `frontend/` folder.

### Directory Structure:
```
frontend/
|--electron/
│   |-- mysql/
│   |   │-- bin/
│   |   │   │-- data/
│   |   │   │-- share/
│   |   │   │-- lib/
│   |   │-- my.ini
```

### Steps:
1. Download and extract the MySQL zip file.
2. Place the extracted files inside `frontend/electron/mysql/`.
3. Ensure the `bin/` directory contains `data/`, `share/`, and `lib/` folders.
4. The `my.ini` configuration file is already provided in the `mysql/` directory.

---

## 3. Initialize MySQL Server
The MySQL server needs to be initialized before use.

### Steps:
1. Open a terminal and navigate to the MySQL `bin/` directory:
   ```sh
   cd frontend/electron/mysql/bin
   ```
2. Initialize the MySQL server **without a password**:
   ```sh
   mysqld --initialize-insecure
   ```
   - This starts MySQL without a root password.
3. (Optional) If your backend requires a password, set it later using:
   ```sh
   mysqladmin -u root password "your_password"
   ```

---

## 4. Running the Application
Once MySQL is set up and the backend is compiled, you can launch the app:

1. Start the MySQL server:
   ```sh
   mysqld --console
   ```
2. Run the backend executable:
   ```sh
   cd backend/dist
   ./main.exe
   ```
3. Start the Electron app:
   ```sh
   cd frontend
   npm start 
   ```
---

## Notes
- Ensure MySQL is running before launching the backend and frontend.
- If you face permission issues, try running commands as an administrator.
- Use npm run <script> if a different command is set in package.json scripts.
---

Now you're all set! 🚀

