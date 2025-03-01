# Inventory Management App Setup Guide

## Overview
This guide walks through the steps to:
1. Compile the backend into an executable.
2. Set up MySQL for the application.
3. Build and package the Electron-based frontend.
4. Generate an installer for easy deployment.

---

## 1. Compile the Backend
The backend, built using FastAPI, is compiled into an executable for deployment.

### Steps:
1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Use **PyInstaller** to create an executable:
   ```sh
   pyinstaller --onefile --hidden-import=pandas --hidden-import=reportlab --hidden-import=openpyxl --hidden-import=PyPDF2 --hidden-import=mysql-connector-python --hidden-import=fpdf --hidden-import=pydantic --hidden-import=fastapi --hidden-import=uvicorn main.py

   ```
4. After compilation, move the generated executable (`main.exe`) into the `backend/dist/` folder.

---

## 2. Set Up MySQL
The MySQL database is packaged inside the Electron app to ensure portability.

### Directory Structure:
```
frontend/
|-- electron/
│   |-- mysql/
│   │   │-- bin/
│   │   │-- data/
│   │   │-- share/
│   │   │-- lib/
│   │-- my.ini
```

### Steps:
1. Download and extract MySQL.
2. Move the extracted files to `frontend/electron/mysql/`.
3. Ensure that the `bin/`, `data/`, `share/`, and `lib/` folders are present.
4. The **my.ini** file is preconfigured inside the `mysql/` directory.

---

## 3. Initialize MySQL Server
Before using MySQL, it needs to be initialized.

### Steps:
1. Open a terminal and navigate to MySQL `bin/` directory:
   ```sh
   cd frontend/electron/mysql/bin
   ```
2. Initialize MySQL **without a password**:
   ```sh
   mysqld --initialize-insecure
   ```
3. (Optional) If a password is required, set it manually:
   ```sh
   mysqladmin -u root password "your_password"
   ```

---

## 4. Build and Package the Application

### Step 1: Build the Frontend
Run the following command in the **frontend** directory:
```sh
npm run build
```
This compiles the React frontend and stores the output in the `dist/` folder.

---

### Step 2: Package the Electron App
Run:
```sh
npm run electron:build
```
This does two things:
1. **Compiles the frontend** (`vite build`).
2. **Uses `electron-builder`** to create an installer.

After this step, the **installer** will be available in the `frontend/dist_electron/` folder.

---

## 5. Running the Application in Development Mode

### Option 1: Start the App Manually
1. **Start MySQL**:
   ```sh
   cd frontend/electron/mysql/bin
   mysqld --console
   ```
2. **Run the Backend**:
   ```sh
   cd backend/dist
   ./main.exe
   ```
3. **Start the Electron App**:
   ```sh
   cd frontend
   npm run electron:dev
   ```

### Option 2: Start Everything Automatically
If you want everything to start together, modify your scripts or use a batch script to run all these commands in sequence.

---

## 6. Notes
- Ensure **MySQL** is running before launching the backend and frontend.
- The Electron app automatically includes the **MySQL server** and **backend** when packaged, making installation seamless.
- Run commands as an **administrator** if permission issues occur.

---

Now you're all set! 🚀

