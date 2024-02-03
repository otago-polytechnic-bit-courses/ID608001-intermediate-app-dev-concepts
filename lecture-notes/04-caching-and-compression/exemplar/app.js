import express, { urlencoded, json } from "express";
import cors from "cors";
import compression from "compression";

import authRouteMiddleware from "./middleware/authRoute.js";
import cacheRouteMiddleware from "./middleware/cacheRoute.js";

import authV1Routes from "./routes/v1/auth.js";
import institutionV1Routes from "./routes/v1/institution.js";

const app = express();

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cacheRouteMiddleware);
app.use(compression());

app.use("/api/v1/auth", authV1Routes);
app.use("/api/v1/institutions", authRouteMiddleware, institutionV1Routes); // Authenticated route
app.get("/api/v1/optimisation", (req, res) => {
  const text = "See you later, alligator. Bye bye bye, butterfly";
  res.json({ msg: text.repeat(1000) });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000.");
});

export default app;
