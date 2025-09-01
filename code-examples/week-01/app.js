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
    institution(id: ID!): Institution
    institutionsByRegion(region: String!): [Institution!]!
    institutionsByCountry(country: String!): [Institution!]!
  }
`;

const institutionResolvers = {
  institutions: () => institutions,
  institution: ({ id }) => {
    const institution = institutions.find((inst) => inst.id === parseInt(id));
    if (!institution) {
      throw new Error(`No institution with the id: ${id} found`);
    }
    return institution;
  },
  institutionsByRegion: ({ region }) =>
    institutions.filter((institution) => institution.region === region),
  institutionsByCountry: ({ country }) =>
    institutions.filter((institution) => institution.country === country),
};

const schema = buildSchema(institutionSchema);

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: institutionResolvers,
    graphiql: true,
    formatError: (err) => ({
      message: err.message,
    }),
  })
);

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit http://localhost:${PORT}/graphql`
  );
});

export default app;
