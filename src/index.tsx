import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// entry point
const rootElem = document.getElementById("root");
if (rootElem != null) {
  const root = ReactDOM.createRoot(rootElem);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}