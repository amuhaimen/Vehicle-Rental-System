import express, { Request, Response } from "express";
import config from "./config";
const app = express();
const port = config.port;

// parser middleware
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from vehicle rental system...");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
