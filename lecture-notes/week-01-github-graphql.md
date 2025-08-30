# Week 01

## GitHub

This course will use **GitHub** and **GitHub Classroom** to manage our development. Begin by clicking this link <>. You will be prompted to accept an assignment. Click on the **Accept this assignment** button. **GitHub Classroom** will create a new repository. You will use this repository to submit your formative (non-graded) and summative (graded) assessments.

## Before We Start

Open your **id608001-s2-26-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-01-formative-assessment**.

In the **lecture-notes** directory, you have been given an **Express** application called `week-01-github-graphql`. Copy and paste the application into your **id608001-s2-26-GitHub username** repository.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Full Code Example

The full code example for this week is available here - <>

---

## GraphQL

**GraphQL** is a query language for APIs and a runtime for executing those queries by using a type system you define for your data. It provides a more efficient, flexible, and powerful alternative to **REST**.

**Key benefits of GraphQL:**
- **Precise data fetching** - Request only the fields you need
- **Single endpoint** - All operations go through one URL
- **Strong type system** - Schema defines the structure of your API
- **Real-time subscriptions** - Built-in support for live data updates
- **Introspection** - Schema is self-documenting and explorable

---

## REST APIs vs. GraphQL APIs

| Feature         | REST API                            | GraphQL API                        |
| --------------- | ----------------------------------- | ---------------------------------- |
| Data Fetching   | Multiple endpoints                  | Single endpoint                    |
| Response Format | Fixed structure                     | Flexible structure                 |
| Over-fetching   | Common (fetches unnecessary data)   | Avoided (fetches only needed data) |
| Under-fetching  | Possible (multiple requests needed) | Avoided (single request for all)   |
| Versioning      | Requires versioning                 | No versioning needed               |
| Tooling         | Mature tooling available            | Emerging tooling                   |
| Caching         | HTTP caching works naturally        | Requires custom caching strategies |
| Learning Curve  | Familiar to most developers         | Requires learning query syntax     |

Here is a REST API example:

```bash
GET /api/institutions
GET /api/institutions/1
GET /api/institutions/1/courses
```

Here is a GraphQL API example:

```graphql
{
  institution(id: 1) {
    id
    name
    region
    courses {
      title
      credits
    }
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

> **Note:** This is a mock data layer for demonstration purposes only. We will replace this with MongoDB in later weeks.

---

## Schemas

In **GraphQL**, a schema defines the structure of your API, including the types of data that can be queried and the relationships between them. It serves as a contract between the client and the server, ensuring that both sides understand the shape of the data being exchanged.

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

> **Note:** The exclamation mark (`!`) indicates that a field is non-nullable, meaning it must always return a value. Square brackets (`[]`) indicate an array/list of items.

---

## Resolvers

A **resolver** is a function that resolves a value for a type or field in your schema. Resolvers are responsible for fetching the data for a specific field in response to a query.

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

> **Note:** The `parseInt(id)` converts the string ID from GraphQL to a number for comparison with our mock data.

---

## Middleware

Unlike **REST**, **GraphQL** does not require separate endpoints for each resource. Instead, you can define a single endpoint that handles all queries and mutations.

```js
// app.js

// Omitted for brevity

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: institutionResolvers,
    graphiql: true,
  })
);

// Omitted for brevity
```

---

## Error Handling

**GraphQL** handles errors differently from **REST APIs**. Instead of HTTP status codes, GraphQL returns errors in the response along with any successfully resolved data.

```js
// Example resolver with error handling
const institutionResolvers = {
  institution: ({ id }) => {
    const institution = institutions.find((inst) => inst.id === parseInt(id));
    if (!institution) {
      throw new Error(`Institution with id ${id} not found`);
    }
    return institution;
  },
};
```

When you query for a non-existent institution, **GraphQL** will return:

```json
{
  "data": {
    "institution": null
  },
  "errors": [
    {
      "message": "Institution with id 999 not found"
    }
  ]
}
```

This approach allows partial success. Other fields in your query can still return data even if one field fails.

---

## GraphiQL

**GraphiQL** is an interactive, in-browser **IDE** designed for exploring and testing **GraphQL** APIs. It provides a user-friendly interface to write, validate, and execute **GraphQL** queries with features like syntax highlighting, auto-completion and real-time error detection.

---

### Testing

To access **GraphiQL**, open your web browser and navigate to `http://localhost:4000/graphql`. It will load the **GraphiQL** interface where you can interact directly with your **GraphQL** API.

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