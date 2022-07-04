# 01: Refactoring

## Express

Create a new repository - <https://classroom.github.com/a/SNd5oi2t>. Remember to add the `README.md` and `.gitignore` **(Node)** files. Clone the repository. Change the directory to the repository and create a new branch called `01-playground`. Checkout to the `01-playground` branch and open the repository in **Visual Studio Code**.

Create a file called `package.json` by running the following command:

```bash
npm init
```

Also, **Express** and **DotEnv** by running the commands:

```bash
npm install express dotenv
```

In the root directory, create a new file called `.env`. In the `.env` file, add the following variables:

```bash
PORT=3000
```

You will add to the `.env` file throughout the **backend module**.

In the root directory, create a new file called `app.js`. In the `app.js` file, add the following code:

```js
import dotenv from "dotenv";
import express, { urlencoded, json } from "express";

import institutions from "./routes/institutions.js";
import departments from "./routes/departments.js";

dotenv.config();

const app = express();

const BASE_URL = "/api/v1";

const PORT = process.env.PORT;

app.use(urlencoded({ extended: false }));
app.use(json());

app.use(`${BASE_URL}/institutions`, institutions);
app.use(`${BASE_URL}/departments`, departments);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
```

It is a simple **Express** server setup but feel free to add other dependencies you learned in **ID607001: Introductory Application Development Concepts**.

## Prisma

**Prisma** is an open-source **Object-Relational Mapper (ORM)**. It enables you to interface between your database and application easily. **Prisma** supports database management systems like **SQLite**, **PostgreSQL**, **MySQL** and **Microsoft SQL Server**.   

To get started, run the following commands:

```bash
npm install @prisma/client
npm install prisma --save-dev
npx prisma init
```

### Schema

You will see a new directory called `prisma` in the root directory. In the `prisma` directory, you will see a new file called `schema.prisma`. This file tells **Prisma** how to connect to a database, generate a client and map your data from a database to your application.

Let us use the example code below. A schema is built up of three blocks - data sources, generators and models. Each block comprises a type, i.e., data source, a name, i.e., db and fields, i.e., provider and url.

In the `schema.prisma` file, add the following code:

```js
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Institution {
  id         Int          @id @default(autoincrement())
  name       String
  region     String
  country    String
  createdAt  DateTime     @default(now())
  departments Department[]
}

model Department {
  id            Int         @id @default(autoincrement())
  name          String
  institutionId Int
  createdAt     DateTime    @default(now())
  institution   Institution @relation(fields: [institutionId], references: [id])
}
```

The schema structure should look familiar from **ID607001: Introductory Application Development Concepts**.

### SQLite

You are going to use **SQLite** for the data source. The easy way to create an **SQLite** database is to download the **SQLite** command-line tool - <https://www.sqlite.com/2022/sqlite-tools-win32-x86-3390000.zip>. Run `sqlite3.exe` and run the following command:

```bash
.open dev
```

This command will create a new database file called `dev.db`. Copy and paste `dev.db` into the `prisma` directory.

### Migrations

You need to create a migration from the `prisma.schema` file and apply them to the `dev.db` file. To do this, run the following command:

```bash
npx prisma migrate dev
```

You will be prompt to enter a name for the new migration. Do not worry about this and press the <kbd>Enter</kbd> key. You will find the new migration in the `migrations` directory. Your database is in sync with your `schema.prisma` file.

## Refactoring

_Perfect code is bad_

In the root directory, create two new directories called `controllers` and `routes`. In both directories, create two new files called `institutions.js` and `departments.js`.

The following code examples should look familiar from **ID607001: Introductory Application Development Concepts**.

### controllers/institutions.js

```js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getInstitution = async (req, res) => {
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

    return res.json({ data: institution });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const getInstitutions = async (req, res) => {
  try {
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

    institution = await prisma.institution.update({
      where: { id: Number(id) },
      data: { name, region, country },
    });

    return res.json({
      msg: `Institution with the id: ${id} successfully update`,
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

### routes/institutions.js

```js
import { Router } from "express";
const router = Router();

import {
  getInstitution,
  getInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution,
} from "../controllers/institutions.js";

router.route("/").get(getInstitutions).post(createInstitution);
router
  .route("/:id")
  .get(getInstitution)
  .put(updateInstitution)
  .delete(deleteInstitution);

export default router;
```

### controllers/institutions.js

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
      data: newDepartments,
      msg: "Department successfully created",
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
      msg: `Department with the id: ${id} successfully update`,
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

### routes/departments.js

```js
import { Router } from "express";
const router = Router();

import {
  getDepartment,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departments.js";

router.route("/").get(getDepartments).post(createDepartment);
router
  .route("/:id")
  .get(getDepartment)
  .put(updateDepartment)
  .delete(deleteDepartment);

export default router;
```

As you can see, there is a lot of code duplication. In the **Formative Assessment** below, you will refactor the code examples above. 

---

## Formative Assessment

### Task One

In this task, use the code examples above. In the `controller/institutions.js` and `controller/departments.js` files, refactor the code to improve the application's maintainability and readability. I suggest creating a new file called `base.js`, which contains base functions for reading, creating, updating and deleting resources, then importing those functions and giving them the appropriate arguments. Also, look at how you could refactor lines 1 and 2 in the `controller/institutions.js` and `controller/departments.js` files.

I suggest testing your changes in **Postman** as you go. Here is a `POST` request example for the `Institution` and `Department` models:

```json
{
    "name": "Otago Polytechnic",
    "region": "Otago",
    "country": "New Zealand"
}
```

```json
{
    "name": "Information Technology",
    "institutionId": 1
}
```

### Task Two

Create a new model called `Course`. In the `Course` model, add the following fields:

- `id` of type `Int` and default value of `@id @default(autoincrement()`
- `title` of type `String`
- `code` of type `String`
- `efts` of type `Decimal`
- `points` of type `Int`
- `departmentId` of type `Int`
- `createdAt` of type `DateTime` and default value of `@default(now())`
- A reference to the `Department` model's `id`. 

**Note:** Make sure you add an array of `Course` in the `Department` model.

### Task Three

Once you have completed all three tasks, open a pull request and assign **grayson-orr** as a reviewer. Please do not merge your pull request.