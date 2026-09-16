import express, { Request, Response } from "express";
import config from "./config";
import initDb from "./config/db";
import { authRoutes } from "./modules/auth/ath.routes";

const app = express();

// parser middleware
app.use(express.json());

initDb();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from vehicle rental system...");
});

app.use("/api/v1/auth", authRoutes);

// not found route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
