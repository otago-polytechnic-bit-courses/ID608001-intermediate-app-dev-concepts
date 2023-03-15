# 05: Testing and Storybook

## Testing



## React Testing Library and Jest

**React Testing Library** and **Jest** are testing libraries that allows you to test your **React** components. By default, an application created using **Create React App** has **React Testing Library** and **Jest** already installed. However, in **Next.js** you need to set this up manually.

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
