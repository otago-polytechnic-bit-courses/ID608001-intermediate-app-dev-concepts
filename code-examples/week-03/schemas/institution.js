export const institutionSchema = `
    type Institution {
        id: ID!
        name: String!
        region: String!
        country: String!
    }

    type Query {
        institutions: [Institution]
        institution(id: ID!): Institution
        institutionsByCountry(country: String!): [Institution]
        institutionsByRegion(region: String!): [Institution]
    }
`;
