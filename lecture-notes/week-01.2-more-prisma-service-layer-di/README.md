# Week 01.2 - More Prisma, Service Layer and Dependency Injection

## Navigation

|              | Link                                                                                                            |
| ------------ | --------------------------------------------------------------------------------------------------------------- |
| Previous     | [Week 01.1 - TypeScript](../week-01.1-typescript/README.md)                                                     |
| Code Example | [Code Example](code-example)                                                                                    |
| Next         | [Week 02.1 - Docker Compose and More GitHub Actions](../week-02.1-docker-compose-more-github-actions/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 01.2 branch:

```bash
git checkout -b w01.2-more-prisma-service-layer-di
```

---

## 1. Advanced Prisma

---

### 1.1 Transactions

A **transaction** is a set of database operations that either all succeed or all fail together. This guarantees data consistency — you never end up in a half-updated state.

Consider what happens without a transaction when creating a department and its first course:

```
1. Create department ✅
2. Create course     ❌ (fails — e.g. validation error)
```

The department now exists without a course, leaving the database in an inconsistent state. Wrapping both operations in a transaction rolls back the department creation if the course creation fails.

Use `prisma.$transaction()` to wrap multiple operations:

```typescript
import prisma from "../prisma/db.js";
import { Prisma } from "@prisma/client";

const createDepartmentWithCourse = async (
  departmentData: Prisma.DepartmentCreateInput,
  courseData: Omit<Prisma.CourseCreateInput, "department">,
) => {
  return prisma.$transaction(async (tx) => {
    const department = await tx.department.create({
      data: departmentData,
    });

    const course = await tx.course.create({
      data: {
        ...courseData,
        departmentId: department.id,
      },
    });

    return { department, course };
  });
};
```

> If any operation inside `$transaction` throws, all changes are automatically rolled back.

📖 Reference: [Prisma - Transactions](https://www.prisma.io/docs/orm/prisma-client/queries/transactions)

---

### 1.2 Interactive Transactions

Interactive transactions give you full programmatic control — you can run queries, inspect results, and decide whether to commit or roll back based on business logic:

```typescript
const transferCourse = async (
  courseId: string,
  fromDepartmentId: string,
  toDepartmentId: string,
) => {
  return prisma.$transaction(async (tx) => {
    const course = await tx.course.findUnique({
      where: { id: courseId },
    });

    if (!course || course.departmentId !== fromDepartmentId) {
      throw new Error("Course not found in source department");
    }

    return tx.course.update({
      where: { id: courseId },
      data: { departmentId: toDepartmentId },
    });
  });
};
```

The difference from a simple transaction is that you can branch on intermediate results. Throwing inside `$transaction` always triggers a rollback regardless of where the error occurred.

---

### 1.3 Prisma Middleware

Prisma supports middleware that runs before or after every query. This is useful for cross-cutting concerns like logging, soft-deletes, and audit trails — logic that should apply to every query without being repeated in every service.

```typescript
// prisma/db.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();

  console.log(
    `Query ${params.model}.${params.action} took ${after - before}ms`,
  );

  return result;
});

export default prisma;
```

`params` exposes:

| Property        | Description                                           |
| --------------- | ----------------------------------------------------- |
| `params.model`  | The Prisma model being queried (e.g. `"Institution"`) |
| `params.action` | The operation (e.g. `"findMany"`, `"create"`)         |
| `params.args`   | The query arguments — can be mutated before `next()`  |

---

### 1.4 Soft Deletes

Soft deletes mark records as deleted rather than removing them from the database. This preserves data for auditing and allows recovery.

First, add a `deletedAt` field to your model:

```prisma
model Institution {
  id          String       @id @default(uuid())
  name        String
  region      String
  country     String
  departments Department[]
  deletedAt   DateTime?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}
```

Run a migration after updating the schema:

```bash
npx prisma migrate dev --name add_deleted_at_to_institution
```

Then use Prisma middleware to intercept delete operations and update `deletedAt` instead:

```typescript
prisma.$use(async (params, next) => {
  if (params.model === "Institution") {
    if (params.action === "delete") {
      // Redirect hard delete to a soft delete
      params.action = "update";
      params.args.data = { deletedAt: new Date() };
    }

    if (params.action === "findMany" || params.action === "findUnique") {
      // Exclude soft-deleted records from all reads
      params.args.where = {
        ...params.args.where,
        deletedAt: null,
      };
    }
  }

  return next(params);
});
```

> Because the middleware intercepts at the Prisma layer, all existing `findMany` and `findUnique` calls automatically exclude soft-deleted records — no changes needed in your repositories or services.

---

### 1.5 Aggregations

Prisma supports aggregation queries for computing statistics:

```typescript
// Count all courses
const count = await prisma.course.count();

// Count courses in a specific department
const deptCount = await prisma.course.count({
  where: { departmentId: "some-department-id" },
});

// Count courses grouped by department
const byDepartment = await prisma.course.groupBy({
  by: ["departmentId"],
  _count: { id: true },
  orderBy: { _count: { id: "desc" } },
});

// Count departments grouped by institution
const byInstitution = await prisma.department.groupBy({
  by: ["institutionId"],
  _count: { id: true },
  orderBy: { _count: { id: "desc" } },
});
```

📖 Reference: [Prisma - Aggregation](https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing)

---

### 1.6 Raw Queries

Sometimes the Prisma query API cannot express what you need — complex joins, database-specific functions, or performance-tuned SQL. Prisma exposes two methods for running raw SQL directly.

| Method               | Returns                       | Use when                                     |
| -------------------- | ----------------------------- | -------------------------------------------- |
| `prisma.$queryRaw`   | Typed rows as an array        | `SELECT` statements that return data         |
| `prisma.$executeRaw` | Row count affected (`number`) | `INSERT`, `UPDATE`, `DELETE`, `CREATE INDEX` |

---

#### `$queryRaw`

Use a tagged template literal so that all interpolated values are automatically parameterised — this prevents SQL injection:

```typescript
import { Prisma, Institution } from "@prisma/client";

const country = "New Zealand";

const institutions = await prisma.$queryRaw<Institution[]>`
  SELECT * FROM "Institution"
  WHERE country = ${country}
  ORDER BY name ASC
`;
```

The type parameter (`Institution[]`) tells TypeScript what shape to expect back. Prisma does not validate this at runtime, so make sure it matches your actual columns.

For dynamic queries where you need to build the SQL string at runtime, use `Prisma.sql` to compose parameterised fragments safely:

```typescript
const column = "name";
const direction = "ASC";

const institutions = await prisma.$queryRaw<Institution[]>(
  Prisma.sql`
    SELECT * FROM "Institution"
    ORDER BY ${Prisma.raw(column)} ${Prisma.raw(direction)}
  `,
);
```

> Only use `Prisma.raw` for structural parts of the query (column names, sort direction) that cannot be parameterised. Never pass user input through `Prisma.raw`.

---

#### `$executeRaw`

Use `$executeRaw` for statements that modify data and return a row count rather than rows:

```typescript
const newCountry = "Aotearoa New Zealand";
const oldCountry = "New Zealand";

const affected = await prisma.$executeRaw`
  UPDATE "Institution"
  SET country = ${newCountry}
  WHERE country = ${oldCountry}
`;

console.log(`${affected} rows updated`);
```

---

#### Raw queries inside transactions

Both methods work inside `$transaction`, which lets you mix raw SQL with Prisma model queries atomically:

```typescript
await prisma.$transaction(async (tx) => {
  await tx.$executeRaw`
    UPDATE "Department" SET "institutionId" = ${newId} WHERE id = ${departmentId}
  `;

  await tx.auditLog.create({
    data: { model: "Department", action: "UPDATE", recordId: departmentId },
  });
});
```

📖 Reference: [Prisma - Raw queries](https://www.prisma.io/docs/orm/prisma-client/queries/raw-database-access/raw-queries)

---

## 2. Service Layer

In the N-Layer architecture introduced in ID607001, we had Controllers and Repositories. The **Service Layer** sits between them and owns all business logic.

| Layer            | Components          | Responsibility                                |
| ---------------- | ------------------- | --------------------------------------------- |
| **Presentation** | Controllers, Routes | Handle HTTP; validate input; format responses |
| **Application**  | **Services**        | Business logic; orchestrate repositories      |
| **Data**         | Repositories        | Database access only                          |

---

### 2.1 Why a Service Layer?

Without a service layer, business logic leaks into controllers. Controllers become difficult to test because they are tightly coupled to HTTP. Consider this controller without a service layer:

```typescript
// Without a service layer — business logic in the controller
const getInstitution = async (req: Request, res: Response) => {
  const institution = await prisma.institution.findUnique({
    where: { id: req.params.id },
  });

  if (!institution) {
    return res.status(404).json({ message: "Not found" });
  }

  return res.status(200).json({ data: institution });
};
```

To test the "not found" path, you need to make an HTTP request with a non-existent ID. With a service layer, that logic becomes a plain function you can call directly in a unit test.

Moving logic into services means:

- Business logic can be tested without HTTP
- Logic can be reused across multiple controllers or entry points
- Controllers stay thin and focused on HTTP concerns

---

### 2.2 Custom Error Classes

Define custom error classes so that services can throw meaningful errors that controllers can catch and translate into HTTP responses:

```typescript
// src/errors/index.ts

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
  }
}
```

Using named error classes instead of plain `new Error()` lets you distinguish error types with `instanceof` checks in controllers and error handlers.

---

### 2.3 Institution Service

Create `src/services/institution.ts`:

```typescript
import institutionRepository from "../repositories/institution.js";
import { Institution, Prisma } from "@prisma/client";
import { NotFoundError } from "../errors/index.js";

class InstitutionService {
  async create(data: Prisma.InstitutionCreateInput): Promise<Institution[]> {
    await institutionRepository.create(data);
    return institutionRepository.findAll();
  }

  async getAll(): Promise<Institution[]> {
    const institutions = await institutionRepository.findAll();

    if (institutions.length === 0) {
      throw new NotFoundError("No institutions found");
    }

    return institutions;
  }

  async getById(id: string): Promise<Institution> {
    const institution = await institutionRepository.findById(id);

    if (!institution) {
      throw new NotFoundError(`No institution with the id: ${id} found`);
    }

    return institution;
  }

  async update(
    id: string,
    data: Prisma.InstitutionUpdateInput,
  ): Promise<Institution> {
    await this.getById(id); // Throws NotFoundError if not found
    return institutionRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id); // Throws NotFoundError if not found
    await institutionRepository.delete(id);
  }
}

export default new InstitutionService();
```

Notice that `update` and `delete` reuse `getById` — this avoids duplicating the existence check and ensures the same error message is thrown in all cases.

---

### 2.4 Updated Institution Controller

Controllers now catch typed errors and map them to HTTP status codes:

```typescript
// src/controllers/institution.ts
import { Request, Response } from "express";
import institutionService from "../services/institution.js";
import { NotFoundError, ConflictError } from "../errors/index.js";

const createInstitution = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, region, country } = req.body;
    const institutions = await institutionService.create({
      name,
      region,
      country,
    });
    res.status(201).json({
      message: "Institution successfully created",
      data: institutions,
    });
  } catch (err) {
    if (err instanceof ConflictError) {
      res.status(409).json({ message: err.message });
    } else {
      res.status(500).json({ message: (err as Error).message });
    }
  }
};

const getInstitutions = async (req: Request, res: Response): Promise<void> => {
  try {
    const institutions = await institutionService.getAll();
    res.status(200).json({ data: institutions });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: (err as Error).message });
    }
  }
};

const getInstitution = async (req: Request, res: Response): Promise<void> => {
  try {
    const institution = await institutionService.getById(req.params.id);
    res.status(200).json({ data: institution });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: (err as Error).message });
    }
  }
};

const updateInstitution = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const institution = await institutionService.update(
      req.params.id,
      req.body,
    );
    res.status(200).json({
      message: `Institution with the id: ${req.params.id} successfully updated`,
      data: institution,
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: (err as Error).message });
    }
  }
};

const deleteInstitution = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await institutionService.delete(req.params.id);
    res.status(200).json({
      message: `Institution with the id: ${req.params.id} successfully deleted`,
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: (err as Error).message });
    }
  }
};

export {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
};
```

---

### 2.5 Global Error Handler

Rather than duplicating `catch` logic in every controller, register a global error-handling middleware in `app.ts`. Express identifies error-handling middleware by its four parameters — the first being `err`:

```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import {
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
} from "../errors/index.js";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof NotFoundError) {
    res.status(404).json({ message: err.message });
  } else if (err instanceof ConflictError) {
    res.status(409).json({ message: err.message });
  } else if (err instanceof UnauthorizedError) {
    res.status(401).json({ message: err.message });
  } else if (err instanceof ForbiddenError) {
    res.status(403).json({ message: err.message });
  } else {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default errorHandler;
```

Register it in `app.ts` **after** all routes:

```typescript
import errorHandler from "./middleware/errorHandler.js";

app.use("/api/institutions", institutionRoutes);

// Error handler must be the last middleware registered
app.use(errorHandler);
```

With a global error handler in place, controllers can use `next(err)` instead of duplicating `if/else` blocks:

```typescript
// src/controllers/institution.ts
import { Request, Response, NextFunction } from "express";

const getInstitution = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const institution = await institutionService.getById(req.params.id);
    res.status(200).json({ data: institution });
  } catch (err) {
    next(err); // Delegates to the global error handler
  }
};
```

> The global error handler approach is preferred in production because adding a new error type only requires updating one file rather than every controller.

---

## 3. Dependency Injection

**Dependency Injection (DI)** is a design pattern where dependencies are passed into a class rather than created inside it. This makes code easier to test and decouples components from their concrete implementations.

---

### 3.1 The Problem Without DI

```typescript
// Without DI — InstitutionService creates its own dependency
class InstitutionService {
  private repository = new InstitutionRepository(); // Tightly coupled

  async getAll() {
    return this.repository.findAll();
  }
}
```

This is hard to test because you cannot substitute a mock repository. Any test of `InstitutionService.getAll` will always hit the real database.

---

### 3.2 Constructor Injection

Pass the dependency in via the constructor. Depend on an interface, not the concrete class:

```typescript
// src/repositories/interfaces.ts
import { Institution, Prisma } from "@prisma/client";

interface IInstitutionRepository {
  create(data: Prisma.InstitutionCreateInput): Promise<Institution>;
  findAll(): Promise<Institution[]>;
  findById(id: string): Promise<Institution | null>;
  update(id: string, data: Prisma.InstitutionUpdateInput): Promise<Institution>;
  delete(id: string): Promise<Institution>;
}

export type { IInstitutionRepository };
```

```typescript
// src/services/institution.ts
import { IInstitutionRepository } from "../repositories/interfaces.js";
import { Institution, Prisma } from "@prisma/client";
import { NotFoundError } from "../errors/index.js";

class InstitutionService {
  constructor(private readonly repository: IInstitutionRepository) {}

  async getAll(): Promise<Institution[]> {
    const institutions = await this.repository.findAll();

    if (institutions.length === 0) {
      throw new NotFoundError("No institutions found");
    }

    return institutions;
  }

  async getById(id: string): Promise<Institution> {
    const institution = await this.repository.findById(id);

    if (!institution) {
      throw new NotFoundError(`No institution with the id: ${id} found`);
    }

    return institution;
  }

  async update(
    id: string,
    data: Prisma.InstitutionUpdateInput,
  ): Promise<Institution> {
    await this.getById(id);
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.repository.delete(id);
  }
}

export { InstitutionService };
```

Wire up the concrete implementation at the composition root — the single place where the application is assembled:

```typescript
// src/services/index.ts
import institutionRepository from "../repositories/institution.js";
import { InstitutionService } from "./institution.js";

export default new InstitutionService(institutionRepository);
```

---

### 3.3 Benefits for Testing

With DI, tests can inject a mock repository that returns controlled data without touching a real database:

```typescript
import { expect } from "chai";
import { InstitutionService } from "../services/institution.js";
import { IInstitutionRepository } from "../repositories/interfaces.js";
import { NotFoundError } from "../errors/index.js";
import { Institution } from "@prisma/client";

const mockRepository: IInstitutionRepository = {
  create: async (data) =>
    ({
      id: "1",
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }) as Institution,
  findAll: async () => [],
  findById: async () => null,
  update: async (id, data) => ({ id, ...data }) as Institution,
  delete: async (id) => ({ id }) as Institution,
};

describe("InstitutionService.getAll", () => {
  it("should throw NotFoundError when no institutions exist", async () => {
    const service = new InstitutionService(mockRepository);

    try {
      await service.getAll();
      expect.fail("Expected NotFoundError to be thrown");
    } catch (err) {
      expect(err).to.be.instanceOf(NotFoundError);
    }
  });
});
```

The mock returns an empty array from `findAll`, simulating the "no institutions" case without needing a database connection at all.

---

## Exercises

### AI Usage Guidelines

Acknowledge AI usage at the top of any AI-assisted file:

```typescript
/**
 * @fileoverview Brief description of what this file does
 * @ai-assisted This file was developed with assistance from [AI Tool Name]
 * @prompts
 * - "Your first prompt here"
 * - "Your second prompt here"
 * @usage Describe how you used the AI responses to help you with your work
 */
```

---

### Task 1 - Implement the Code Examples

Implement the service layer, custom error classes, and global error handler for the `Institution` resource.

---

### Task 2 - Service Layer for All Resources

Create service classes for `Department`, `Course`, and `User`, moving all business logic out of the controllers. Note that `DepartmentService.create` should verify the `Institution` exists before creating the department, and `CourseService.create` should verify the `Department` exists before creating the course.

---

### Task 3 - Repository Interfaces

Define TypeScript interfaces for all repositories (`IInstitutionRepository`, `IDepartmentRepository`, `ICourseRepository`) and update your service constructors to depend on the interfaces rather than the concrete implementations.

---

### Task 4 - Transaction - Department with Course

Implement a `POST /api/departments/with-course` endpoint that uses a Prisma transaction to create a `Department` and an initial `Course` atomically. If course creation fails, the department should not be created.

---

### Task 5 - Audit Log with Prisma Middleware

Add a Prisma middleware that logs every `create`, `update`, and `delete` operation to an `AuditLog` model. The log should record the model name, action, and timestamp.

---

### Task 6 - Raw Query Endpoint

Add a `GET /api/institutions/search` endpoint that uses `$queryRaw` to query the `Institution` table directly. The endpoint should accept a `q` query parameter and return all institutions where the name matches using a raw `ILIKE` query.

---

### Task 7 - Unit Tests for Services

Write unit tests for `InstitutionService` using mock repositories. Cover the `getAll` (empty), `getById` (found and not found), `create`, `update`, and `delete` methods.

---

## README

Update the `README.md` to document the updated architecture and the new service layer.
