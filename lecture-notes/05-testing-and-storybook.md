# 05: Testing and Storybook

## Testing



## React Testing Library and Jest



To get started, install the following:

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
```

In the root directory, you need to create a new file called `jest.config.js`. The the `jest.config.js` file, add the following:

```js
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testEnvironment: 'jest-environment-jsdom',
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
```
In the `components` directory, create a new file called `LoginTestExample.js`. In the `LoginTestExample.js` file, add the following code:

```js
import axios from "axios"; // Make sure to install axios - npm install axios
import { useState } from "react";

const LoginTestExample = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.get(
        "https://jsonplaceholder.typicode.com/users/1"
      );
      setUser(res.data);
    } catch {
      setError(true);
    }
    setIsLoading(false);
  };

  return (
    <>
      <span data-testid="message">
        {isLoading
          ? "Loading..."
          : error
          ? "Unable to fetch data. Please try again later"
          : user.name}
      </span>
      <form>
        <input
          type="text"
          placeholder="Username"
          value={username}
          data-testid="username-input"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          data-testid="password-input"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          data-testid="button-input"
          disabled={!username || !password}
          onClick={handleClick}
        >
          Login
        </button>
      </form>
    </>
  );
};

export default LoginTestExample;
```

**Note:** Make sure you create a page for this.

In the root directory, create a new file called `LoginTestExample.test.js`. In the `LoginTestExample.test.js` file, add the following code:

```js
import LoginTestExample from "@/components/LoginTestExample";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

/**
 * What is happening here?
 *
 * 1. Using the render() function to virtually render the LoginTestExample component in the testing environment
 * 2. Get the input element by its placeholder attribute
 * 3. Test if the input element exists in the document, i.e., when the LoginTestExample component is rendered
 */
test("username input should be rendered", () => {
  render(<LoginTestExample />);
  const usernameInputElement = screen.getByTestId("username-input");
  expect(usernameInputElement).toBeInTheDocument();
});

/**
 * What is happening here?
 *
 * 1. Using the render() function to virtually render the LoginTestExample component in the testing environment
 * 2. Get the button element by its role
 * 3. Test if the button element exists in the document, i.e., when the LoginTestExample component is rendered
 */
test("button should be rendered", () => {
  render(<LoginTestExample />);
  const buttonElement = screen.getByTestId("button-input");
  expect(buttonElement).toBeInTheDocument();
});

/**
 * What is happening here?
 *
 * 1. Using the render() function to virtually render the LoginTestExample component in the testing environment
 * 2. Get the input element by its placeholder attribute
 * 3. Test if the input element's value is empty
 */
test("username input should be empty", () => {
  render(<LoginTestExample />);
  const usernameInputElement = screen.getByTestId("username-input");
  expect(usernameInputElement.value).toBe("");
});

/**
 * What is happening here?
 *
 * 1. Using the render() function to virtually render the LoginTestExample component in the testing environment
 * 2. Get the span element by its data test id attribute
 * 3. Test if the span element's text content is empty
 */
test("loading should not be visible", () => {
  render(<LoginTestExample />);
  const messageSpanElement = screen.getByTestId("message");
  expect(messageSpanElement).toHaveTextContent("");
});

/**
 * What is happening here?
 *
 * 1. Using the render() function to virtually render the LoginTestExample component in the testing environment
 * 2. Get the input element by its placeholder attribute
 * 3. Change the input element's value to John Doe
 * 4. Test if the input element's value is John Doe
 */
test("username input should change", () => {
  render(<LoginTestExample />);
  const usernameInputElement = screen.getByTestId("username-input");
  const usernameValue = "John Doe";
  fireEvent.change(usernameInputElement, { target: { value: usernameValue } });
  expect(usernameInputElement.value).toBe(usernameValue);
});

/**
 * What is happening here?
 *
 * 1. Using the render() function to virtually render the LoginTestExample component in the testing environment
 * 2. Get the input element by its placeholder attribute
 * 3. Change the input element's value to Pazzw0rd123
 * 4. Test if the input element's value is Pazzw0rd123
 */
test("password input should change", () => {
  render(<LoginTestExample />);
  const passwordInputElement = screen.getByTestId("password-input");
  const passwordValue = "Pazzw0rd123";
  fireEvent.change(passwordInputElement, { target: { value: passwordValue } });
  expect(passwordInputElement.value).toBe(passwordValue);
});

/**
 * What is happening here?
 *
 * 1. Using the render() function to virtually render the LoginTestExample component in the testing environment
 * 2. Get the button element by its role
 * 3. Get the input elements by their placeholder attribute
 * 4. Change the input elements' value to John Doe and Pazzw0rd123
 * 5. Test if the button element is not disabled
 */
test("button should not be disabled when username and password input changes", () => {
  render(<LoginTestExample />);
  const buttonElement = screen.getByTestId("button-input");
  const usernameInputElement = screen.getByTestId("username-input");
  const passwordInputElement = screen.getByTestId("password-input");
  const usernameValue = "John Doe";
  const passwordValue = "Pazzw0rd123";
  fireEvent.change(usernameInputElement, { target: { value: usernameValue } });
  fireEvent.change(passwordInputElement, { target: { value: passwordValue } });
  expect(buttonElement).not.toBeDisabled();
});

/**
 * What is happening here?
 *
 * 1. Using the render() function to virtually render the LoginTestExample component in the testing environment
 * 2. Get the button element by its role
 * 3. Get the span element by its data test id attribute
 * 4. Get the input elements by their placeholder attribute
 * 5. Change the input elements' value to John Doe and Pazzw0rd123
 * 6. Click the button element
 * 7. Test if the span element's text content is Loading...
 */
test("loading should be rendered when click", () => {
  render(<LoginTestExample />);
  const buttonElement = screen.getByTestId("button-input");
  const messageSpanElement = screen.getByTestId("message");
  const usernameInputElement = screen.getByTestId("username-input");
  const passwordInputElement = screen.getByTestId("password-input");
  const usernameValue = "John Doe";
  const passwordValue = "Pazzw0rd123";
  fireEvent.change(usernameInputElement, { target: { value: usernameValue } });
  fireEvent.change(passwordInputElement, { target: { value: passwordValue } });
  fireEvent.click(buttonElement);
  expect(messageSpanElement).toHaveTextContent("Loading...");
});
```

Lastly, you will need to add the following `script` in the `package.json` file:

```js
"test": "jest --watch"
```

To run your tests, run the following command:

```bash
npm run test
```

**Resource:** https://nextjs.org/docs/testing 

### User Acceptance Testing

## Storybook

**Storybook** is a UI development tool that allows you develop your component outside your application and in an isolated environment.

**Resource:** <https://storybook.js.org/>

### Install

There are a few dependencies that you will need to install. To get started, run the following command:

```bash
npx storybook init
```

You will be prompt to proceed. You may be prompt twice. One for **ESLint** and the other for **npm**. Choose **no** for both.

In the `package.json` file, note all the changes, i.e., `storybook` and `build-storybook` scripts and `devDependencies` block. Also, it will create a `.storybook` and `stories` directory in the `root` directory.

In the `stories` directory, remove all files and directories.

### stories/Button.js

In the `stories` directory, create a new file called `Button.js`. In the `Button.js` file, add the following code:

```jsx
import PropTypes from "prop-types";

const Button = (props) => {
  let scale = 0.0;
  if (props.size === "sm") scale = 1.0;
  else if (props.size === "md") scale = 2.0;
  else scale = 3.0;

  const style = {
    color: props.color,
    backgroundColor: props.backgroundColor,
    padding: `${scale * 0.5}rem ${scale * 1}rem`,
    border: "none",
  };

  return (
    <button onClick={props.handleClick} style={style}>
      {props.textContent}
    </button>
  );
};

Button.propTypes = {
  textContent: PropTypes.string,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  handleClick: PropTypes.func,
};

export default Button;
```

### stories/Button.stories.js

**Note:** Please read the comments carefully.

In the `components` directory, create a new file called `Button.stories.js`. In the `Button.stories.js` file, add the following code:

```js
import Button from "./Button";

// This determines where this story goes in the story list
export default {
    title: "Components/Button", // The title prop is optional
    component: Button,
    argTypes: { handleClick: { action: "handleClick" } },
};

// Create a template of how args map to rendering
const Template = (args) => <Button {...args} />

/** 
 * A technique for making a copy of a function, i.e., Template. You use
 * this technique to allow each exported story to set it own properties,
 * but use the same implementation
 */
export const Red = Template.bind({})
Red.args = {
  backgroundColor: "#ff0000",
  textContent: "Click Me!",
  size: "sm",
};

export const Green = Template.bind({});
Green.args = {
  backgroundColor: "#00ff00",
  textContent: "Click Me!",
  size: "md",
};

export const Blue = Template.bind({});
Blue.args = {
  backgroundColor: "#0000ff",
  textContent: "Click Me!",
  size: "lg",
};
```

To open **Storybook**, run the following command:

```bash
npm run storybook
```

Navigate to <http://localhost:6006>.

The screenshot below is an example of the red `Button` component. **Note:** You can adjust the various properties.

<img src="../../resources/img/05-storybook/05-storybook-2.jpeg" width="550" height="650" />

The screenshot below is an example of the green `Button` component. 

<img src="../../resources/img/05-storybook/05-storybook-3.jpeg" width="550" height="650" />

The screenshot below is an example of the blue `Button` component. 

<img src="../../resources/img/05-storybook/05-storybook-4.jpeg" width="550" height="650" />

# Formative Assessment

Before you start, create a new branch called **04-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

### Task Tahi

### Task Rua

### Task Toru

# Formative Assessment Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please don't merge your own pull request.

