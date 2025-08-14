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

---

## REST APIs vs. GraphQL APIs

---

## Dependencies

```bash
npm install express-graphql graphql
``` 

```js
// app.js

// Omitted for brevity

import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

// Omitted for brevity
```

---

## Mock Data Layer

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
    }
`;

const schema = buildSchema(institutionSchema);

// Omitted for brevity
```

---

## Resolvers

```js
// app.js

// Omitted for brevity

const root = {
  institutions: () => institutions,
};

// Omitted for brevity
```

---

## Middleware

```js
// app.js

// Omitted for brevity

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

// Omitted for brevity
```

---

## Formative Assessment


Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

---

### Task One


---

### Task Two


---

### Task Three


---

### Task Four


---

### Task Five

---

## Next Class

Link to the next class: [Week 02]()
