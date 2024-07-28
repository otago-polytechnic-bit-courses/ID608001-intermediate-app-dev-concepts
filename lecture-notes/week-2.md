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

You can also specify a **2D array** or an array with mixed types:

```typescript
let 2DArray: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

let mixedArray: (number | string)[] = [1, "2", 3, "4", 5];
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

Here is an example of converting a **React** component to use **TypeScript**:

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

const Counter: React.FC = () => {
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

---

Here is an example of a **React** component that fetches a random programming joke using **TypeScript**:

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
    const fetchData = async () => {
      try {
        const response = await fetch("https://official-joke-api.appspot.com/jokes/programming/random");
        const data = await response.json();
        setJoke(data[0]);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchData();
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

Here is an example of a **React** component that takes props using **TypeScript**:

```typescript
// Parent Component
import Person from "./Person";

const App: React.FC = () => {
  return (
    <>
      <Person name="John Doe" age={30} isStudent={true} />
      <Person name="Jane Doe" age={25} isStudent={false} />
    </>
  );
};

export default App;

// Child Component
interface PersonProps {
  name: string;
  age: number;
  isStudent: boolean;
}

const Person: React.FC<PersonProps> = (props) => {
  return (
    <>
      <p>Name: {props.name}</p>
      <p>Age: {props.age}</p>
      <p>Student: {props.isStudent ? "Yes" : "No"}</p>
    </>
  );
};

export default Person;
```

---

## Formative Assessment

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

---

### Task One

Create a new component called **Person**. The component should take the following props:

- `id` (number)
- `name` (string)
- `age` (number)
- `isStudent` (boolean)
- `onDelete` (function). The function should take the person's id as an argument.

In the `App` component, create an array of people with the following data:

- John Doe, 30, true
- Jane Doe, 25, false
- Jack Doe, 20, true
- Jill Doe, 15, false
- Jim Doe, 10, true

Render the `Person` component for each person in the array. When the delete button is clicked, remove the person from the array.

---

### Task Two

Create a new component called **Riddle**. The component should fetch a random riddle from the <https://riddles-api.vercel.app/random> API and display it. Display the riddle and the answer.

---

### Task Three

You have been given a component called **MultiplicationMatrix**. The component has two input fields for rows and columns. When the user enters the number of rows and columns and clicks the **Generate Matrix** button, a multiplication matrix should be generated. For example, if the user enters 3 for rows and 3 for columns, the matrix should look like this:

```
1 2 3
2 4 6
3 6 9
```

Implement the TODOs in the component.

```typescript
import { useState } from "react";

const MultiplicationMatrix: React.FC = () => {
  // TODO: The type for rows and columns is a number
  const [rows, setRows] = useState<>(0);
  const [columns, setColumns] = useState<>(0);

  // TODO: The type for matrix is a 2D array of numbers
  const [matrix, setMatrix] = useState<>([]);

  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: Convert the input value to a number and set the rows
  };

  const handleColumnsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: Convert the input value to a number and set the columns
  };

  const generateMatrix = () => {
    const newMatrix: number[][] = [];

    for (let i = 1; i <= rows; i++) {
      const row: number[] = [];
      for (let j = 1; j <= columns; j++) {
        // TODO: Multiply i and j and push the result to the row
      }
      // TODO: Push the row to the newMatrix
    }
    // TODO: Set the newMatrix to the matrix
  };

  return (
    <>
      <div>
        <label>
          Rows:
          <input type="number" value={rows} onChange={handleRowsChange} />
        </label>
      </div>
      <div>
        <label>
          Columns:
          <input type="number" value={columns} onChange={handleColumnsChange} />
        </label>
      </div>
      <button onClick={generateMatrix}>Generate Matrix</button>
      {matrix.length > 0 && (
        <table>
          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default MultiplicationMatrix;
```

---

### Task Four

Create a new component called **Calculator**. The component should have two input fields for numbers and a select field for the operation (addition, subtraction, multiplication, division). When the user enters two numbers and selects an operation, the result should be displayed.

---

### Task Five - Prettier (Research)

**Prettier** is a popular code formatting tool.

Read the documentation on [Prettier](https://prettier.io/docs/en/index.html), particularly the **Usage > Install**, **Usage > Ignoring Code** and **Configuring Prettier > Configuration File** sections. Use this information to format your code based on the rules specified in the `.prettierrc.json` file.

In the `.prettierrc.json` file, implement the following rules:

- Print width is 80
- Tab width is 2
- Semi-colons are required
- Single quotes are required
- Trailing commas wherever possible

In the `package.json` file, add the following lines to the `scripts` block.

```json
"prettier:format": "npx prettier --write .",
"prettier:check": "npx prettier --check ."
```

- `prettier:format` script is used to format the code based on the rules specified in the `.prettierrc.json` file.
- `prettier:check` script is used to check if the code is formatted based on the rules specified in the `.prettierrc.json` file.

Run the `prettier:format` script to format your code. Run the `prettier:check` script to check if your code is formatted correctly.

### Task Six - Pretty Quick (Research)

**Pretty Quick** is a tool that runs **Prettier** on your changed files. 

Read the documentation on [Pretty Quick]() and use it to format your code based on the rules specified in the `.prettierrc.json` file.

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.

