const typeDefs = `
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
`;

export default typeDefs;
