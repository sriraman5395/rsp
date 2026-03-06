import express from "express";
import cors from "cors";
import { apiRouter } from "./src/routes/api";
import dotenv from "dotenv";

dotenv.config();

import path from "path";



async function startServer() {
  const app = express();
const PORT = Number(process.env.PORT) || 5000;

  app.use(cors());
  app.use(express.json());
app.use("/uploads", express.static("uploads"));

  // API Routes
  app.use("/api", apiRouter);

  const frontendPath = path.join(__dirname,'../frontend/dist');
  app.use(express.static(frontendPath));

  app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });

  // Vite middleware for development


  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
  });
}

startServer();
