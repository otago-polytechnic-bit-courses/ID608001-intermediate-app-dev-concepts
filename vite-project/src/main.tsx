import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.tsx";
import Dashboard from "./components/Dashboard.tsx";
import Home from "./components/Home.tsx";
import Settings from "./components/Settings.tsx";
import User from "./components/User.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="user/:id" element={<User />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
