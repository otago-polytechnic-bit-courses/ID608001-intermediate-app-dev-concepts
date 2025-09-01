import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const app = express();
const PORT = process.env.PORT || 4000;

// Data Layer
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

const departments = [
  {
    id: 1,
    name: "Information Technology",
    institutionId: 1,
  },
  {
    id: 2,
    name: "Nursing",
    institutionId: 2,
  },
];

const schema = buildSchema(`
  type Institution {
    id: ID!
    name: String!
    region: String!
    country: String!
    departments: [Department!]!
  }

  type Department {
    id: ID!
    name: String!
    institutionId: ID!
    institution: Institution!
  }

  type Query {
    institutions: [Institution!]!
    institution(id: ID!): Institution
    departments: [Department!]!
    department(id: ID!): Department
  }
`);

const findById = (array, id) => array.find((item) => item.id === parseInt(id));
const filterBy = (array, field, value) =>
  array.filter((item) => item[field] === value);

const resolvers = {
  institutions: () =>
    institutions.map((inst) => ({
      ...inst,
      departments: () => filterBy(departments, "institutionId", inst.id),
    })),

  institution: ({ id }) => {
    const institution = findById(institutions, id);
    if (!institution)
      throw new Error(`No institution with the id: ${id} found`);
    return {
      ...institution,
      departments: () => filterBy(departments, "institutionId", institution.id),
    };
  },

  departments: () =>
    departments.map((dept) => ({
      ...dept,
      institution: () => findById(institutions, dept.institutionId),
    })),

  department: ({ id }) => {
    const department = findById(departments, id);
    if (!department) throw new Error(`No department with the id: ${id} found`);
    return {
      ...department,
      institution: () => findById(institutions, department.institutionId),
    };
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true,
    customFormatErrorFn: (err) => ({ message: err.message }),
  })
);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`);
});

export default app;
