# Week 01

## GitHub

This course will use **GitHub** and **GitHub Classroom** to manage our development. Begin by clicking this link <https://classroom.github.com/a/eGYqq7-g>. You will be prompted to accept an assignment. Click on the **Accept this assignment** button. **GitHub Classroom** will create a new repository. You will use this repository to submit your formative (non-graded) and summative (graded) assessments.

---

### Development Workflow

By default, **GitHub Classroom** creates an empty repository. Firstly, you must create a **README** and `.gitignore` file. **GitHub** allows new files to be created once the repository is created.

---

### Create a README

Click the **Add file** button, then the **Create new file** button. Name your file `README.md` (Markdown), then click on the **Commit new file** button. You should see a new file in your formative assessments repository called `README.md` and the `main` branch.

> **Resource:** <https://guides.github.com/features/mastering-markdown/>

---

### Create a .gitignore File

Like before, click the **Add file** button and then the **Create new file** button. Name your file `.gitignore`. A `.gitignore` template dropdown will appear on the right-hand side of the screen. Select the **Node** `.gitignore` template. Click on the **Commit new file** button. You should see a new file in your formative assessments repository called `.gitignore`.

> **Resource:** <https://git-scm.com/docs/gitignore>

---

### Clone a Repository

Open up **Git Bash** or whatever alternative you see fit on your computer. Clone your formative assessments repository to a location on your computer using the command: `git clone <repository URL>`.

> **Resource:** <https://git-scm.com/docs/git-clone>

---

### Commit Message Conventions

You should follow the **conventional commits** convention when committing changes to your repository. A **conventional commit** consists of a **type**, **scope** and **description**. The **type** and **description** are mandatory, while the **scope** is optional. The **type** must be one of the following:

- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests

The **scope** is a phrase describing the codebase section affected by the change. For example, you can use the scope `javascript` if you are working on the **formative assessment** for **JavaScript**. If you are working on the **formative assessment** for **HTML**, use the scope `html`.

The **description** is a short description of the change. It should be written in the imperative mood, meaning it should be written as if you are giving a command or instruction. For example, "add a new feature" instead of "added a new feature".

Here are some examples of **conventional commits**:

- `feat(javascript): add a new feature`
- `fix(html): fix a bug`
- `docs(css): update documentation`

> **Resource:** <https://www.conventionalcommits.org/en/v1.0.0/>

---

## Before We Start

Open your **s2-24-intermediate-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-01-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Vite

**Vite** is a build tool that aims to provide a faster and more efficient development experience for modern web projects. It is a front-end build tool that is designed to be fast, lightweight, and flexible. **Vite** is optimized for modern web development and provides features like hot module replacement, fast builds, and instant server start.

### Create a New Vite Project

1. Create a new project using **Create Vite App**:

```bash
npm init vite@latest
```

2. When prompted, select the following options:

- Project name: **week-01-formative-assessment**
- Framework: **React**
- Variant: **JavaScript + SWC**

3. Change into the project directory:

```bash
cd week-01-formative-assessment
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

## React

React is a JavaScript library for building user interfaces. It was developed by Facebook in 2013 and has since become one of the most popular front-end libraries for building web applications. React allows developers to build interactive user interfaces using a component-based architecture.

---

### Why React?

React has several key features that make it a popular choice for building web applications:

1. **Component-Based Architecture**: React applications are built using reusable components that encapsulate the user interface logic. It makes it easy to build complex applications out of simple building blocks.
2. **Virtual DOM**: React uses a virtual DOM to optimize the rendering of components. When a component's state changes, React updates the virtual DOM and then compares it with the real DOM to determine the minimum number of changes needed to update the user interface.
3. **Declarative Syntax**: React uses a declarative syntax that makes it easy to describe how the user interface should look based on the application's state. It makes it easier to reason about the application's behaviour and makes it less error-prone.
4. **One-Way Data Binding**: React uses one-way data binding to ensure that the data flows in a single direction from the parent component to the child components. It makes managing the application's state easier and reduces the risk of bugs.
5. **Community and Ecosystem**: React has a large and active community of developers who contribute to the library and create tools and libraries that extend its functionality. It makes finding solutions to common problems easy and getting help when needed.
6. **Performance**: React is fast and efficient, thanks to its virtual DOM and reconciliation algorithm. It makes it suitable for building high-performance web applications.
7. **Server-Side Rendering**: React can be used to render components on the server side, which can improve the performance of web applications by reducing the time it takes to load the initial page.
8. **Mobile Development**: React Native is a framework that allows developers to build mobile applications using React. It makes it easy to build cross-platform mobile applications using the same codebase.
9. **Accessibility**: React has built-in support for accessibility features, such as ARIA attributes and keyboard navigation. It makes it easier to build web applications that are accessible to users with disabilities.
10. **Developer Experience**: React has a rich ecosystem of tools and libraries that make building, testing, and deploying web applications easy. It includes tools like Create React App, React DevTools, and React Testing Library.

---

### React Components

Components are the building blocks of any React application. A React component is a reusable piece of code that defines how a part of the user interface should appear. Components can be nested within other components to allow complex applications to be built out of simple building blocks.

There are two types of components in React:

1. **Functional Components**: Functional components are simple functions that return a React element.
2. **Class Components**: Class components are ES6 classes that extend the `React.Component` class. They have a `render` method that returns a React element.

```jsx
// Functional Component
const Welcome = () => {
  return <h1>Hello, World!</h1>;
};

// Class Component
class Welcome extends React.Component {
  render() {
    return <h1>Hello, World!</h1>;
  }
}
```

---

### React Props

Props are short for properties. They are a way to pass data from parent to child components. Props are read-only and cannot be modified by the child components. Props are passed to components like function arguments.

```jsx
// Parent Component
const App = () => {
  return <Welcome name="John" />;
};

// Child Component
const Welcome = (props) => {
  return <h1>Hello, {props.name}</h1>;
};
```

### State

State is a built-in object in React that is used to contain data that controls the behaviour of a component. The state is mutable and can be changed by the component that owns it. The state is managed within the component and inaccessible from outside the component.

```jsx
// Functional Component
import { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0); // Initial state is 0

  const increment = (amount) => {
    setCount(count + amount); // Increment the count by the given amount
  };

  return (
    <>
            <p>{count}</p>      <button onClick={increment(1)}>
        Increment
      </button>   {" "}
    </>
  );
};

export default Counter;
```

---

### Hooks

You have already seen the `useState` hook in the previous example. Hooks are a new addition in React 16.8 that allows you to use state and other features in functional components. Hooks are functions that let you "hook into" React state and lifecycle features from function components. `useEffect` is another hook that allows you to perform side effects in function components.

```jsx
import { useState, useEffect } from "react";

const RandomProgrammingJoke = () => {
  const [joke, setJoke] = useState(""); // Fetch a random programming joke when the component mounts

  useEffect(() => {
    fetch("https://official-joke-api.appspot.com/jokes/programming/random") // Fetch a random programming joke
      .then((response) => response.json()) // Parse the response as JSON
      .then((data) => setJoke(`${data[0].setup} ${data[0].punchline}`)); // Set the joke
  }, []);

  return <p>{joke}</p>;
};

export default RandomProgrammingJoke;
```

We will see more hooks in the coming weeks.

---

### Conditional Rendering

Conditional rendering is a technique used to render different user interface parts based on certain conditions. You can use JavaScript expressions to render elements in React conditionally.

```jsx
// Parent Component
import Greeting from "./Greeting";

const App = () => {
  const isLoggedIn = true;
  return <Greeting isLoggedIn={isLoggedIn} />;
};

export default App;

// Child Component
const Greeting = (props) => {
  if (props.isLoggedIn) {
    return <h1>Welcome back!</h1>;
  } else {
    return <h1>Please sign up!</h1>;
  }
};

export default Greeting;
```

or you can use the ternary operator:

```jsx
const Greeting = (props) => {
  return props.isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please sign up!</h1>;
};

export default Greeting;
```

---

### Lists and Keys

You can use the `map` method to render a list of items in React. Each item in the list should have a unique `key` prop to help React identify which items have changed, are added, or are removed.

```jsx
// Parent Component
import List from "./List";

const App = () => {
  const items = ["Apple", "Banana", "Cherry"];
  return <List items={items} />;
};

export default App;

// Child Component
const List = (props) => {
  return (
    <ul>
           {" "}
      {props.items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
         {" "}
    </ul>
  );
};
```

---

### Forms

Forms are used to collect user input in React. You can use the `useState` hook to manage the form state and the `onChange` event to update the form state as the user types.

```jsx
// Parent Component
import Form from "./Form";

const App = () => {
  return <Form />;
};

export default App;

// Child Component
import { useState } from "react";

const Form = () => {
  const [name, setName] = useState("");

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Hello, ${name}!`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
 );
};

export default Form;
```

---

### Styling

You can style React components using CSS. You can use inline styles, CSS modules, or CSS-in-JS libraries like styled-components to style your components.

```jsx
// Inline Styles
const styles = {
  color: "red",
  fontSize: "24px",
};

const App = () => {
  return <h1 style={styles}>Hello, World!</h1>;
};

export default App;
```

```jsx
// CSS Modules
import styles from "./App.module.css";

const App = () => {
  return <h1 className={styles.heading}>Hello, World!</h1>;
};

export default App;
```

```jsx
// styled-components
import styled from "styled-components"; // Install styled-components using npm install styled-components

const Heading = styled.h1`
  color: red;
  font-size: 24px;
`;

const App = () => {
  return <Heading>Hello, World!</Heading>;
};

export default App;
```

---

## Formative Assessment

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

---

### Task One

In this task, you will set up a tic-tac-toe game using React.

1. In `src/main.jsx`, remove the following code:

```jsx
import "./index.css";
```

> **Note:** You will use inline styles in this task.

2. Create three new files in the `src` directory: `Board.jsx`, `Square.jsx`, and `Game.jsx`.

3. In `Square.jsx`, create a functional component called `Square` that renders a button element:

```jsx
const Square = (props) => {
  const style = {
    border: "1px solid #000",
    cursor: "pointer",
    fontSize: "30px",
    fontWeight: "800",
    outline: "none",
  };

  return (
    <button style={style} onClick={props.onClick}>
            {props.value}   {" "}
    </button>
  );
};

export default Square;
```

> **Note:** The `Square` component should accept two props: `value` and `onClick`. The `value` prop represents the value of the square (either "X" or "O"), and the `onClick` prop is a function that is called when the square is clicked.

4. In `Board.jsx`, create a class component called `Board` that renders a 3x3 grid of `Square` components:

```jsx
import Square from "./Square";

const Board = (props) => {
  const style = {
    border: "1px solid #000",
    display: "grid",
    gridTemplate: "repeat(3, 1fr) / repeat(3, 1fr)",
    height: "200px",
    width: "200px",
  };

  return (
    <div style={style}>
           {" "}
      {props.squares.map((square, idx) => (
        <Square key={idx} value={square} onClick={() => props.onClick(idx)} />
      ))}
         {" "}
    </div>
  );
};

export default Board;
```

> **Note:** The `Board` component should accept two props: `squares` and `onClick`. The `squares` prop is an array of values representing the state of the board, and the `onClick` prop is a function that is called when a square is clicked.

5. In `Game.jsx`, create a class component called `Game` that manages the state of the game:

```jsx
import { useState } from "react";

import Board from "./Board";

const Game = () => {
  const style = {
    width: "200px",
  };

  const calculateGameState = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let s = 0; s < lines.length; s++) {
      const [a, b, c] = lines[s];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  const winner = calculateGameState(squares);

  const handleClick = (idx) => {
    const squaresCopy = [...squares];
    if (winner || squaresCopy[idx]) return;
    squaresCopy[idx] = xIsNext ? "X" : "O";
    setSquares(squaresCopy);
    setXIsNext(!xIsNext);
  };

  const restartGame = () => {
    setSquares(Array(9).fill(null));
    setGameStarted(true);
  };

  return (
    <>
            {gameStarted && <Board squares={squares} onClick={handleClick} />}   
        <div style={style}>
               {" "}
        {gameStarted && (
          <p>
                       {" "}
            {winner
              ? `Winner: ${winner}`
              : `Next Player: ${xIsNext ? "X" : "O"}`}
                     {" "}
          </p>
        )}
                <button onClick={restartGame}>
                    {gameStarted ? "Restart Game" : "Start Game"}       {" "}
        </button>     {" "}
      </div>   {" "}
    </>
  );
};

export default Game;
```

> **Note:** The `Game` component should manage the state of the game, including the state of the board (`squares`), the current player (`xIsNext`), and whether the game has started (`gameStarted`). It should also implement a `calculateGameState` function that determines the winner of the game.

6. In `App.jsx`, import the `Game` component and render it in the `App` component:

```jsx
import Game from "./components/Game";

const App = () => <Game />;

export default App;
```

7. Start the development server and open your browser to see the tic-tac-toe game in action.

---

### Task Two

Currently, the game does not have a way to determine if the game has ended in a draw. Refactor the `calculateGameState` function in the `Game` component to include a check for a draw. The game should end in a draw if all squares are filled and there is no winner.

---

### Task Three

Implement conditional styling for the `Square` component based on the value of the square. If the square is "X", it should be styled with a red text colour, and if the square is "O", it should be styled with a blue text colour.

---

### Task Four

Implement a feature highlighting the winning squares when a player wins the game. When a player wins, the winning squares should be styled with a green background.

---

### Task Five

Implement a feature that displays the number of wins for each player and the number of draws. The wins and draws should be displayed below the game board.

---

### Task Six

Implement a button allowing players to reset the number of wins and draws.

---

### Task Seven

What happens if you refresh the page? The number of wins and draws will be reset. Implement a feature that persists the number of wins and draws in the browser's local storage. When the page is refreshed, the number of wins and draws should be retrieved from local storage and displayed.

---

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.
