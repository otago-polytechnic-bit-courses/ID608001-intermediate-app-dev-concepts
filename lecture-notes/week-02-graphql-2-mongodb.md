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
docker run -d -p 27017:27017 --name id608001-db-dev -v mongo_data:/data/db mongo --replSet rs0 --bind_ip_all
```

```bash
DATABASE_URL="mongodb://localhost:27017/d608001-db-dev?replicaSet=rs0"
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
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}
```

---

### Database Push

```bash
npx prisma db push
```

---

### Refactor Resolvers

In `resolvers/institutionQueries.js`, update the code to the following:

```js
import prisma from "../prisma/client.js";

const institutionQueries = {
  institutions: async () => {
    return await prisma.institution.findMany();
  },
  institution: async (_, { id }) => {
    return await prisma.institution.findUnique({
      where: { id },
    });
  },
};

export default institutionQueries;
```

---

### Refactor Main File

In `app.js`, update the code to the following:

```js
// Omitted for brevity

import prisma from "./prisma/client.js";

// Omitted for brevity

app.all(
  "/graphql",
  createHandler({
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
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";

import schema from "./schema/index.js";
import resolvers from "./resolvers/index.js";
import prisma from "./prisma/client.js";

const app = express();

const PORT = process.env.PORT || 4000;

app.all(
  "/graphql",
  createHandler({
    schema,
    rootValue: resolvers,
    context: { prisma },
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

export default app;
```

---

## Mutations

---

## Input Types

---

## Validation

---
