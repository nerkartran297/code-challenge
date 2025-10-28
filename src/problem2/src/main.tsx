import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="h-screen w-screen flex items-center justify-center bg-gray-500">
      <App />
    </div>
  </StrictMode>
);
