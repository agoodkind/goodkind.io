import { createRoot } from "react-dom/client";
import {StrictMode} from "react";
import App from "./App";
import "@styles/main.css";

// todo: https://www.npmjs.com/package/favicons

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
