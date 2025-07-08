import cors from "cors";
import express, { urlencoded, json } from "express";

import institutionRoutes from "./routes/institution.js";

const BASE_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";

const app = express();

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

app.use("/api/institutions", institutionRoutes);

app.use((req, res, next) =>
  res.status(404).json({ msg: `${req.method}: ${req.url} not found` }),
);

app.listen(3000, () => {
  console.log("Server is listening on port 3000.");
});

export default app;
