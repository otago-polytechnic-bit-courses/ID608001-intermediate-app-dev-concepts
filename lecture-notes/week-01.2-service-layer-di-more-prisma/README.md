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

## 1. Service Layer

In the N-Layer architecture introduced in ID607001, we had Controllers and Repositories. The **Service Layer** sits between them and owns all business logic.

| Layer            | Components          | Responsibility                                |
| ---------------- | ------------------- | --------------------------------------------- |
| **Presentation** | Controllers, Routes | Handle HTTP; validate input; format responses |
| **Application**  | **Services**        | Business logic; orchestrate repositories      |
| **Data**         | Repositories        | Database access only                          |

---

### 1.1 Why a Service Layer?

Without a service layer, business logic leaks into controllers. Controllers become difficult to test because they are tightly coupled to HTTP. Consider this controller without a service layer:

```typescript
// Without a service layer — business logic in the controller
const getInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const institution = await institutionRepository.findById(id);
    if (!institution) {
      return res.status(404).json({
        message: `No institution with the id: ${id} found`,
      });
    }
    return res.status(200).json({
      data: institution,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
```

To test the "not found" path, you need to make an HTTP request with a non-existent ID. With a service layer, that logic becomes a plain function you can call directly in a unit test.

Moving logic into services means:

- Business logic can be tested without HTTP
- Logic can be reused across multiple controllers or entry points
- Controllers stay thin and focused on HTTP concerns

---

### 1.2 Custom Error Classes

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

Using named error classes instead of plain `new Error()` lets you distinguish error types with `instanceof` checks in the global error handler.

---

### 1.3 Institution Service

The service sits between the repository and the controller. It owns business logic — existence checks, error throwing, filter validation — and calls the repository for data access.

Because `findAll` returns `PaginationResult<Institution>`, the service passes the full result (`.data` and `.pagination`) back to the controller rather than unwrapping it:

```typescript
// src/services/institution.ts
import institutionRepository from "../repositories/institution.js";
import { Institution, Prisma } from "@prisma/client";
import { PaginationResult } from "../types/pagination.js";
import { NotFoundError } from "../errors/index.js";

class InstitutionService {
  async create(data: Prisma.InstitutionCreateInput): Promise<Institution[]> {
    await institutionRepository.create(data);
    const result = await institutionRepository.findAll();
    return result.data;
  }

  async getAll(
    filters: Record<string, string> = {},
    sortBy: string = "id",
    sortOrder: string = "asc",
    page: string = "1",
    pageSize: string = "10",
  ): Promise<PaginationResult<Institution>> {
    const result = await institutionRepository.findAll(
      filters,
      sortBy,
      sortOrder,
      page,
      pageSize,
    );

    if (result.data.length === 0) {
      throw new NotFoundError("No institutions found");
    }

    return result;
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

---

### 1.4 Institution Controller

The controller imports the service, extracts query parameters, and delegates all logic. It no longer calls the repository directly or checks for existence itself — those responsibilities now belong to the service:

```typescript
// src/controllers/institution.ts
import { Request, Response, NextFunction } from "express";

import institutionService from "../services/institution.js";

import {
  InstitutionParams,
  CreateInstitutionBody,
  UpdateInstitutionBody,
} from "../types/institution.js";

const createInstitution = async (
  req: Request<{}, {}, CreateInstitutionBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, region, country } = req.body;
    const institutions = await institutionService.create({ name, region, country });
    res.status(201).json({
      message: "Institution successfully created",
      data: institutions,
    });
  } catch (err) {
    next(err);
  }
};

const getInstitutions = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      name,
      region,
      country,
      sortBy = "id",
      sortOrder = "asc",
      page = "1",
      pageSize = "10",
    } = req.query as Record<string, string>;

    const filters: Record<string, string> = {};
    if (name) filters.name = name;
    if (region) filters.region = region;
    if (country) filters.country = country;

    const validSortOrders = ["asc", "desc"];
    const order = validSortOrders.includes(sortOrder.toLowerCase())
      ? sortOrder.toLowerCase()
      : "asc";

    const validSortFields = ["id", "name", "region", "country"];
    const fields = validSortFields.includes(sortBy.toLowerCase())
      ? sortBy.toLowerCase()
      : "id";

    const result = await institutionService.getAll(
      filters,
      fields,
      order,
      page,
      pageSize,
    );

    res.status(200).json({
      data: result.data,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};

const getInstitution = async (
  req: Request<InstitutionParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const institution = await institutionService.getById(req.params.id);
    res.status(200).json({ data: institution });
  } catch (err) {
    next(err);
  }
};

const updateInstitution = async (
  req: Request<InstitutionParams, {}, UpdateInstitutionBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, region, country } = req.body;
    const institution = await institutionService.update(req.params.id, {
      name,
      region,
      country,
    });
    res.status(200).json({
      message: `Institution with the id: ${req.params.id} successfully updated`,
      data: institution,
    });
  } catch (err) {
    next(err);
  }
};

const deleteInstitution = async (
  req: Request<InstitutionParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await institutionService.delete(req.params.id);
    res.status(200).json({
      message: `Institution with the id: ${req.params.id} successfully deleted`,
    });
  } catch (err) {
    next(err);
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

### 1.5 Global Error Handler

Register a global error-handling middleware in `app.ts`. Express identifies error-handling middleware by its four parameters — the first being `err`. It maps each custom error class to an HTTP status code:

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
// src/app.ts
import express from "express";
import cors from "cors";
import compression from "compression";

import institutionRoutes from "./routes/institution.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/institutions", institutionRoutes);

// Must be last — catches anything passed to next(err)
app.use(errorHandler);

export default app;
```

The full request flow for a missing institution is:

```
GET /api/institutions/bad-id
  → controller calls institutionService.getById("bad-id")
  → service calls institutionRepository.findById("bad-id") → null
  → service throws NotFoundError("No institution with the id: bad-id found")
  → controller catch block calls next(err)
  → errorHandler receives err, sees instanceof NotFoundError
  → responds 404 { message: "No institution with the id: bad-id found" }
```

---

## 2. Dependency Injection

**Dependency Injection (DI)** is a design pattern where dependencies are passed into a class rather than created inside it. This makes code easier to test and decouples components from their concrete implementations.

---

### 2.1 The Problem Without DI

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

### 2.2 Constructor Injection

Pass the dependency in via the constructor. Depend on an interface, not the concrete class.

The interface must reflect the paginated `findAll` signature from the repository:

```typescript
// src/repositories/interfaces.ts
import { Institution, Prisma } from "@prisma/client";
import { PaginationResult } from "../types/pagination.js";

interface IInstitutionRepository {
  create(data: Prisma.InstitutionCreateInput): Promise<Institution>;
  findAll(
    filters?: Record<string, string>,
    sortBy?: string,
    sortOrder?: string,
    page?: string,
    pageSize?: string,
  ): Promise<PaginationResult<Institution>>;
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
import { PaginationResult } from "../types/pagination.js";
import { NotFoundError } from "../errors/index.js";

class InstitutionService {
  constructor(private readonly repository: IInstitutionRepository) {}

  async create(data: Prisma.InstitutionCreateInput): Promise<Institution[]> {
    await this.repository.create(data);
    const result = await this.repository.findAll();
    return result.data;
  }

  async getAll(
    filters: Record<string, string> = {},
    sortBy: string = "id",
    sortOrder: string = "asc",
    page: string = "1",
    pageSize: string = "10",
  ): Promise<PaginationResult<Institution>> {
    const result = await this.repository.findAll(
      filters,
      sortBy,
      sortOrder,
      page,
      pageSize,
    );

    if (result.data.length === 0) {
      throw new NotFoundError("No institutions found");
    }

    return result;
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

Wire up the concrete implementation at the composition root:

```typescript
// src/services/index.ts
import institutionRepository from "../repositories/institution.js";
import { InstitutionService } from "./institution.js";

export default new InstitutionService(institutionRepository);
```

The controller imports from `src/services/index.ts`, not directly from `src/services/institution.ts`:

```typescript
// src/controllers/institution.ts
import institutionService from "../services/index.js";
```

---

### 2.3 Benefits for Testing

With DI, tests inject a mock repository that returns controlled data without touching the database. The mock must satisfy the full `IInstitutionRepository` interface including the paginated `findAll` signature:

```typescript
// tests/unit/services/institution.test.ts
import { expect } from "chai";
import { InstitutionService } from "../../../src/services/institution.js";
import { IInstitutionRepository } from "../../../src/repositories/interfaces.js";
import { NotFoundError } from "../../../src/errors/index.js";
import { Institution } from "@prisma/client";

const emptyPaginationResult = {
  data: [],
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    nextPage: null,
    prevPage: null,
  },
};

const mockRepository: IInstitutionRepository = {
  create: async (data) =>
    ({ id: "1", ...data, createdAt: new Date(), updatedAt: new Date() }) as Institution,
  findAll: async () => emptyPaginationResult,
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

---

## 3. Advanced Prisma

With the service layer and DI pattern established, the following Prisma features slot naturally into the correct layer — transactions and raw queries in the repository, business rules in the service, HTTP responses in the controller.

---

### 3.1 Transactions

A **transaction** is a set of database operations that either all succeed or all fail together. This guarantees data consistency — you never end up in a half-updated state.

Consider what happens without a transaction when creating a department and its first course:

```
1. Create department ✅
2. Create course     ❌ (fails — e.g. validation error)
```

The department now exists without a course, leaving the database in an inconsistent state. Wrapping both operations in a transaction rolls back the department creation if the course creation fails.

The transaction lives in the repository, called by the service, then the controller handling `POST /api/departments/with-course`:

```typescript
// src/repositories/department.ts
import prisma from "../../prisma/db.js";
import { Prisma, Department, Course } from "@prisma/client";

class DepartmentRepository {
  async createWithCourse(
    departmentData: Prisma.DepartmentCreateInput,
    courseData: Omit<Prisma.CourseCreateInput, "department">,
  ): Promise<{ department: Department; course: Course }> {
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
  }
}

export default new DepartmentRepository();
```

```typescript
// src/services/department.ts
import departmentRepository from "../repositories/department.js";
import { Prisma, Department, Course } from "@prisma/client";

class DepartmentService {
  async createWithCourse(
    departmentData: Prisma.DepartmentCreateInput,
    courseData: Omit<Prisma.CourseCreateInput, "department">,
  ): Promise<{ department: Department; course: Course }> {
    return departmentRepository.createWithCourse(departmentData, courseData);
  }
}

export default new DepartmentService();
```

```typescript
// src/controllers/department.ts
import { Request, Response, NextFunction } from "express";
import departmentService from "../services/department.js";

const createDepartmentWithCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { department, course } = await departmentService.createWithCourse(
      req.body.department,
      req.body.course,
    );
    res.status(201).json({
      message: "Department and course successfully created",
      data: { department, course },
    });
  } catch (err) {
    next(err);
  }
};

export { createDepartmentWithCourse };
```

```typescript
// src/routes/department.ts
import express from "express";
import { createDepartmentWithCourse } from "../controllers/department.js";

const router = express.Router();

router.post("/with-course", createDepartmentWithCourse);

export default router;
```

> If any operation inside `$transaction` throws, all changes are automatically rolled back.

📖 Reference: [Prisma - Transactions](https://www.prisma.io/docs/orm/prisma-client/queries/transactions)

---

### 3.2 Interactive Transactions

Interactive transactions give you full programmatic control — you can run queries, inspect results, and decide whether to commit or roll back based on business logic.

This example implements a course transfer between departments, wired to `PUT /api/courses/:id/transfer`:

```typescript
// src/repositories/course.ts
import prisma from "../../prisma/db.js";
import { Course } from "@prisma/client";

class CourseRepository {
  async transfer(
    courseId: string,
    fromDepartmentId: string,
    toDepartmentId: string,
  ): Promise<Course> {
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
  }
}

export default new CourseRepository();
```

```typescript
// src/services/course.ts
import courseRepository from "../repositories/course.js";
import { Course } from "@prisma/client";

class CourseService {
  async transfer(
    courseId: string,
    fromDepartmentId: string,
    toDepartmentId: string,
  ): Promise<Course> {
    return courseRepository.transfer(courseId, fromDepartmentId, toDepartmentId);
  }
}

export default new CourseService();
```

```typescript
// src/controllers/course.ts
import { Request, Response, NextFunction } from "express";
import courseService from "../services/course.js";

const transferCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { fromDepartmentId, toDepartmentId } = req.body;

    const course = await courseService.transfer(
      id,
      fromDepartmentId,
      toDepartmentId,
    );

    res.status(200).json({
      message: "Course successfully transferred",
      data: course,
    });
  } catch (err) {
    next(err);
  }
};

export { transferCourse };
```

```typescript
// src/routes/course.ts
import express from "express";
import { transferCourse } from "../controllers/course.js";

const router = express.Router();

router.put("/:id/transfer", transferCourse);

export default router;
```

The difference from a simple transaction is that you can branch on intermediate results — here, the course is fetched and inspected before deciding whether to proceed. Throwing inside `$transaction` always triggers a rollback regardless of where the error occurred.

---

### 3.3 Prisma Client Extensions

Prisma 6 uses **Client Extensions** (`$extends`) to intercept queries for cross-cutting concerns like logging, soft-deletes, and audit trails. This replaces the `$use` middleware API from earlier versions.

`$extends` returns a **new extended client** rather than mutating the existing one, so you chain it directly onto `new PrismaClient()` and export the result. Every repository in the application imports from this file:

```typescript
// prisma/db.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient().$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const before = Date.now();
        const result = await query(args);
        const after = Date.now();

        console.log(`Query ${model}.${operation} took ${after - before}ms`);

        return result;
      },
    },
  },
});

export default prisma;
```

The extension callback receives:

| Property    | Description                                                          |
| ----------- | -------------------------------------------------------------------- |
| `model`     | The Prisma model being queried (e.g. `"Institution"`)                |
| `operation` | The operation (e.g. `"findMany"`, `"create"`)                        |
| `args`      | The query arguments — can be mutated before `query()`                |
| `query`     | Calls the next layer — equivalent to `next()` in the old `$use` API |

---

### 3.4 Soft Deletes

Soft deletes mark records as deleted rather than removing them from the database. This preserves data for auditing and allows recovery.

First, add a `deletedAt` field to your model:

```prisma
// prisma/schema.prisma
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

Then add soft delete behaviour to `prisma/db.ts`, combined with the query logging from section 3.3:

```typescript
// prisma/db.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient().$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const before = Date.now();
        const result = await query(args);
        const after = Date.now();

        console.log(`Query ${model}.${operation} took ${after - before}ms`);

        return result;
      },
    },
    institution: {
      async delete({ args, query }) {
        // Redirect hard delete to a soft delete
        return (prisma as any).institution.update({
          where: args.where,
          data: { deletedAt: new Date() },
        });
      },
      async findMany({ args, query }) {
        // Exclude soft-deleted records from all list queries
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
      async findUnique({ args, query }) {
        // Exclude soft-deleted records from single-record lookups
        args.where = { ...args.where, deletedAt: null } as typeof args.where;
        return query(args);
      },
    },
  },
});

export default prisma;
```

Because the extension intercepts at the Prisma layer, the repository's existing `findAll`, `findById`, and `delete` calls are all handled transparently — no changes needed in `src/repositories/institution.ts`.

---

### 3.5 Aggregations

Prisma supports aggregation queries for computing statistics. These belong in the repository, called by the service, then the controller handling `GET /api/institutions/stats`:

```typescript
// src/repositories/institution.ts
class InstitutionRepository {
  // ... existing methods

  async countAll(): Promise<number> {
    return prisma.institution.count();
  }

  async countByCountry(): Promise<{ country: string; _count: { id: number } }[]> {
    return prisma.institution.groupBy({
      by: ["country"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });
  }
}
```

```typescript
// src/services/institution.ts
class InstitutionService {
  // ... existing methods

  async getStats(): Promise<{ total: number; byCountry: object[] }> {
    const total = await institutionRepository.countAll();
    const byCountry = await institutionRepository.countByCountry();
    return { total, byCountry };
  }
}
```

```typescript
// src/controllers/institution.ts
const getInstitutionStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const stats = await institutionService.getStats();
    res.status(200).json({ data: stats });
  } catch (err) {
    next(err);
  }
};

export { getInstitutionStats };
```

```typescript
// src/routes/institution.ts
router.get("/stats", getInstitutionStats);
```

📖 Reference: [Prisma - Aggregation](https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing)

---

### 3.6 Raw Queries

Sometimes the Prisma query API cannot express what you need — complex joins, database-specific functions, or performance-tuned SQL. Prisma exposes two methods for running raw SQL directly.

| Method               | Returns                       | Use when                                     |
| -------------------- | ----------------------------- | -------------------------------------------- |
| `prisma.$queryRaw`   | Typed rows as an array        | `SELECT` statements that return data         |
| `prisma.$executeRaw` | Row count affected (`number`) | `INSERT`, `UPDATE`, `DELETE`, `CREATE INDEX` |

---

#### `$queryRaw`

Raw SELECT queries belong in the repository. Use a tagged template literal so that all interpolated values are automatically parameterised — this prevents SQL injection. Wired to `GET /api/institutions/search?q=otago`:

```typescript
// src/repositories/institution.ts
import { Prisma, Institution } from "@prisma/client";

class InstitutionRepository {
  // ... existing methods

  async searchByName(query: string): Promise<Institution[]> {
    return prisma.$queryRaw<Institution[]>`
      SELECT * FROM "Institution"
      WHERE name ILIKE ${"%" + query + "%"}
      AND "deletedAt" IS NULL
      ORDER BY name ASC
    `;
  }
}
```

```typescript
// src/services/institution.ts
class InstitutionService {
  // ... existing methods

  async search(query: string): Promise<Institution[]> {
    const results = await institutionRepository.searchByName(query);
    if (results.length === 0) {
      throw new NotFoundError("No institutions matched the search query");
    }
    return results;
  }
}
```

```typescript
// src/controllers/institution.ts
const searchInstitutions = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { q } = req.query as { q: string };
    const results = await institutionService.search(q);
    res.status(200).json({ data: results });
  } catch (err) {
    next(err);
  }
};

export { searchInstitutions };
```

```typescript
// src/routes/institution.ts
router.get("/search", searchInstitutions);
```

For dynamic queries where you need to build the SQL string at runtime, use `Prisma.sql` to compose parameterised fragments safely:

```typescript
// src/repositories/institution.ts
async findSortedRaw(
  column: string,
  direction: "ASC" | "DESC",
): Promise<Institution[]> {
  return prisma.$queryRaw<Institution[]>(
    Prisma.sql`
      SELECT * FROM "Institution"
      WHERE "deletedAt" IS NULL
      ORDER BY ${Prisma.raw(column)} ${Prisma.raw(direction)}
    `,
  );
}
```

> Only use `Prisma.raw` for structural parts of the query (column names, sort direction) that cannot be parameterised. Never pass user input through `Prisma.raw`.

---

#### `$executeRaw`

Use `$executeRaw` for statements that modify data and return a row count. Wired to `PATCH /api/institutions/country`:

```typescript
// src/repositories/institution.ts
async bulkUpdateCountry(
  oldCountry: string,
  newCountry: string,
): Promise<number> {
  return prisma.$executeRaw`
    UPDATE "Institution"
    SET country = ${newCountry}
    WHERE country = ${oldCountry}
    AND "deletedAt" IS NULL
  `;
}
```

```typescript
// src/services/institution.ts
async renameCountry(oldCountry: string, newCountry: string): Promise<number> {
  return institutionRepository.bulkUpdateCountry(oldCountry, newCountry);
}
```

```typescript
// src/controllers/institution.ts
const bulkUpdateCountry = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { oldCountry, newCountry } = req.body;
    const affected = await institutionService.renameCountry(
      oldCountry,
      newCountry,
    );
    res.status(200).json({ message: `${affected} institutions updated` });
  } catch (err) {
    next(err);
  }
};

export { bulkUpdateCountry };
```

```typescript
// src/routes/institution.ts
router.patch("/country", bulkUpdateCountry);
```

---

#### Raw queries inside transactions

Both methods work inside `$transaction`, letting you mix raw SQL with Prisma model queries atomically. This example updates a department's institution and writes an audit record in the same operation:

```typescript
// src/repositories/department.ts
class DepartmentRepository {
  // ... existing methods

  async moveToInstitution(
    departmentId: string,
    newInstitutionId: string,
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        UPDATE "Department"
        SET "institutionId" = ${newInstitutionId}
        WHERE id = ${departmentId}
      `;

      await tx.auditLog.create({
        data: {
          model: "Department",
          action: "UPDATE",
          recordId: departmentId,
        },
      });
    });
  }
}
```

```typescript
// src/services/department.ts
async moveToInstitution(
  departmentId: string,
  newInstitutionId: string,
): Promise<void> {
  return departmentRepository.moveToInstitution(departmentId, newInstitutionId);
}
```

```typescript
// src/controllers/department.ts
const moveDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { institutionId } = req.body;
    await departmentService.moveToInstitution(id, institutionId);
    res.status(200).json({ message: "Department successfully moved" });
  } catch (err) {
    next(err);
  }
};

export { moveDepartment };
```

```typescript
// src/routes/department.ts
router.patch("/:id/move", moveDepartment);
```

📖 Reference: [Prisma - Raw queries](https://www.prisma.io/docs/orm/prisma-client/queries/raw-database-access/raw-queries)

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

### Task 5 - Audit Log with Prisma Extension

Add a `$extends` query extension that logs every `create`, `update`, and `delete` operation to an `AuditLog` model. The log should record the model name, action, and timestamp.

---

### Task 6 - Raw Query Endpoint

Add a `GET /api/institutions/search` endpoint that uses `$queryRaw` to query the `Institution` table directly. The endpoint should accept a `q` query parameter and return all institutions where the name matches using a raw `ILIKE` query.

---

### Task 7 - Unit Tests for Services

Write unit tests for `InstitutionService` using mock repositories. Cover the `getAll` (empty), `getById` (found and not found), `create`, `update`, and `delete` methods.

---

## README

Update the `README.md` to document the updated architecture and the new service layer.