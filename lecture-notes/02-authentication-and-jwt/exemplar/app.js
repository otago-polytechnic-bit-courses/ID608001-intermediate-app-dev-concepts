import express from "express";
import cors from "cors";

import institutionRoutes from "./routes/institution.js";

const app = express();

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

app.use("/api/institutions", institutionRoutes);

app.listen(3000, () => {
  console.log("Server is listening on port 3000.");
});

export default app;
