# Week 02

## Before We Start

Open your **s2-24-intermediate-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-02-formative-assessment** from **week-01-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Create a New Vite Project

1. Create a new project using **Create Vite App**:

```bash
npm init vite@latest
```

2. When prompted, select the following options:

- Project name: **week-02-formative-assessment**
- Framework: **React**
- Variant: **TypeScript + SWC**

3. Change into the project directory:

```bash
cd week-02-formative-assessment
```

4. Install the project dependencies:

```bash
npm install
```

5. Start the development server:

```bash
npm run dev
```

6. Open your browser and navigate to <http://localhost:5173>. You should see the default **React** application.

---

## TypeScript

TypeScript is a superset of JavaScript that adds static types to the language. It is a powerful tool that helps you write safer and more reliable code. TypeScript is a great choice for building large-scale applications.

---

### Primitive Types

You can specify the type of a variable using a colon (`:`) followed by the type. Here are some examples of primitive types:

```typescript
let name: string = "John Doe";
name = "Jane Doe"; // OK
name = 30; // Error: Type 'number' is not assignable to type 'string'

let age: number = 30;
age = 40; // OK
age = "30"; // Error: Type 'string' is not assignable to type 'number'

let isStudent: boolean = true;
isStudent = false; // OK
isStudent = "true"; // Error: Type 'string' is not assignable to type 'boolean'
```

---

### Union Types

You can specify multiple types for a variable using a pipe (`|`) symbol. This is called a **union type**:

```typescript
let id: number | string = 123;

id = 456; // OK
id = "789"; // OK
id = true; // Error: Type 'boolean' is not assignable to type 'string | number'
```

---

### Dynamic Types

You can use the `any` type to specify a variable that can hold any value:

```typescript
let value: any = 123;
value = "abc"; // OK
value = true; // OK
```

---

### Literal Types

You can specify a variable with a specific value using a **literal type**:

```typescript
let direction: "up" | "down" | "left" | "right" = "up";

direction = "down"; // OK
direction = "left"; // OK
direction = "right"; // OK
direction = "top"; // Error: Type '"top"' is not assignable to type '"up" | "down" | "left" | "right"'
```

---

### Objects

You can specify the type of an object using an **interface**:

```typescript
interface Person {
  name: string;
  age: number;
  isStudent: boolean;
}

let person: Person = {
  name: "John Doe",
  age: 30,
  isStudent: true,
};

let person2: Person = {
  name: "Jane Doe",
  age: "30", // Error: Type 'string' is not assignable to type 'number'
  isStudent: false,
};
```

---

### Arrays

You can specify the type of an array using square brackets (`[]`) followed by the type:

```typescript
let numbers: number[] = [1, 2, 3, 4, 5];

numbers.push(6); // OK
numbers.push("7"); // Error: Argument of type 'string' is not assignable to parameter of type 'number'
```

---

### Functions

You can specify the type of a function using an arrow (`=>`) followed by the return type:

```typescript
function add(a: number, b: number): number {
  return a + b;
}

let result: number = add(10, 20); // OK

let result2: number = add("10", 20); // Error: Argument of type 'string' is not assignable to parameter of type 'number'
```

---

### Type Aliases

You can create a **type alias** to simplify complex types:

```typescript
type Point = {
  x: number;
  y: number;
};

let point: Point = {
  x: 10,
  y: 20,
};
```

What is the difference between an **interface** and a **type alias**? An **interface** can be extended, while a **type alias** cannot.

---

### Extending Interfaces

You can extend an **interface** using the `extends` keyword:

```typescript
interface Person {
  name: string;
  age: number;
}

interface Student extends Person {
  isStudent: boolean;
}

let student: Student = {
  name: "John Doe",
  age: 30,
  isStudent: true,
};
```

---

### Generics

You can create a **generic type** to specify a type that depends on another type:

```typescript
type Box<T> = {
  value: T;
};

let box: Box<number> = {
  value: 123,
};

let box2: Box<string> = {
  value: "abc",
};
```

---

### Enums

You can create an **enum** to specify a set of named constants:

```typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

let direction: Direction = Direction.Up;

if (direction === Direction.Up) {
  console.log("Up");
}
```

## TypeScript in React

Let us convert the following example into TypeScript:

```jsx
import { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0); // Initial state is 0

  const increment = (amount) => {
    setCount(count + amount); // Increment the count by the given amount
  };

  return (
    <>
      <p>{count}</p>     
      <button onClick={increment(1)}>Increment</button>
    </>
  );
};

export default Counter;
```

```typescript
import { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState<number>(0); // Initial state is 0

  const increment = (amount: number) => {
    setCount(count + amount); // Increment the count by the given amount
  };

  return (
    <>
      <p>{count}</p>     
      <button onClick={() => increment(1)}>Increment</button>
    </>
  );
};

export default Counter;
```

Here is another example:

```jsx
import { useState, useEffect } from "react";

interface Joke {
  setup: string;
  punchline: string;
}

const RandomProgrammingJoke: React.FC = () => {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("https://official-joke-api.appspot.com/jokes/programming/random")
      .then((response) => response.json())
      .then((data: Joke[]) => {
        setJoke(data[0]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : joke ? (
        <p>
          {joke.setup} {joke.punchline}
        </p>
      ) : (
        <p>Failed to load joke.</p>
      )}
    </>
  );
};

export default RandomProgrammingJoke;
```

---

## Formative Assessment

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

---

### Task One