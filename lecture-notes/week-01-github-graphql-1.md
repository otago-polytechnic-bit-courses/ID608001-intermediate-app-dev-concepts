# Week 01

## GitHub

This course will use **GitHub** and **GitHub Classroom** to manage our development. Begin by clicking this link <>. You will be prompted to accept an assignment. Click on the **Accept this assignment** button. **GitHub Classroom** will create a new repository.

> **Note:** You will use this repository for non-assessed work.

---

## Before We Start

Open your **id608001-s2-26-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-01-github-graphql-1**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## GraphQL

<Write stuff here>

---

## REST APIs vs. GraphQL APIs

<Write table here>

Here is a REST API example:

```bash
GET /api/institutions/1
```

Here is a GraphQL API example:

```graphql
{
  institution(id: 1) {
    id
    name
    region
  }
}
```

---

## Dependencies

To get started with **GraphQL** in your **Express** application, you need to install the following dependencies:

```bash
npm install express-graphql graphql
```

In `app.js`, add the following imports.

```js
// app.js

// Omitted for brevity

import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

// Omitted for brevity
```

---

## Mock Data Layer

In `app.js`, add the following code to create a mock data layer.

```js
// app.js

// Omitted for brevity

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

// Omitted for brevity
```

---

## Schemas

<Write stuff here>

```js
// app.js

// Omitted for brevity

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

const schema = buildSchema(institutionSchema);

// Omitted for brevity
```

---

## Resolvers

<Write stuff here>

```js
// app.js

// Omitted for brevity

const institutionResolvers = {
  institutions: () => institutions,
  institution: ({ id }) =>
    institutions.find((institution) => institution.id === parseInt(id)),
  institutionsByRegion: ({ region }) =>
    institutions.filter((institution) => institution.region === region),
  institutionsByCountry: ({ country }) =>
    institutions.filter((institution) => institution.country === country),
};

// Omitted for brevity
```

---

## Middleware

<Write stuff here>

```js
// app.js

// Omitted for brevity

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

// Omitted for brevity
```

---

## Error Handling

<Write stuff here>

```js
const institutionResolvers = {
  // Omitted for brevity
  institution: ({ id }) => {
    const institution = institutions.find((inst) => inst.id === parseInt(id));
    if (!institution) {
      throw new Error(`No institution with the id: ${id} found`);
    }
    return institution;
  },
  // Omitted for brevity
};
```

When you query for a non-existent institution, **GraphQL** will return:

```json
{
  "errors": [
    {
      "message": "No institution with the id: 3 found"
    }
  ],
  "data": {
    "institution": null
  }
}
```

---

## GraphiQL

<Write stuff here>

---

### Testing

<Write stuff here>

<ADD IMAGE HERE>

Here is an example of a query to get all institutions:

```graphql
{
  institutions {
    id
    name
    region
    country
  }
}
```

<ADD IMAGE HERE>

Here is an example of a query to get a specific institution:

```graphql
{
  institution(id: 1) {
    name
    region
  }
}
```

<ADD IMAGE HERE>

Here is an example of a query to get institutions in a specific region:

```graphql
{
  institutionsByRegion(region: "Otago") {
    name
    country
  }
}
```

<ADD IMAGE HERE>

Here is an example of a query to get institutions in a specific country:

```graphql
{
  institutionsByCountry(country: "New Zealand") {
    id
    name
    region
  }
}
```

Execute queries by clicking the **Execute Query** button or pressing `Ctrl + Enter`. The response will display in the right-hand panel.

<ADD IMAGE HERE>

Use the **Docs** panel on the right to explore your schema and discover available fields and queries. You can also use `Ctrl + Space` for auto-completion while typing queries.

<ADD IMAGE HERE>

---

## Exercises

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

---

### Task 1

---

### Task 2

---

### Task 3

---

### Task 4

---

### Task 5

---

## Next Class

Link to the next class: [Week 02]()
