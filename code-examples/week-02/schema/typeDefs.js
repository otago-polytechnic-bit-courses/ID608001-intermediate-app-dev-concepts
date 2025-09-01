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

  type InstitutionCreateResponse {
    message: String!
    data: [Institution!]!
  }

  type InstitutionUpdateResponse {
    message: String!
    data: Institution!
  }

  type InstitutionDeleteResponse {
    message: String!
  }

  type Mutation {
    createInstitution(input: CreateInstitutionInput!): InstitutionCreateResponse!
    updateInstitution(id: ID!, input: UpdateInstitutionInput!): InstitutionUpdateResponse!
    deleteInstitution(id: ID!): InstitutionDeleteResponse!
    createDepartment(input: CreateDepartmentInput!): Department!
    updateDepartment(id: ID!, input: UpdateDepartmentInput!): Department!
    deleteDepartment(id: ID!): String!
  }
`;

export default typeDefs;
