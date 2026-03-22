# Week 01.1 - TypeScript

## Navigation

|              | Link                                                                                                                   |
| ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Code Example | [Code Example](code-example)                                                                                           |
| Next         | [Week 01.2 - More Prisma, Service Layer and Dependency Injection](../week-01.2-more-prisma-service-layer-di/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 01.1 branch:

```bash
git checkout -b w01.1-typescript
```

This course builds on the REST API foundations from ID607001: Introductory Application Development Concepts. You should be comfortable with Express, Prisma, middleware, authentication, and integration testing before proceeding.

---

## 1. TypeScript

TypeScript is a statically typed superset of JavaScript developed and maintained by Microsoft. It compiles to plain JavaScript and can run anywhere JavaScript runs.

The key difference from JavaScript is that TypeScript requires you to declare the types of variables, function parameters, and return values at write time. The TypeScript compiler then checks your code for type errors before it runs, catching entire categories of bugs that would otherwise only surface at runtime.

📖 Reference: [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

### 1.1 Why TypeScript?

| Benefit                   | Description                                                      |
| ------------------------- | ---------------------------------------------------------------- |
| **Catch errors early**    | Type mismatches are flagged at compile time, not at runtime      |
| **Better IDE support**    | Autocompletion, inline documentation, and refactoring tools      |
| **Self-documenting code** | Types serve as always-accurate inline documentation              |
| **Safer refactoring**     | The compiler tells you everywhere a change has a knock-on effect |
| **Team scale**            | Explicit contracts between modules reduce integration surprises  |

---

## 2. Setup

---

### 2.1 Installing TypeScript

```bash
npm install typescript tsx @types/node --save-dev
```

| Package       | Purpose                                                                   |
| ------------- | ------------------------------------------------------------------------- |
| `typescript`  | The TypeScript compiler (`tsc`)                                           |
| `tsx`         | Runs TypeScript files directly in Node.js without a separate compile step |
| `@types/node` | Type definitions for Node.js built-ins (`process`, `path`, etc.)          |

---

### 2.2 `tsconfig.json`

Create `tsconfig.json` at the project root:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

| Option            | Purpose                                      |
| ----------------- | -------------------------------------------- |
| `target`          | JavaScript version to compile to             |
| `module`          | Module system for output files               |
| `strict`          | Enables all strict type checks               |
| `outDir`          | Where compiled `.js` files are written       |
| `rootDir`         | Where TypeScript source files live           |
| `esModuleInterop` | Allows default imports from CommonJS modules |

---

### 2.3 Update `package.json` Scripts

```json
"scripts": {
  "dev": "tsx watch src/app.ts",
  "build": "tsc",
  "start": "node dist/app.js"
}
```

---

### 2.4 Installing Type Definitions

Many npm packages are written in JavaScript and ship without types. You can install community-maintained type definitions from the `@types` namespace:

```bash
npm install @types/express @types/cors @types/bcryptjs @types/jsonwebtoken --save-dev
```

---

## 3. TypeScript Fundamentals

---

### 3.1 Primitive Types

```typescript
const name: string = "Jane";
const age: number = 30;
const isActive: boolean = true;
const nothing: null = null;
const notAssigned: undefined = undefined;
```

TypeScript can usually infer the type from the initial value, so explicit annotations are often unnecessary for local variables:

```typescript
const name = "Jane"; // Inferred as string
const age = 30; // Inferred as number
```

Prefer type inference for simple variables and explicit annotations for function signatures and public APIs.

---

### 3.2 Arrays and Tuples

```typescript
// Arrays
const names: string[] = ["Alice", "Bob"];
const scores: number[] = [95, 87, 72];

// Tuples - fixed-length arrays with known types at each position
const point: [number, number] = [10, 20];
const entry: [string, number] = ["Alice", 95];
```

---

### 3.3 Object Types and Interfaces

An **interface** defines the shape of an object:

```typescript
interface CreateInstitutionBody {
  name: string;
  region: string;
  country: string;
}

interface UpdateInstitutionBody {
  name?: string;
  region?: string;
  country?: string;
}
```

Optional properties use `?`. Notice that `UpdateInstitutionBody` marks all fields optional — this allows partial updates where only the provided fields are changed.

---

### 3.4 Type Aliases

A **type alias** is an alternative to interfaces, particularly useful for union types and mapped types:

```typescript
type Role = "ADMIN" | "STAFF" | "STUDENT";

type ID = string;
```

|               | Interface         | Type Alias       |
| ------------- | ----------------- | ---------------- |
| Object shapes | ✅ Preferred      | ✅ Works         |
| Union types   | ❌ Cannot         | ✅ Required      |
| Extending     | `extends` keyword | Intersection `&` |
| Reopening     | ✅ Can be merged  | ❌ Cannot        |

---

### 3.5 Union and Intersection Types

```typescript
// Union - a value can be one of several types
type StringOrNumber = string | number;

const formatId = (id: StringOrNumber): string => {
  return String(id);
};

// Intersection - a value must satisfy all types simultaneously
type AuthenticatedUser = JwtPayload & { id: string; role: string };
```

---

### 3.6 Enums

TypeScript enums map names to values:

```typescript
enum Role {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  STUDENT = "STUDENT",
}

const userRole: Role = Role.ADMIN;
```

> String enums (as above) are preferred over numeric enums because they produce readable values at runtime and serialise cleanly to JSON.

---

### 3.7 Generics

Generics allow you to write reusable code that works with any type while still enforcing type safety. A practical example from this project is the `PaginationResult` type, which wraps any resource in a consistent paginated response shape:

```typescript
// src/types/pagination.ts
interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export type { PaginationResult };
```

The type parameter `T` is substituted at the call site, so the same interface works for institutions, users, or any other resource:

```typescript
// A generic function
const getFirst = <T>(arr: T[]): T | undefined => {
  return arr[0];
};

const firstNumber = getFirst([1, 2, 3]); // Inferred as number | undefined
const firstName = getFirst(["a", "b"]); // Inferred as string | undefined
```

---

### 3.8 Utility Types

TypeScript ships with built-in utility types for common transformations. A practical example from this project is deriving `RegisterBody` and `LoginBody` from Prisma's generated `User` type rather than defining them by hand:

```typescript
// src/types/auth.ts
import { User } from "@prisma/client";

// Omit database-managed fields to get only what the client sends on register
type RegisterBody = Omit<User, "id" | "createdAt" | "updatedAt">;

// Pick only the credentials needed for login
type LoginBody = Pick<User, "emailAddress" | "password">;

export type { RegisterBody, LoginBody };
```

The full set of built-in utility types is:

| Utility type   | Description                                                   |
| -------------- | ------------------------------------------------------------- |
| `Partial<T>`   | All properties become optional                                |
| `Required<T>`  | All properties become required                                |
| `Omit<T, K>`   | Exclude specific properties — used above for `RegisterBody`   |
| `Pick<T, K>`   | Include only specific properties — used above for `LoginBody` |
| `Readonly<T>`  | All properties become read-only                               |
| `Record<K, V>` | Construct an object type with specified keys and a value type |

> Because `RegisterBody` and `LoginBody` are derived directly from Prisma's generated `User` type, they stay in sync with your schema automatically whenever you run `npx prisma generate`.

---

## 4. Typing Express Applications

---

### 4.1 Typed Request Bodies

Express's `Request` type accepts generics for params, query, and body. Define dedicated body interfaces in `src/types/` and import them into your controllers:

```typescript
// src/types/institution.ts
interface CreateInstitutionBody {
  name: string;
  region: string;
  country: string;
}

interface UpdateInstitutionBody {
  name?: string;
  region?: string;
  country?: string;
}

export type { CreateInstitutionBody, UpdateInstitutionBody };
```

```typescript
// src/controllers/institution.ts
import { Request, Response } from "express";
import { CreateInstitutionBody } from "../types/institution.js";

const createInstitution = async (
  req: Request<{}, {}, CreateInstitutionBody>,
  res: Response,
): Promise<Response> => {
  const { name, region, country } = req.body; // Fully typed
  // ...
};
```

---

### 4.2 Typed Route Parameters

```typescript
// src/types/institution.ts
interface InstitutionParams {
  id: string;
}

export type { InstitutionParams };
```

```typescript
const getInstitution = async (
  req: Request<InstitutionParams>,
  res: Response,
): Promise<Response> => {
  const { id } = req.params; // Typed as string
  // ...
};
```

When a route handler needs both typed params and a typed body, pass both generics:

```typescript
const updateInstitution = async (
  req: Request<InstitutionParams, {}, UpdateInstitutionBody>,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;
  const { name, region, country } = req.body;
  // ...
};
```

---

### 4.3 Extending the Request Type

When attaching custom properties to `req` (such as `req.user` from JWT middleware), extend Express's `Request` interface:

```typescript
// src/types/express.d.ts
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: string; role: string };
    }
  }
}
```

This lets `jwtAuth.ts` assign a typed payload to `req.user`, which downstream route handlers can then read without casting:

```typescript
// src/middleware/jwtAuth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET,
    ) as jwt.JwtPayload & { id: string; role: string };

    req.user = payload;

    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Not authorized to access this route" });
  }
};

export default jwtAuth;
```

---

## 5. Migrating an Existing Project to TypeScript

The recommended migration strategy is incremental:

1. Install TypeScript and type definitions
2. Add `tsconfig.json` with `"strict": false` initially
3. Rename files from `.js` to `.ts` one at a time
4. Fix type errors as you go
5. Enable `"strict": true` once the codebase compiles cleanly

---

### 5.1 Rename Files

Rename your source files:

```
app.js                       → app.ts
controllers/institution.js   → controllers/institution.ts
controllers/auth.js          → controllers/auth.ts
routes/institution.js        → routes/institution.ts
middleware/jwtAuth.js        → middleware/jwtAuth.ts
repositories/institution.js  → repositories/institution.ts
```

---

### 5.2 Add Types Incrementally

Start by adding return types to functions and typing function parameters. Use `unknown` instead of `any` when the type is genuinely unknown:

```typescript
// Avoid - opts out of type checking entirely
const data: any = await fetchData();

// Better - forces you to narrow the type before using it
const data: unknown = await fetchData();
if (typeof data === "object" && data !== null) {
  // Use data
}
```

---

### 5.3 Prisma and TypeScript

Prisma generates TypeScript types automatically from your schema. These types are available directly from `@prisma/client`:

```typescript
import { Institution, User } from "@prisma/client";
import { Prisma } from "@prisma/client";

type CreateInstitutionInput = Prisma.InstitutionCreateInput;
type UpdateInstitutionInput = Prisma.InstitutionUpdateInput;
```

This means your database types and your application types stay in sync automatically whenever you run `npx prisma generate`.

---

## 6. Type-Safe Repository Pattern

The repository encapsulates all database access behind a typed interface. The `findAll` method accepts filter, sort, and pagination parameters and returns a `PaginationResult<Institution>` — a generic type defined in `src/types/pagination.ts`:

```typescript
// src/repositories/institution.ts
import { Prisma, Institution } from "@prisma/client";
import prisma from "../../prisma/db.js";
import { PaginationResult } from "../types/pagination.js";

class InstitutionRepository {
  async create(data: Prisma.InstitutionCreateInput): Promise<Institution> {
    return await prisma.institution.create({ data });
  }

  async findAll(
    filters: Record<string, string> = {},
    sortBy: string = "id",
    sortOrder: string = "asc",
    page: string = "1",
    pageSize: string = "10",
  ): Promise<PaginationResult<Institution>> {
    const parsedPage = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const parsedPageSize =
      parseInt(pageSize, 10) > 0 ? parseInt(pageSize, 10) : 10;

    const where: Prisma.InstitutionWhereInput = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== "") {
        if (typeof value === "string") {
          where[key] = { contains: value };
        } else if (typeof value === "boolean" || typeof value === "number") {
          where[key] = { equals: value };
        }
      }
    }

    const totalCount = await prisma.institution.count({ where });
    const totalPages = Math.ceil(totalCount / parsedPageSize);

    const institutions = await prisma.institution.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (parsedPage - 1) * parsedPageSize,
      take: parsedPageSize,
    });

    return {
      data: institutions,
      pagination: {
        currentPage: parsedPage,
        pageSize: parsedPageSize,
        totalCount,
        totalPages,
        nextPage: parsedPage < totalPages ? parsedPage + 1 : null,
        prevPage: parsedPage > 1 ? parsedPage - 1 : null,
      },
    };
  }

  async findById(id: string): Promise<Institution | null> {
    return await prisma.institution.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: Prisma.InstitutionUpdateInput,
  ): Promise<Institution> {
    return await prisma.institution.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Institution> {
    return await prisma.institution.delete({ where: { id } });
  }
}

export default new InstitutionRepository();
```

---

## 7. Useful `tsconfig.json` Options

| Option                 | Purpose                                                  |
| ---------------------- | -------------------------------------------------------- |
| `"strict": true`       | Enables `noImplicitAny`, `strictNullChecks`, and more    |
| `"noImplicitAny"`      | Disallows implicit `any` types                           |
| `"strictNullChecks"`   | `null` and `undefined` are not assignable to other types |
| `"noUnusedLocals"`     | Error on declared but unused local variables             |
| `"noUnusedParameters"` | Error on declared but unused function parameters         |
| `"noImplicitReturns"`  | Error if not all code paths return a value               |

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

Implement all of the code examples covered above.
---



---

## README

Update the `README.md` to document the TypeScript setup and updated development scripts.
