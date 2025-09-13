import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Confirm from "./Confirm";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Confirm />} />
        <Route path="/app" element={<App />} />

        {/* Nếu route không khớp → redirect về domain */}
        <Route
          path="*"
          element={
            <Navigate to="https://www.tigerstreetfootball2025.vn/" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
