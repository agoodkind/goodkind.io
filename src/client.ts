import { hydrateRoot } from "react-dom/client";
import { app } from "./app";

const domNode = document.getElementById("root");
hydrateRoot(domNode!, app());
