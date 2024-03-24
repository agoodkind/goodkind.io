import ReactDOMServer from "react-dom/server";
import { app } from "./app";

ReactDOMServer.renderToString(app());
