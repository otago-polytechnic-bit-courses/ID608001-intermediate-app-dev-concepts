# Module 04 - TypeScript

## 1. Why TypeScript

**Why this matters.** You already know JavaScript. TypeScript doesn't replace it; it sits on top of it, adding a type system that gets checked before your code ever runs, and compiles down to plain JavaScript at the end. Every valid JavaScript file is already valid-ish TypeScript, but TypeScript lets you say, up front, exactly what shape a value is supposed to be, and it will refuse to compile if you break that promise.

|                        | JavaScript                      | TypeScript                            |
| ---------------------- | ------------------------------- | ------------------------------------- |
| When errors are caught | At runtime, on someone's device | At compile time, in your editor       |
| Function signatures    | A comment, if you're lucky      | Enforced by the compiler              |
| Editor autocomplete    | Guesses based on usage          | Exact, based on declared types        |
| Extra step             | None                            | Compiles to JavaScript before running |

This is the same instinct behind Django's migrations from Module 02, or the defensive `TryParse`-style habits from earlier courses: catch the mistake as early and as cheaply as possible, rather than discovering it later, in production, on someone else's phone.

---

## 2. Setting up a project, and running TypeScript code

This module's tasks are short, standalone scripts, not the Expo app you'll build in Module 05, so what you need here is a small project you can write `.ts` files in and actually run, nothing more.

### 2.1 Create the project

```bash
mkdir ts-practice
cd ts-practice
npm init -y
npm install -D typescript
npx tsc --init
```

`npm init -y` creates a `package.json`, the same kind of project manifest `npm` and `expo` use everywhere else. `npm install -D typescript` installs the TypeScript compiler itself, `tsc`, as a project dependency rather than something installed globally, which is what lets everyone on a team, and every CI machine, use the exact same version. `npx tsc --init` generates a `tsconfig.json` file, which controls how strictly, and how, the compiler behaves.

A few `tsconfig.json` options worth setting deliberately, rather than leaving at their defaults:

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "rootDir": "src",
    "outDir": "dist"
  }
}
```

`strict` turns on the full set of TypeScript's safety checks at once. Leave it on. Turning it off to make an error message go away is treating the symptom, not the mistake it's pointing at. `rootDir` and `outDir` keep the `.ts` files you write separate from the plain `.js` files the compiler produces, which matters once there's more than one file in the project.

### 2.2 Write and run a file

Create `src/index.ts`:

```typescript
function greet(name: string): string {
  return `Hello, ${name}`;
}

console.log(greet("FitTrack"));
```

TypeScript code doesn't run directly; it has to be **compiled** down to plain JavaScript first, and then that JavaScript is what actually runs, the same two-step shape as compiling and running a C# program in an earlier course.

```bash
npx tsc
node dist/index.js
```

`npx tsc` reads `tsconfig.json`, compiles everything under `src/`, and writes the plain-JavaScript result into `dist/`. `node dist/index.js` then runs that compiled output, the same way it would run any other JavaScript file. If you change `src/index.ts`, you need to re-run `npx tsc` before `node` will see the change; it's compiling from the old output otherwise.

### 2.3 A faster loop, for practice work

Recompiling by hand for every small change gets tedious fast, especially while working through the tasks in this module. `tsx` runs a `.ts` file directly, type-checking and compiling it in memory, with no separate `dist/` step:

```bash
npm install -D tsx
npx tsx src/index.ts
```

Use `npx tsc` and `node` when you want to see the actual compiled JavaScript, or when running compiled output is part of a task; use `npx tsx` for everything else, since it's faster and matches the run loop you'll get automatically once you move to Expo in Module 05.

| Key terms       |                                                                          |
| --------------- | ------------------------------------------------------------------------ |
| TypeScript      | A superset of JavaScript that adds static types, checked at compile time |
| `tsc`           | The TypeScript compiler; turns `.ts` files into plain `.js` files        |
| `tsconfig.json` | Configuration file controlling how the TypeScript compiler behaves       |
| `strict`        | The compiler option that enables TypeScript's full set of safety checks  |
| `tsx`           | A tool that runs a `.ts` file directly, without a separate compile step  |

### Task 1

Set up the project exactly as in Section 2.1, write the `greet` function from Section 2.2 into `src/index.ts`, and run it both ways: once via `npx tsc` followed by `node dist/index.js`, and once via `npx tsx src/index.ts`. Confirm both produce the same output, then break the file on purpose, for example by calling `greet(42)` instead of `greet("FitTrack")`, and paste the compiler error each approach gives you.

---

## 3. Basic types

```typescript
let studioName: string = "CityFit";
let capacity: number = 20;
let isAcceptingMembers: boolean = true;

let suburbs: string[] = ["Dunedin Central", "St Kilda"];
let suburbsAlt: Array<string> = ["Dunedin Central", "St Kilda"];

let coordinates: [number, number] = [-45.8788, 170.5028]; // a tuple: fixed length, fixed types per slot
```

Two types are worth understanding before you reach for them: `any` switches off type checking entirely for that value, which defeats the purpose of using TypeScript in the first place, and `unknown` is its safer sibling, forcing you to check what a value actually is before you're allowed to use it. Prefer `unknown` over `any` whenever a value's shape genuinely isn't known yet, such as raw JSON straight off the network.

```typescript
let raw: unknown = JSON.parse(responseText);

if (typeof raw === "object" && raw !== null && "name" in raw) {
  // TypeScript now trusts raw a little more inside this block
}
```

### Task 2

Take a short plain-JavaScript snippet of your own, five or six lines that use a mix of strings, numbers, and an array, and rewrite it in TypeScript with explicit types on every variable. Then delete one type annotation and change the value it was attached to so it no longer matches, for example assigning a number to a variable you declared as a `string`. Confirm the compiler catches it, and paste the exact error message into a short write-up.

---

## 4. Interfaces and type aliases

An **interface** describes the shape of an object: what properties it has, and what type each one is. This is the direct TypeScript equivalent of sketching a class's fields before writing it, the same habit Module 02 asked you to use before writing a Django model.

```typescript
interface Studio {
  id: number;
  name: string;
  suburb: string;
  city: string;
  isAcceptingMembers: boolean;
  createdAt: string;
}
```

Notice this lines up field-for-field with the `Studio` model you built in Django back in Module 02, and the JSON shape `StudioSerializer` produces in Module 03. That's not a coincidence worth glossing over: an interface like this is your TypeScript-side promise about exactly the same data, just seen from the client instead of the server. Keeping the two in sync by hand is one of the more common sources of bugs in an app like this one.

`type` aliases can describe the same kind of shape, and for plain object shapes the two are close to interchangeable. The convention most teams settle on is: use `interface` for object shapes you might extend later, and `type` for unions, tuples, or anything that isn't a plain object.

```typescript
type StudioId = number;

interface StudioClass {
  id: number;
  studio: StudioId;
  name: string;
  capacity: number;
  durationMinutes: number;
}
```

Optional properties use a `?`, and `readonly` prevents a property from being reassigned after the object is created:

```typescript
interface StudioClass {
  readonly id: number; // an id shouldn't change after creation
  studio: StudioId;
  name: string;
  capacity: number;
  durationMinutes?: number; // not every class needs this recorded
}
```

| Key terms  |                                                                         |
| ---------- | ----------------------------------------------------------------------- |
| Interface  | Describes the shape of an object: its properties and their types        |
| Type alias | A named type, often used for unions or shapes that aren't plain objects |
| `?`        | Marks a property as optional                                            |
| `readonly` | Prevents a property from being reassigned after the object is created   |

### Task 3

Define TypeScript interfaces for `Studio` and `StudioClass` that match the fields on the Django models you built in Module 02, including whichever extra fields you added yourself in that module's Task 1. Deliberately get one field's type wrong first, for example typing `capacity` as a `string`, and write down, in a sentence or two, what kind of bug that mismatch would cause later if nobody caught it.

---

## 5. Typing functions

```typescript
function formatStudioLabel(name: string, suburb: string): string {
  return `${name} (${suburb})`;
}

// Optional and default parameters
function greetMember(name: string, isReturning: boolean = false): string {
  return isReturning ? `Welcome back, ${name}` : `Welcome, ${name}`;
}

// Arrow function with an explicit type
const capacityIsValid = (capacity: number): boolean => capacity > 0;
```

A function's return type is usually inferred correctly by TypeScript on its own, but writing it explicitly, as above, is worth doing on any function whose return value matters to code elsewhere, since it turns an accidental change to that function into a compile error at every call site, instead of a silent surprise.

---

## 6. Union types and narrowing

A **union type** says a value could be one of several specific types.

```typescript
type MembershipStatus = "active" | "paused" | "cancelled";

function describeStatus(status: MembershipStatus): string {
  if (status === "active") return "Currently a member";
  if (status === "paused") return "Membership paused";
  return "No longer a member";
}
```

This pattern, a union of specific string literals, is often a better fit than a traditional `enum` for small, fixed sets of options like this one: it needs no separate declaration, and it's exactly what a JSON API is going to send you as a plain string anyway.

**Narrowing** is TypeScript following your `if` checks and `typeof` checks to work out, step by step, what a value's type must be at each point in your code:

```typescript
function formatCapacity(capacity: number | string): string {
  if (typeof capacity === "number") {
    return `${capacity} spots`; // TypeScript knows this is a number here
  }
  return capacity; // and knows this must be a string here, by elimination
}
```

| Key terms    |                                                                               |
| ------------ | ----------------------------------------------------------------------------- |
| Union type   | A type that could be one of several specific types                            |
| Narrowing    | TypeScript refining a value's type based on `if`, `typeof`, or similar checks |
| Literal type | A specific value used as a type, e.g. `"active"`                              |

### Task 4

Define a `MembershipStatus` union type with at least three states, and a function that takes a value of that type and returns a different string for each state. Then try calling that function with a string that isn't one of your listed states, and paste the compiler error you get.

---

## 7. Generics

A **generic** lets a function, interface, or type work with a type that's decided later, at the point it's actually used, rather than being locked in when it's written. This is the same idea behind a generic `List<T>` in C#, from earlier courses, just with different syntax.

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
}

function unwrap<T>(response: ApiResponse<T>): T {
  return response.data;
}

const studioResponse: ApiResponse<Studio> = {
  data: {
    id: 1,
    name: "CityFit",
    suburb: "Dunedin Central",
    city: "Dunedin",
    isAcceptingMembers: true,
    createdAt: "2026-01-01",
  },
  status: 200,
};

const studio: Studio = unwrap(studioResponse);
```

`ApiResponse<Studio>` and `ApiResponse<StudioClass>` are both built from the exact same interface, with no duplication, the same DRY thinking from Module 02's migrations and Module 03's `ModelSerializer`, just expressed at the type level instead of at runtime.

### Task 5

Write a generic interface `Paginated<T>` describing a paginated API response, with a `results: T[]` field and a `count: number` field. Use it to type a `Paginated<Studio>` and a `Paginated<StudioClass>` value, and confirm both compile correctly.

---

## 8. Typing React component props

This is the piece the next module leans on immediately, so a short preview is worth it even though React Native itself is Module 05's job. A **component** is a function that returns a description of what should appear on screen, written in a markup-like syntax called **JSX**; `Pressable` and `Text` below are two of React Native's built-in components, standing in for things like `<button>` and `<p>` since there's no HTML involved. None of that needs to make full sense yet. What matters here is just the typing: a component's props are a plain object, so they get an interface like any other:

```tsx
interface StudioRowProps {
  id: number;
  name: string;
  suburb: string;
  city: string;
  onPress: (id: number) => void;
}

function StudioRow({ id, name, suburb, city, onPress }: StudioRowProps) {
  return (
    <Pressable onPress={() => onPress(id)}>
      <Text>{name}</Text>
      <Text>
        {suburb}, {city}
      </Text>
    </Pressable>
  );
}
```

Typing `onPress` as `(id: number) => void` says exactly what that function must accept and that it returns nothing useful, which means a typo like calling `onPress()` with no argument, or with a `string` instead of a `number`, is caught immediately instead of surfacing as a bug three screens later.

---

## 9. Typing asynchronous code and API responses

`fetch` itself isn't strongly typed by default, since TypeScript has no way of knowing what shape a server will actually send back. The honest way to handle this is to treat the raw response as `unknown`, and only trust it once you've assigned it a type you're confident matches:

```typescript
async function fetchStudios(): Promise<Studio[]> {
  const response = await fetch("http://127.0.0.1:8000/api/studios/");
  const raw: unknown = await response.json();
  return raw as Studio[]; // an assertion: you are telling TypeScript to trust you here
}
```

`as Studio[]` is a **type assertion**: you're telling the compiler "trust me, this is a `Studio[]`," and TypeScript won't check that you're right. It's the type-level equivalent of an unchecked cast, and it's honest about where the type safety actually stops: at the network boundary, where the compiler genuinely has no way to verify what a server sends back. This is exactly why Module 03 asked you to write down, before testing, what a successful and a failing response should look like; that written expectation is what a type assertion like this one is standing in for.

| Key terms             |                                                                              |
| --------------------- | ---------------------------------------------------------------------------- |
| Generic               | A type parameter decided at the point of use, not when the type is declared  |
| Type assertion (`as`) | Tells the compiler to trust your claim about a value's type without checking |
| `Promise<T>`          | A promise that will eventually resolve to a value of type `T`                |

### Task 6

Write a typed `fetchStudioClasses(studioId: number): Promise<StudioClass[]>` function using the interfaces from Task 3. Run it against the endpoints you built in Module 03 and confirm the shape TypeScript expects actually matches what the API sends back. If it doesn't match exactly, for example a field name is different, decide which side is wrong, the interface or the serializer, and fix it, then write one sentence explaining which you chose to change and why.
