import express from "express";
import cors from "cors";
import { apiRouter } from "./src/routes/api";
import dotenv from "dotenv";

dotenv.config();

import path from "path";



async function startServer() {
  const app = express();
const PORT = 5000;

  app.use(cors());
  app.use(express.json());
app.use("/uploads", express.static("uploads"));

  // API Routes
  app.use("/api", apiRouter);

  // Vite middleware for development


  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
  });
}

startServer();
