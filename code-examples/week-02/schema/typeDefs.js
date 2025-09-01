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

  input CreateInstitutionInput {
    name: String!
    region: String!
    country: String!
  }

  input UpdateInstitutionInput {
    name: String
    region: String
    country: String
  }

  input CreateDepartmentInput {
    name: String!
    institutionId: ID!
  }

  input UpdateDepartmentInput {
    name: String
    institutionId: ID
  }

  type Mutation {
    createInstitution(input: CreateInstitutionInput!): Institution!
    updateInstitution(id: ID!, input: UpdateInstitutionInput!): Institution!
    deleteInstitution(id: ID!): String!

    createDepartment(input: CreateDepartmentInput!): Department!
    updateDepartment(id: ID!, input: UpdateDepartmentInput!): Department!
    deleteDepartment(id: ID!): String!
  }
`;

export default typeDefs;
