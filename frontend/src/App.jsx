// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import TotalTasksPage from "./pages/TotalTasksPage";
import TodoListPage from "./pages/TodoPage"; // ✅ Use actual filename
import InProgressPage from "./pages/InProgressPage";
import CompletedPage from "./pages/CompletedPage";
import DraftsPage from "./pages/DraftsPage";
import TodayPage from "./pages/TodayPage";
import UpcomingPage from "./pages/UpcomingPage";
import ProgressPage from "./pages/ProgressPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { ModalProvider } from "./contexts/ModalContext";
// import "./App.css";

function App() {
  return (
    <ModalProvider>
      <Router>
        <Routes>
          {/* === PUBLIC PAGES === */}
          <Route
            path="/"
            element={
              <div className="app public-layout">
                <main className="main--public">
                  <HomePage />
                </main>
              </div>
            }
          />
          <Route
            path="/login"
            element={
              <div className="app public-layout">
                <main className="main--public">
                  <LoginPage />
                </main>
              </div>
            }
          />
          <Route
            path="/signup"
            element={
              <div className="app public-layout">
                <main className="main--public">
                  <SignupPage />
                </main>
              </div>
            }
          />

          {/* === DASHBOARD & SIDEBAR PAGES === */}
          <Route
            path="/*"
            element={
              <div className="app sidebar-layout">
                {/* <Sidebar /> */}
                <main className="main">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/total-tasks" element={<TotalTasksPage />} />
                    <Route path="/todo-list" element={<TodoListPage />} />
                    <Route path="/in-progress" element={<InProgressPage />} />
                    <Route path="/completed" element={<CompletedPage />} />
                    <Route path="/drafts" element={<DraftsPage />} />
                    <Route path="/today" element={<TodayPage />} />
                    <Route path="/upcoming" element={<UpcomingPage />} />
                    <Route path="/progress" element={<ProgressPage />} />
                  </Routes>
                </main>
              </div>
            }
          />
        </Routes>
      </Router>
    </ModalProvider>
  );
}

export default App;
