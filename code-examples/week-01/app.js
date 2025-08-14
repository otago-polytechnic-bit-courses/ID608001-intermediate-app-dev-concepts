import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const app = express();

const PORT = process.env.PORT || 4000;

const institutions = [
  {
    id: 1,
    name: "Otago Polytechnic",
    region: "Otago",
    country: "New Zealand",
  },
  {
    id: 2,
    name: "Southern Institute of Technology",
    region: "Southland",
    country: "New Zealand",
  },
];

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

const institutionResolvers = {
  institutions: () => institutions,
};

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
