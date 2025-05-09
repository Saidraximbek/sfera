import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router-dom";
import { GLobalCOntextProvider } from "./context/GlobalContext.jsx";
createRoot(document.getElementById("root")).render(
  <GLobalCOntextProvider>
    <App />
  </GLobalCOntextProvider>
);
