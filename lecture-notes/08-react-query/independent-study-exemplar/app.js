import express, { urlencoded, json } from "express";
import cors from "cors";

import authRouteMiddleware from "./middleware/authRoute.js";

import authV1Routes from "./routes/v1/auth.js";
import institutionV1Routes from "./routes/v1/institution.js";

const app = express();

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

app.use("/api/v1/auth", authV1Routes);
app.use("/api/v1/institutions", authRouteMiddleware, institutionV1Routes); // Authenticated route

app.listen(3000, () => {
  console.log("Server is listening on port 3000.");
});

export default app;
