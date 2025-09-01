# Week 02

## Previous Class

Link to the previous class: [Week 01]()

---

## Before We Start

Open your **id608001-s2-26-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-02-graphql-2-mongodb** from **week-01-github-graphql-1**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## MongoDB

---

### Docker

To run **MongoDB** in a **Docker** container, use the following command:

```bash
docker run -d -p 27017:27017 --name id608001-db-dev -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=HelloWorld123 mongo
```

---

### Prisma Schema File

In the `schema.prisma`, add the following code:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model Institution {
  id          String       @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  region      String
  country     String
  departments Department[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Department {
  id            String      @id @default(auto()) @map("_id") @db.ObjectId
  name          String
  institutionId String      @db.ObjectId
  institution   Institution @relation(fields: [institutionId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}
```

---

### Database Push

```bash
npx prisma db push
```

---

### Refactor Resolvers

In `resolvers/institutionResolvers.js`, update the code to the following:

```js
const institutionResolvers = {
  institutions: async (args, { prisma }) => {
    try {
      const institutions = await prisma.institution.findMany({
        include: {
          departments: true,
        },
      });

      if (institutions.length === 0) {
        throw new Error("No institutions found");
      }

      return institutions;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  institution: async ({ id }, { prisma }) => {
    try {
      const institution = await prisma.institution.findUnique({
        where: { id },
        include: {
          departments: true,
        },
      });

      if (!institution) {
        throw new Error(`No institution with the id: ${id} found`);
      }

      return institution;
    } catch (err) {
      throw new Error(err.message);
    }
  },
};

export default institutionResolvers;
```

In `resolvers/departmentResolvers.js`, update the code to the following:

```js
const departmentResolvers = {
  departments: async (args, { prisma }) => {
    try {
      const departments = await prisma.department.findMany({
        include: {
          institution: true,
        },
      });

      if (departments.length === 0) {
        throw new Error("No departments found");
      }

      return departments;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  department: async ({ id }, { prisma }) => {
    try {
      const department = await prisma.department.findUnique({
        where: { id },
        include: {
          institution: true,
        },
      });

      if (!department) {
        throw new Error(`No department with the id: ${id} found`);
      }

      return department;
    } catch (err) {
      throw new Error(err.message);
    }
  },
};

export default departmentResolvers;
```

---

### Refactor Main File

In `app.js`, update the code to the following:

```js
// Omitted for brevity

import prisma from "./prisma/client.js";

// Omitted for brevity

app.use(
  "/graphql",
  graphqlHTTP({
    // Omitted for brevity
    context: { prisma },
    // Omitted for brevity
  })
);

// Omitted for brevity
```

> **Note:** If you get stuck, here is the complete `app.js` file.

```js
import express from "express";
import { graphqlHTTP } from "express-graphql";

import schema from "./schema/index.js";
import resolvers from "./resolvers/index.js";

import prisma from "./prisma/client.js";

const app = express();

const PORT = process.env.PORT || 4000;

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true,
    context: { prisma },
    customFormatErrorFn: (err) => ({ message: err.message }),
  })
);

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit http://localhost:${PORT}/graphql`
  );
});

export default app;
```

---

## Mutations

---

## Input Types

---

## Validation

---
