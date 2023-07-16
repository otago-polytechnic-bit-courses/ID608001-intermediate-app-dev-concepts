# GitHub Workflow

By default, **GitHub Classroom** creates an empty repository. Firstly, you must create a **README** and `.gitignore` file. **GitHub** provides an option for creating new files once the repository is created.

## Create a README

Click on the **Add file** button, then the **Create new file** button. Name your file `README.md` (Markdown), then click on the **Commit new file** button. You should see a new file in your formative assessments repository called `README.md` and the `main` branch.

## Create a .gitignore File

Like before, click on the **Add file** button and then the **Create new file** button. Name your file `.gitignore`. A `.gitignore` template dropdown will appear on the right-hand side of the screen. Select the **Node** `.gitignore` template. Click on the **Commit new file** button. You should see a new file in your formative assessments repository called `.gitignore`.

**Resources:**

- <https://git-scm.com/docs/gitignore>
- <https://github.com/github/gitignore>

## Clone a Repository

Open up **Git Bash** or whatever alternative you see fit on your computer. Clone your formative assessments repository to a location on your computer using the command: `git clone <repository URL>`.

**Resource:**

- <https://git-scm.com/docs/git-clone>

## Create a Local Branch

`cd` into your formative assessments repository and create a branch using the command `git branch <name of the branch>`. Checkout from the `main` branch to the new branch using the command `git checkout <name of the branch>`. Alternatively, you can create and checkout a branch using the command `git checkout -b <name of the branch>`.

For each formative assessment, create a new branch, i.e., branch name `01-formative-assessment`. When you create a new branch, make sure you are creating it from the branch you last worked on.

**Resources:**
- <https://git-scm.com/docs/git-branch>
- <https://git-scm.com/docs/git-checkout>

## Push Local Branch to Remote Repository

Push your local branch, i.e., `01-formative-assessment`, to your remote repository using the command `git push -u origin <name of branch>`. You will continue working on your formative assessment code until you are ready to submit it.

## Create a Pull Request

Once you have completed a formative assessment, create a pull request. Go to your formative assessments repository on GitHub. Click on the **Pull requests** tab, then click on the **New pull request** button. You will see two dropdowns (base and compare). Click the compare dropdown, select the formative assessments branch you want to compare with the `main` branch, and then click the **Create pull request** button.

On the right side of the screen, you will see **Reviewers**. Click on the **Reviewers** section. Add **grayson-orr** as reviewers, then click the **Create pull request** button.

**Grayson** will receive an email. **Grayson** will review your formative assessment code, and you will receive feedback. You may be asked to reflect on your feedback and fix your formative assessment code. You will receive an email when your formative assessment code has been reviewed or approved.

## Commit Message Naming Conventions

You have written many commit messages thus far in your **BIT** degree. However, based on my observations, you could format your messages more concisely, and it only takes a little bit of care. We will discuss a message convention (not a standard) heavily adopted in the industry.

A message is broken down into five components - type, scope (optional), subject, extended description (optional) & footer (optional).

List of types:
* build: build related change, i.e., installing application dependencies.
* chore: change that an end-user will not see, i.e., configuring files for but not limited to code formatting, code linting & version control.
* feat: a new feature or piece of functionality that an end-user will see, i.e., a register or login page.
* fix: a bug fix, i.e. an issue with the register or login page.
* docs: documentation related change, i.e., changing **README.md** file.
* refactor: something that is neither a feat nor fix, i.e., a semantic code change.
* style: style-related change, i.e., formatting a file or piece of code.
* test: an automation test change, i.e., adding a new test file or updating an existing test file.

What is a scope? A noun referring to functionality in your codebase, i.e., authentication. 

Familiarise yourself with this convention, particularly if you are currently enrolled in my courses. However, if you are not, then it is something you should consider adding to your existing **Git** skills & knowledge.

You are probably wondering, how do I write a message using this convention. A **Git** commit looks like this:

```bash
git commit -m "<type> (optional scope): <subject>" -m "<optional extended description>" -m "<optional footer>"
```

Let us see this in action!

Here is a **Git** commit example:

```bash
git commit -m "style (login): format jsx"
```

Here is a **Git** commit example with an extended description & footer:

```bash
git commit -m "style (login): format jsx" -m "additional information" -m "PR Close #12345"
```

When should I use an extended description? When a message is greater than 50 characters. **Note:** This convention is recommended by **GitHub**. However, this can vary from company to company.

What happens if I want view a commit with a specific type? 

```bash
git log --oneline --grep <type>
```

- --oneline - Display the output as one commit per line

Here is a **Git**  log example:

```bash
git log --oneline --grep feat
```

Here is a **Git**  example with multiple types:
 
```bash
git log --oneline --grep "^build\|^feat\|^style"
```

**Resource:** <https://git-scm.com/docs/git-log>

# React

## Create React App

**create-react-app** is a command line tool that helps developers quickly set up a new **React** project with a basic file structure and a development environment to use modern best practices.

**Activity:** Create a new **React** application using **create-react-app**. If you can not remember how to do this off the top of your head, ask **ChatGPT**.

When you run the `npx create-react-app <name of app>` command, it will generate a new directory that includes everything you need to start building a **React** application. This directory includes the following:

- `node_modules/`: This directory contains all of the project's required packages.
- `public/`: This directory contains files that will be publicly accessible such as the `index.html` file, static assets, and the `manifest.json` file.
- `src/`: This directory contains the project's source code files, including subdirectories for components, styles and any other code specific to the application.
- `src/index.js`: This file is the entry point of the app, and it is where the **React** application is rendered.
- `.gitignore`: This file contains a list of files and directories that should be ignored by **Git** when committing changes.
- `package.json`: This file contains metadata about the project, including its dependencies, scripts, and information about its authors and license.
- `README.md`: This file contains documentation about the project.
- `yarn.lock` or `package-lock.json`: This file is automatically generated for any operations where npm modifies either the `node_modules` tree or `package.json`. It describes the exact tree generated, such that subsequent installs can generate identical trees, regardless of intermediate dependency updates.

**Activity:** Find **two** alternatives to **create-react-app**.

## JSX

**JSX** is a syntax extension for **JavaScript** that allows you to write **HTML-like** elements and components in **JavaScript**. It was developed by **Facebook** and is commonly used in **React** and other **JavaScript** libraries and frameworks.

For example, you can use **JSX** to create a simple component like this:

```jsx
// src/components/examples/MyFirstComponent.js
const MyFirstComponent = () => {
  return <p>Hello, World!</p>;
};

export default MyFirstComponent;
```

Here, the **JSX** syntax `<p>Hello, World!</p>` creates a `p` element with the text "Hello, World!" inside of it.

**JSX** is not directly readable by the browser, it needs to be transpiled by a tool like **Babel**, which converts the **JSX** code into regular **JavaScript** that the browser can understand.

**JSX** is an important part of **React's** component-based architecture (more about this soon), as it allows you to describe the structure and content of a component in a declarative and intuitive way. It also makes it easy to pass data and interact with a component's state.

## Components

In **React**, a component is a piece of code that represents a part of a user interface. Components are reusable, meaning they can be used multiple times throughout an application.

In **React**, there are two types of components - function and class. In this course, disregard any examples of class components. A function component (like the `MyComponent` above) is a **JavaScript** function that returns a component's structure and content.

### Lifecycle

In **React**, every component has a **lifecycle** - **mounting**, **updating** and **unmounting**. These **lifecycle** methods are useful because we want to execute a piece of code a specific time. **React** provides a **hook** to create these methods called `useEffect`.

The `useEffect` **hook** is used to perform side-effects, such as fetching data, after the component has rendered.

Here is an example:

```jsx
// src/components/examples/MyLifecycle.js
import { useState, useEffect } from "react";

const MyLifecycle = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.example.com/data")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </>
  );
};

export default MyLifecycle;
```

The `useEffect` arguments are a callback function and dependency array. If the dependency array is empty, then that callback function will only be called once. If the dependency array is not empty, the callback function will be called when a value in the dependency array changes.

Here is an example:

```jsx
// src/components/examples/MyCounterTwo.js
import { useState, useEffect } from "react";

const MyCounterTwo = () => {
  const [increment, setIncrement] = useState(0);
  const [decrement, setDecrement] = useState(0);

  useEffect(() => {
    console.log("componentDidMount");
  }, []);

  useEffect(() => {
    console.log("componentDidUpdate - increment");
  }, [increment]);

  useEffect(() => {
    console.log("componentDidUpdate - decrement");
  }, [decrement]);

  return (
    <>
      <button onClick={() => setIncrement(increment + 1)}>Increment</button>
      <h1>{increment}</h1>
      <button onClick={() => setDecrement(decrement - 1)}>Decrement</button>
      <h1>{decrement}</h1>
    </>
  );
};

export default MyCounterTwo;
```

What about **unmounting**? Here is an example:

```jsx
// src/components/examples/MyUnmount.js
import { useState, useEffect } from "react";

const Child = () => {
  useEffect(() => {
    console.log("componentWillUnmount");
  }, []);

  return (
    <>
      <h1>Child Component</h1>
    </>
  );
};

const Parent = () => {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <>
      <button onClick={() => setIsToggled(!isToggled)}>Toggle Child</button>
      {isToggled ? <Child /> : null}
    </>
  );
};

export default Parent;
```

## Strict Mode

**Strict mode** is a feature that helps you to find potential problems in your application by adding extra checks and warnings to the development version of your app. When a component is rendered in strict mode, **React** will perform additional checks and provide more information when it detects potential issues, such as accidental direct manipulation of the **DOM**, missing unique **keys** on **list** elements, use of deprecated methods, and other common mistakes.

You can enable **strict mode** globally for your entire application by adding a `<React.StrictMode>` component at the root of your application:

```jsx
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Props

A **prop** or **property** is a way of passing data from a **parent** component to a **child** component. A **child** component can access the **prop(s)** passed to it by using the `props` object. For example, if a **parent** component passes a **prop** called "name" to a **child** component, the **child** component can access the value of the "name" **prop** using `props.name`. **Props** are used to make a component more reusable by allowing it to accept different data based on how it is used.

Here is an example of a simple function component that renders a heading:

```jsx
// src/components/examples/MyProps.js
const MyProps = (props) => {
  return <h1>Hello, {props.name}!</h1>;
};

export default MyProps;

// App.js
import MyProps from "./src/components/examples/MyProps";

const App = () => {
  return <MyProps name="John" />
};

export default App;
```

In this example, `MyProps` accepts a **prop** called `name` and renders an `h1` element with the value of `name` passed as the content.

### Fragments

A **fragment** is a way to return multiple elements. **Fragments** let you group list of child without adding extra nodes, i.e., `div` to the **DOM**.

**Fragments** are created using the `<React.Fragment>` component or the shorthand syntax `<>` and `</>` .

```jsx
// using <React.Fragment>
const Example = () => {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
};

// or using shorthand syntax
const AnotherExample = () => {
  return (
    <>
      <ChildA />
      <ChildB />
      <ChildC />
    </>
  );
};
```

**Question:** What happens if you omit the `Fragment` from the example above?

### State

In **React**, **state** can be managed using the `useState` **hook**. The `useState` hook is an in-built **hook** that allows a function to have its own **state**. It takes an initial value as an argument and returns an array with two elements - the current state and a function to update it.

For example, a function component that has a "count" **state** might look like this:

```jsx
// src/components/examples/MyCounter.js
import { useState } from "react";

const MyCounter = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => setCount(count + 1);

  return (
    <>
      <button onClick={handleClick}>You clicked me {count} times</button>;
    </>
  );
};

export default MyCounter;
```

In this example, `count` has an initial **state** of 0, which is passed as an argument to `useState`. The first element of the array returned by `useState` is the current **state** of `count`, and the second element is a function to update `count`. When the `button` is clicked, the `handleClick` function is called, which updates `count` by calling `setCount` and incrementing `count`.

It is important to note that the `useState` **hook** should only be called at the top level of the component, not inside loops or conditions.

**Question:** What does should only be called at the top level of the component mean?

Here are some other examples:

```jsx
// src/components/examples/MyInput.js
import { useState } from "react";

const MyInput = () => {
  const [text, setText] = useState("John Doe");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>You typed: {text}</p>
      <button onClick={() => setText("John Doe")}>Reset</button>
    </>
  );
};

export default MyInput;
```

```jsx
// src/components/examples/MyCheckbox.js
import { useState } from "react";

const MyCheckbox = () => {
  const [liked, setLiked] = useState(true);

  const handleChange = (e) => {
    setLiked(e.target.checked);
  };

  return (
    <>
      <label>
        <input type="checkbox" checked={liked} onChange={handleChange} />I liked
        this
      </label>
      <p>You {liked ? "liked" : "did not like"} this.</p>
    </>
  );
};

export default MyCheckbox;
```

```jsx
// src/components/examples/MyForm.js
import { useState } from "react";

const MyForm = () => {
  const [name, setName] = useState("John Doe");
  const [age, setAge] = useState(50);

  return (
    <>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={() => setAge(age + 1)}>Increment age</button>
      <p>
        Hello, {name}. You are {age}.
      </p>
    </>
  );
};

export default MyForm;
```

**Activity:** For each example above, i.e., `MyInput`, `MyCheckbox` and `MyForm`, explain each line of code.

## Lists and Keys

A **list** is a way to display multiple items in a consistent format. **Lists** are typically created using an array of data and then mapped over to create a list of components for each item.

A **key** is an attribute that **React** uses to identify each item in a **list** and track changes over time. **Keys** help optimise the rendering of **lists** by allowing it to identify which items have changed and to update the corresponding components accordingly. **Keys** should be unique for each item in the **list**.

Here is an example:

```jsx
// src/components/examples/MyProducts.js
const products = [
  { id: 1, name: "Product 1", price: 10.0 },
  { id: 2, name: "Product 2", price: 20.0 },
  { id: 3, name: "Product 3", price: 30.0 },
];

const MyProducts = () => {
  return (
    <>
      {products.map((product) => (
        <Product key={product.id} name={product.name} price={product.price} />
      ))}
    </>
  );
};

export default MyProducts;
```

**Activity:** This example is incomplete. What is missing? Add whatever you feel is necessary to make this example complete.

## Lifting Up State

**Lifting up state** is a technique for managing the **state** of a component that is used by multiple **child** components. When a **child** component needs to change the **state** of a **parent** component, it typically passes a **callback** function as a **prop** to the **child** component, which the **child** component can call to update the **parent's** state. This allows the **parent** component to maintain control over the **state**, and to pass the updated **state** down to the **child** components as `props`.

For example, you have a **parent** component, i.e., `MyProducts`, that renders a list of **child** components, i.e., `Product`, and you want to add a button to each `Product` that allows the user to add the product to a cart. The "cart" is represented as an array called `cart` in the state of `MyProducts`. In this case, you would lift up the **state** by:

1. Defining a callback function in `MyProducts` called `addToCart` that updates `cart`
2. Pass the `addToCart` callback function as a prop to `Product`
3. In `Product`, define an `onClick` event that calls the `addToCart` function, passing in the product's id as an argument

```jsx
// src/components/examples/MyProducts.js
import { useState } from "react";

const products = [
  { id: 1, name: "Product 1", price: 10.0 },
  { id: 2, name: "Product 2", price: 20.0 },
  { id: 3, name: "Product 3", price: 30.0 },
];

const MyProducts = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (productId) => {
    setCart([...cart, productId]);
  };

  return (
    <>
      {products.map((product) => (
        <Product
          key={product.id}
          name={product.name}
          price={product.price}
          addToCart={addToCart}
        />
      ))}
    </>
  );
};

const Product = (props) => {
  return (
    <>
      <h1>
        {props.name} - ${props.price}
      </h1>
      <button onClick={() => props.addToCart(props.product.id)}>
        Add To Cart
      </button>
    </>
  );
};

export default MyProducts;
```

## Typechecking with Prop Types

As your application grows, you can catch bugs and mistakes early in the development process with **typechecking**. The `prop-types` library is a way to check the types of `props` passed to components. To use `prop-types`, you need to install the library, i.e., `npm install prop-types` and import it at the top of your component file. Then, you can define the expected **prop types** using the various validation functions provided by the library, such as `PropTypes.string` or `PropTypes.number`. These validation functions can be added as properties to the component function, usually after the component is defined.

Here is an example:

```jsx
// src/components/examples/MyProps.js
import PropTypes from "prop-types";

const MyProps = (props) => {
  return <h1>Hello, {props.name}!</h1>;
};

MyProps.propTypes = {
  name: PropTypes.string,
};

export default MyProps;
```

# Formative Assessment

Before you start, create a new branch called **01-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

## Task 1

Create a new app called `tic-tac-toe`. In the `src` directory, create a new directory called `components`. In the `components` directory, create three new files called `Square.js`, `Board.js` and `Game.js`.

Use **ChatGPT** to understand the following code:

### src/components/Square.js

In `Square.js`, add the following code:

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
      {props.value}
    </button>
  );
};

export default Square;
```

### src/components/Board.js

In `Board.js`, add the following code:

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
      {props.squares.map((square, idx) => (
        <Square key={idx} value={square} onClick={() => props.onClick(idx)} />
      ))}
    </div>
  );
};

export default Board;
```

### src/utils

In the `src` directory, create a new directory called `utils`. Create a new file called `calculateWinner.js`. In `calculateWinner.js`, add the following code:

```javascript
const calculateWinner = (squares) => {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export default calculateWinner;
```

### src/components/Game.js

In `Game.js`, add the following code:

```jsx
import { useState } from 'react';
import calculateWinner from '../utils/calculateWinner';
import Board from './Board';


const Game = () => {
  const style = {
    width: '200px',
  };

  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(board);

  const handleClick = (idx) => {
    const boardCopy = [...board];
    if (winner || boardCopy[idx]) return;
    boardCopy[idx] = xIsNext ? 'X' : 'O';
    setBoard(boardCopy);
    setXIsNext(!xIsNext);
  };

  const startGame = () => (
    <button onClick={() => setBoard(Array(9).fill(null))}>Start Game</button>
  );

  return (
    <>
      <Board squares={board} onClick={handleClick} />
      <div style={style}>
        <p>
          {winner
            ? `Winner: ${winner}`
            : `Next Player: ${xIsNext ? 'X' : 'O'}`
          }
        </p>
        {startGame()}
      </div>
    </>
  );
};

export default Game;
```

### src/App.js

In `App.js`, replace the existing code with the following code:

```jsx
import Game from "./components/Game";

const App = () => <Game />;

export default App;
```

### Testing

Navigate to <http://localhost:3000> and test the changes.

The screenshot below is an example of an empty board.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/main-s2-23/resources/img/01-react-basics/01-react-basics-1.jpeg?raw=true)

The screenshot below is an example of square set to **X**.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/main-s2-23/resources/img/01-react-basics/01-react-basics-2.jpeg?raw=true)

The screenshot below is an example of the **X** win state.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/main-s2-23/resources/img/01-react-basics/01-react-basics-3.jpeg?raw=true)

The screenshot below is an example of the **O** win state.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/main-s2-23/resources/img/01-react-basics/01-react-basics-4.jpeg?raw=true)

The screenshot below is an example of the draw state.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/main-s2-23/resources/img/01-react-basics/01-react-basics-5.jpeg?raw=true)

## Task 2

Write some code that checks the draw state. Display "Draw" if the draw state is true.

# Formative Assessment Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please don't merge your own pull request.
