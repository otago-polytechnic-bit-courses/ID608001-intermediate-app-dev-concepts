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

---

### REST APIs vs. GraphQL APIs

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
    country
  }
}
```

---

### Dependencies

To get started with **GraphQL** in your **Express** application, you need to install the following dependencies:

```bash
npm install graphql graphql-http ruru
```

In `app.js`, add the following imports.

```js
import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";
```

---

### Mock Data Layer

In the root directory, create a new directory called `data`. In the `data` directory, create a new file called `institutions.js`.

In `institutions.js`, add the following code:

```js
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

export default institutions;
```

---

### Schemas

In the root directory, create a new directory called `schema`. In the `schema` directory, create two new files called `typeDefs.js` and `index.js`.

In `typeDefs.js`, add the following code:

```js
const typeDefs = `
  type Institution {
    id: ID!
    name: String!
    region: String!
    country: String!
  }

  type Query {
    institutions: [Institution!]!
    institution(id: ID!): Institution
  }
`;

export default typeDefs;
```

In `index.js`, add the following code:

```js
import { buildSchema } from "graphql";

import typeDefs from "./typeDefs.js";

const schema = buildSchema(typeDefs);

export default schema;
```

---

### Resolvers

In the root directory, create a new directory called `resolvers`. In the `resolvers` directory, create two new files called `institutionQueries.js` and `index.js`

In `institutionQueries.js`, add the following code:

```js
import institutions from "../data/institutions.js";

const institutionQueries = {
  institutions: () => institutions,
  institution: ({ id }) => institutions.find((inst) => inst.id === Number(id)),
};

export default institutionQueries;
```

In `index.js`, add the following code:

```js
import institutionQueries from "./institutionQueries.js";

const resolvers = {
  ...institutionQueries,
};

export default resolvers;
```

---

### Middleware

In `app.js`, add the following code:

```js
// Omitted for brevity

import schema from "./schema/index.js";
import resolvers from "./resolvers/index.js";

const app = express();

const PORT = process.env.PORT || 4000;

app.all(
  "/graphql",
  createHandler({
    schema,
    rootValue: resolvers,
    formatError: (err) => ({ message: err.message }),
  })
);

app.get("/", (req, res) => {
  res.send(ruruHTML({ endpoint: "/graphql" }));
});

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit http://localhost:${PORT}`
  );
});
```

---

## GraphiQL

---

### Testing

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

Here is an example of a query to get an institution by ID:

```graphql
{
  institution(id: 1) {
    name
    region
    country
  }
}
```

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
