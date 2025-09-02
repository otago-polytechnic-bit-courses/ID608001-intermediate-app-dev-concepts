import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";

import schema from "./schema/index.js";
import resolvers from "./resolvers/index.js";

const app = express();

const PORT = process.env.PORT || 4000;

app.all(
  "/graphql",
  createHandler({
    schema,
    rootValue: resolvers,
    formatError: (err) => ({ message: err.message }),
  })
);

app.get("/", (req, res) => {
  res.send(ruruHTML({ endpoint: "/graphql" }));
});

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit http://localhost:${PORT}`
  );
});

export default app;
