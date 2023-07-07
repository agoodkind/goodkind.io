import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

// eslint-disable-next-line n/no-missing-import
import "@styles/main.css";

// todo: https://www.npmjs.com/package/favicons

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
