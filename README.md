# CPU Scheduling Visualizer

A full-stack MERN application to visualize and compare CPU scheduling algorithms (FCFS, SJF, SRTF, Round Robin) with a premium pastel green UI.

## Features
- **Authentication**: JWT-based Signup/Login system.
- **Dynamic Simulation**: Add/remove processes, set arrival/burst times.
- **Gantt Chart**: Animated visual timeline of process execution.
- **Detailed Metrics**: Completion Time, TAT, WT, and averages.
- **Comparison Tool**: Benchmarking all algorithms for the same data payload.
- **Modern UI**: Pastel green theme, leafy animations, glassmorphism.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB, JWT, Bcrypt.

## Setup Instructions

### Prerequisites
- Node.js installed.
- MongoDB running (locally or on Atlas).

### 1. Backend Setup
1. Open a terminal in the `server` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (one has been pre-created for you) and ensure the `MONGO_URI` is correct.
4. Start the server:
   ```bash
   npm start
   ```
   *(Or use `node index.js` if nodemon isn't installed globally)*

### 2. Frontend Setup
1. Open another terminal in the `client` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. Open the application at the URL provided by Vite (usually `http://localhost:5173`).

### 3. Usage
- Sign up for a new account.
- Log in to access the Dashboard.
- Choose an algorithm or use the Comparison tool.
- Add processes and hit "Simulate" or "Run Benchmarks".
