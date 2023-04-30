# 01: Refactoring

## package.json

Create a file called `package.json` by running the following command:

```bash
npm init -y
```

In the `package.json` file, add the following:

```json
"type": "module"
```

---

## Dotenv

To get started with **Dotenv**, run the following command:

```bash
npm install dotenv
```

In the root directory, create a new file called `.env`. In the `.env` file, add the following variable:

```bash
PORT=3000
```

---

## Express

To get started with **Express**, run the following command:

```bash
npm install express
```

---

## app.js

In the root directory, create a new file called `app.js`. In the `app.js` file, add the following code:

```js
import dotenv from "dotenv";
import express, { urlencoded, json } from "express";

/**
 * You will create the routes for institutions and departments later
 */
import institutions from "./routes/v1/institutions.js";
import departments from "./routes/v1/departments.js";

dotenv.config();

const app = express();

const BASE_URL = "api";

/**
 * The current version of this API is 1
 */
const CURRENT_VERSION = "v1";

const PORT = process.env.PORT;

app.use(urlencoded({ extended: false }));
app.use(json());

app.use(`/${BASE_URL}/${CURRENT_VERSION}/institutions`, institutions);
app.use(`/${BASE_URL}/${CURRENT_VERSION}/departments`, departments);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
```

It is a simple **Express** server setup but feel free to add other dependencies you learned in **ID607001: Introductory Application Development Concepts/Pia o Te Taupānga Tukutuku**.

---

## Prisma

**Prisma** is an open-source **Object-Relational Mapper (ORM)**. It enables you to interface between the database and application easily. **Prisma** supports database management systems like **SQLite**, **PostgreSQL**, **MySQL** and **Microsoft SQL Server**.

To get started, run the following commands:

```bash
npm install @prisma/client
npm install prisma --save-dev
npx prisma init
```

Check the `package.json` file to ensure you have installed `@prisma/client` and `prisma`.

### Schema

You will see a new directory called `prisma` in the root directory. In the `prisma` directory, you will see a new file called `schema.prisma`. This file tells **Prisma** how to connect to a database, generate a client and map the data from a database to the application.

Let us use the example code below. A schema comprises three blocks - data sources, generators and models. Each block comprises a type, i.e., data source, a name, i.e., db and fields, i.e., provider and url.

In the `schema.prisma` file, add the following code:

```js
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider          = "postgresql"
  url               = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}

model Institution {
  id          Int          @id @default(autoincrement())
  name        String
  region      String
  country     String
  createdAt   DateTime     @default(now())
  departments Department[]
}

model Department {
  id            Int         @id @default(autoincrement())
  name          String
  institutionId Int
  createdAt     DateTime    @default(now())
  institution   Institution @relation(fields: [institutionId], references: [id], onDelete: Cascade)
}
```

The schema structure should look familiar from **ID607001: Introductory Application Development Concepts/Pia o Te Taupānga Tukutuku**.

### PostgreSQL

You are going to use **PostgreSQL** for the data source. To create a **PostgreSQL** database, walkthrough this resource - https://render.com/docs/databases

The `.env` file should look like this:

```bash
PORT=3000
DATABASE_URL=The first PostgreSQL connection string, i.e., the DATABASE_URL environment variable on Render
```

Run the following command to connect to the **PostgreSQL** database and create a migration:

```bash
npx prisma migrate dev --name init
```

### Migrations

You must create a new migration if you change the `prisma.schema` file. To create a new migration, run the following command:

```bash
npx prisma migrate reset && npx prisma migrate dev
```

You will be prompt to enter a name for the new migration. Do not worry about this and press the <kbd>Enter</kbd> key. You will find the new migration in the `migrations` directory. Have a look at the `migration.sql` file. You should see the following:

```sql
-- CreateTable
CREATE TABLE "Institution" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "institutionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

**Prisma** has created an `Institution` and `Department` table in the `dev.db` file.

---

## Refactoring

In the root directory, create two new directories called `controllers` and `routes`. In both directories, create a new directory called `v1`. In both `v1` directories, create two new files called `institutions.js` and `departments.js`.

### controllers/v1/institutions.js

In the `controllers/v1/institutions.js` file, add the following code:

```js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getInstitution = async (req, res) => {
  try {
    const { id } = req.params;

    /**
     * The findUnique function returns a single record using
     * an id or unique identifier
     */
    const institution = await prisma.institution.findUnique({
      where: { id: Number(id) },
      include: {
        departments: true,
      },
    });

    if (!institution) {
      return res
        .status(200)
        .json({ msg: `No institution with the id: ${id} found` });
    }

    return res.json({ data: institution });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const getInstitutions = async (req, res) => {
  try {
    /**
     * The findMany function returns all records
     */
    const institutions = await prisma.institution.findMany({
      include: {
        departments: true,
      },
    });

    if (institutions.length === 0) {
      return res.status(200).json({ msg: "No institutions found" });
    }

    return res.json({ data: institutions });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const createInstitution = async (req, res) => {
  try {
    const { name, region, country } = req.body;

    /**
     * The create function creates a new record using the required fields,
     * i.e., name, region and country
     */
    await prisma.institution.create({
      data: { name, region, country },
    });

    const newInstitutions = await prisma.institution.findMany({
      include: {
        departments: true,
      },
    });

    return res.status(201).json({
      msg: "Institution successfully created",
      data: newInstitutions,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const updateInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, region, country } = req.body;

    let institution = await prisma.institution.findUnique({
      where: { id: Number(id) },
    });

    if (!institution) {
      return res
        .status(200)
        .json({ msg: `No institution with the id: ${id} found` });
    }

    /**
     * The update function updates a single record using an
     * id or unique identifier
     */
    institution = await prisma.institution.update({
      where: { id: Number(id) },
      data: { name, region, country },
    });

    return res.json({
      msg: `Institution with the id: ${id} successfully updated`,
      data: institution,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const deleteInstitution = async (req, res) => {
  try {
    const { id } = req.params;

    const institution = await prisma.institution.findUnique({
      where: { id: Number(id) },
    });

    if (!institution) {
      return res
        .status(200)
        .json({ msg: `No institution with the id: ${id} found` });
    }

    /**
     * The delete function deletes a single record using an
     * id or unique identifier
     */
    await prisma.institution.delete({
      where: { id: Number(id) },
    });

    return res.json({
      msg: `Institution with the id: ${id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

export {
  getInstitution,
  getInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution,
};
```

### routes/v1/institutions.js

In the `routes/v1/institutions.js` file, add the following code:

```js
import { Router } from "express";
const router = Router();

import {
  getInstitution,
  getInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution,
} from "../../controllers/v1/institutions.js";

router.route("/").get(getInstitutions).post(createInstitution);
router
  .route("/:id")
  .get(getInstitution)
  .put(updateInstitution)
  .delete(deleteInstitution);

export default router;
```

### controllers/v1/departments.js

In the `controllers/v1/departments.js` file, add the following code:

```js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id: Number(id) },
    });

    if (!department) {
      return res
        .status(200)
        .json({ msg: `No department with the id: ${id} found` });
    }

    return res.json({ data: department });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany();

    if (departments.length === 0) {
      return res.status(200).json({ msg: "No departments found" });
    }

    return res.json({ data: departments });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { name, institutionId } = req.body;

    await prisma.department.create({
      data: { name, institutionId },
    });

    const newDepartments = await prisma.department.findMany();

    return res.status(201).json({
      msg: "Department successfully created",
      data: newDepartments,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, institutionId } = req.body;

    let department = await prisma.department.findUnique({
      where: { id: Number(id) },
    });

    if (!department) {
      return res
        .status(200)
        .json({ msg: `No department with the id: ${id} found` });
    }

    department = await prisma.department.update({
      where: { id: Number(id) },
      data: { name, institutionId },
    });

    return res.json({
      msg: `Department with the id: ${id} successfully updated`,
      data: department,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id: Number(id) },
    });

    if (!department) {
      return res
        .status(200)
        .json({ msg: `No department with the id: ${id} found` });
    }

    await prisma.department.delete({
      where: { id: Number(id) },
    });

    return res.json({
      msg: `Department with the id: ${id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

export {
  getDepartment,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
```

### routes/v1/departments.js

In the `routes/v1/departments.js` file, add the following code:

```js
import { Router } from "express";
const router = Router();

import {
  getDepartment,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../controllers/v1/departments.js";

router.route("/").get(getDepartments).post(createDepartment);
router
  .route("/:id")
  .get(getDepartment)
  .put(updateDepartment)
  .delete(deleteDepartment);

export default router;
```

The code examples above should look familiar from **ID607001: Introductory Application Development Concepts/Pia o Te Taupānga Tukutuku/Pia o Te Taupānga Tukutuku**. The syntax is different, but the logic is the same. However, as you can see, there is a lot of code duplication. You will refactor the code examples in the **Formative Assessment** below.

---

## Prisma Studio

If you want to view, create, update and delete the data easily, use **Prisma Studio**.

To get started, run the command:

```bash
npx prisma studio
```

Navigate to <http://localhost:5555>.

The screenshot below is an example of shows all the tables in the **PostgreSQL** database.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/01-refactoring/01-refactoring-7.jpeg)

The screenshot below is an example of shows all the data in the `Institutions` table.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/01-refactoring/01-refactoring-8.jpeg)

**Resource:** <https://www.prisma.io/studio>

---

## Postman

Test the changes in **Postman** before you move on to the **Formative Assessment** section.

The screenshot below is an example of a **POST** request or creating an institution.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/01-refactoring/01-refactoring-1.jpeg)

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/01-refactoring/01-refactoring-2.jpeg)

The screenshot below is an example of a **GET** request or retrieving all institutions.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/01-refactoring/01-refactoring-3.jpeg)

The screenshot below is an example of a **GET** request or retrieving one institution.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/01-refactoring/01-refactoring-4.jpeg)

The screenshot below is an example of a **PUT** request or updating an institution.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/01-refactoring/01-refactoring-5.jpeg)

The screenshot below is an example of a **DELETE** request or deleting an institution.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/01-refactoring/01-refactoring-6.jpeg)

---

# Formative Assessment

Continue working on the **formative assessments** branch.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

### Task Tahi

If you have not already, implement the code examples above before you move on to **Task Rua**.

### Task Rua

In the `controllers/v1/institutions.js` and `controllers/v1/departments.js` files, refactor the code to improve the application's maintainability and readability. I suggest creating a new file called `base.js`, which contains base functions for reading, creating, updating and deleting resources, then importing those functions and giving them the appropriate arguments. Also, look at how you could refactor lines 1 and 2 in the `controllers/v1/institutions.js` and `controllers/v1/departments.js` files. Test the changes in **Postman** before you move on to **Task Toru**.

### Task Toru

In the `package.json` file, add two scripts. The first script creates a new migration, i.e., `npx prisma migrate reset && npx prisma migrate dev` and the second script runs **Prisma Studio**, i.e., `npx prisma studio`. Test these scripts.

# Formative Assessment Submission

Create a new pull request and assign **grayson-orr** to review your submission. Please don't merge your own pull request.
