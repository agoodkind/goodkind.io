import express from "express";
import path from "path";

const app = express();
const port = 3000; // You can choose any port

// Serve static files from the /dist directory
app.use(express.static(path.join(__dirname, "./dist")));

app.get("*", (_req, res) => {
  res.sendFile("index.html");
});

app.listen(port, () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});