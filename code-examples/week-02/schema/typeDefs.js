const typeDefs = `
  type Institution {
    id: ID!
    name: String!
    region: String!
    country: String!
  }

  type Query {
    institutions: [Institution!]
    institution(id: ID!): Institution 
  }

  type Mutation {
    createInstitution(name: String!, region: String!, country: String!): Institution
  }
`;

export default typeDefs;
