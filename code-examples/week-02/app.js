import express from "express";
import { graphqlHTTP } from "express-graphql";

import schema from "./schema/index.js";
import resolvers from "./resolvers/index.js";
import prisma from "./prisma/client.js";

const app = express();

const PORT = process.env.PORT || 4000;

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true,
    context: { prisma },
    customFormatErrorFn: (err) => ({ message: err.message }),
  })
);

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit http://localhost:${PORT}/graphql`
  );
});

export default app;
