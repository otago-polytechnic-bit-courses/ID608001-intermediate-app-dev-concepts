import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

import { institutionResolvers } from "./resolvers/institution.js";
import { institutionSchema } from "./schemas/institution.js";

const app = express();

const PORT = process.env.PORT || 4000;

const institutionSchema = `
    type Institution {
        id: ID!
        name: String!
        region: String!
        country: String!
    }

    type Query {
        institutions: [Institution!]!
    }
`;

const schema = buildSchema(institutionSchema);

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: institutionResolvers,
    graphiql: true,
  })
);

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit http://localhost:${PORT}`
  );
});

export default app;
