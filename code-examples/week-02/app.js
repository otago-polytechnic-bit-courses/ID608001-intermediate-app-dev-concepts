import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";

import schema from "./schema/index.js";
import resolvers from "./resolvers/index.js";
import prisma from "./prisma/client.js";

const app = express();

const PORT = process.env.PORT || 4000;

app.all(
  "/graphql",
  createHandler({
    schema,
    rootValue: resolvers,
    context: { prisma },
    formatError: (err) => ({ message: err.message }),
  })
);

app.get("/", (req, res) => {
  res.send(ruruHTML({ endpoint: "/graphql" }));
});

app.listen(4000, "0.0.0.0", () => {
  console.log("GraphQL server running on http://0.0.0.0:4000/graphql");
});


export default app;
