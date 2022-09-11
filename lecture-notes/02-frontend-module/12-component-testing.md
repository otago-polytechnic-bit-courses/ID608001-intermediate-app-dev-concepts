# Component Testing

## Preparation

Use the repository from the previous **Formative Assessment**. Create a new branch called `12-playground`. Checkout to the `12-playground` branch and open the repository in **Visual Studio Code**.

---

## Create React App

To get started, run the following commands: 

```bash
npx create-react-app login-form
cd login-form
```

**Resource:** <https://create-react-app.dev>

---

## React Testing Library

**React Testing Library** is a testing library that allows you to test your **React** components. By default, an application created using **Create React App** has **React Testing Library** already installed. If you are not using **Create React App**, you can install the following:

```bash
npm install --save-dev @testing-library/jest-dom @testing-library/react @testing-library/user-event
```

In the `package.json` file, create a new block called `devDependencies`. Cut (<kbd>ctrl</kbd> + <kbd>x</kbd>) `@testing-library/jest-dom`, `@testing-library/react` and `@testing-library/user-event` from the `dependencies` block and paste (<kbd>ctrl</kbd> + <kbd>v</kbd>) them into the `devDependencies` block.

**Resource:** <https://testing-library.com/docs/react-testing-library/intro>

---

## Login Form

In the `root/src` directory of the `login-form` application, create a new directory called `components`.

### src/components/Login.js

**Note:** This is a simple for example.

In the `components` directory, create a new file called `Login.js`. In the `Login.js` file, add the following code:

```jsx
import axios from "axios"; // Make sure to install axios - npm install axios
import { useState } from "react";

const Login = () => {
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
        {isLoading ? "Loading..." : error ? "Unable to fetch data. Please try again later" : user.name}
      </span>
      <form>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button disabled={!username || !password} onClick={handleClick}>Login</button>
      </form>
    </>
  );
};

export default Login;
```

Run the command `npm run start`, then navigate to <http:localhost:3000>.

### src/components/Login.test.js

**Note:** Please read the comments carefully.

In the `components` directory, create a new file called `Login.test.js`. In the `Login.test.js` file, add the following code:

```js
import { fireEvent, render, screen } from "@testing-library/react";
import Login from "./Login";

/**
 * What is happening here?
 *
 * 1. Using the render() function to virtually render the Login component in the testing environment
 * 2. Get the input element by its placeholder attribute
 * 3. Test if the input element exists in the document, i.e., when the Login component is rendered
 */
test("username input should be rendered", () => {
  render(<Login />);
  const usernameInputElement = screen.getByPlaceholderText("Username");
  expect(usernameInputElement).toBeInTheDocument();
});

/**
 * What is happening here?
 *
 * 1. Using the render() function to virtually render the Login component in the testing environment
 * 2. Get the button element by its role
 * 3. Test if the button element exists in the document, i.e., when the Login component is rendered
 */
test("button should be rendered", () => {
  render(<Login />);
  const buttonElement = screen.getByRole("button");
  expect(buttonElement).toBeInTheDocument();
});

/**
 * What is happening here?
 *
 * 1. Using the render() function to virtually render the Login component in the testing environment
 * 2. Get the input element by its placeholder attribute
 * 3. Test if the input element's value is empty
 */
test("username input should be empty", () => {
  render(<Login />);
  const usernameInputElement = screen.getByPlaceholderText("Username");
  expect(usernameInputElement.value).toBe("");
});

/**
 * What is happening here?
 *
 * 1. Using the render() function to virtually render the Login component in the testing environment
 * 2. Get the span element by its data test id attribute
 * 3. Test if the span element's text content is empty
 */
test("error message should not be visible", () => {
  render(<Login />);
  const messageSpanElement = screen.getByTestId("message");
  expect(messageSpanElement).toHaveTextContent("");
});

/**
 * What is happening here?
 *
 * 1. Using the render() function to virtually render the Login component in the testing environment
 * 2. Get the input element by its placeholder attribute
 * 3. Change the input element's value to John Doe
 * 4. Test if the input element's value is John Doe
 */
test("username input should change", () => {
  render(<Login />);
  const usernameInputElement = screen.getByPlaceholderText("Username");
  const usernameValue = "John Doe";
  fireEvent.change(usernameInputElement, { target: { value: usernameValue } });
  expect(usernameInputElement.value).toBe(usernameValue);
});

/**
 * What is happening here?
 *
 * 1. Using the render() function to virtually render the Login component in the testing environment
 * 2. Get the input element by its placeholder attribute
 * 3. Change the input element's value to Pazzw0rd123
 * 4. Test if the input element's value is Pazzw0rd123
 */
test("password input should change", () => {
  render(<Login />);
  const passwordInputElement = screen.getByPlaceholderText("Password");
  const passwordValue = "Pazzw0rd123";
  fireEvent.change(passwordInputElement, { target: { value: passwordValue } });
  expect(passwordInputElement.value).toBe(passwordValue);
});

/**
 * What is happening here?
 *
 * 1. Using the render() function to virtually render the Login component in the testing environment
 * 2. Get the button element by its role
 * 3. Get the input elements by their placeholder attribute
 * 4. Change the input elements' value to John Doe and Pazzw0rd123
 * 5. Test if the button element is not disabled
 */
test("button should not be disabled when username and password inputs exist", () => {
  render(<Login />);
  const buttonElement = screen.getByRole("button");
  const usernameInputElement = screen.getByPlaceholderText("Username");
  const passwordInputElement = screen.getByPlaceholderText("Password");
  const usernameValue = "John Doe";
  const passwordValue = "Pazzw0rd123";
  fireEvent.change(usernameInputElement, { target: { value: usernameValue } });
  fireEvent.change(passwordInputElement, { target: { value: passwordValue } });
  expect(buttonElement).not.toBeDisabled();
});

/**
 * What is happening here?
 *
 * 1. Using the render() function to virtually render the Login component in the testing environment
 * 2. Get the button element by its role
 * 3. Get the span element by its data test id attribute
 * 4. Get the input elements by their placeholder attribute
 * 5. Change the input elements' value to John Doe and Pazzw0rd123
 * 6. Click the button element
 * 7. Test if the span element's text content is Loading...
 */
test("loading should be rendered when click", () => {
  render(<Login />);
  const buttonElement = screen.getByRole("button");
  const messageSpanElement = screen.getByTestId("message");
  const usernameInputElement = screen.getByPlaceholderText("Username");
  const passwordInputElement = screen.getByPlaceholderText("Password");
  const usernameValue = "John Doe";
  const passwordValue = "Pazzw0rd123";
  fireEvent.change(usernameInputElement, { target: { value: usernameValue } });
  fireEvent.change(passwordInputElement, { target: { value: passwordValue } });
  fireEvent.click(buttonElement);
  expect(messageSpanElement).toHaveTextContent("Loading...");
});
```

---

## Formative Assessment

### Task Tahi

If you have not already, implement the code examples above before you move on to **Task Rua**.

### Task Rua

Write **component tests** for the following:

1. Password element exists in the document
2. Password element's value is empty
3. Button element is not disabled
4. Span element's text content is not **Loading...**
5. Span's element's text content is the user's name fetch from the **JSON Placeholder** API

**Note:** You will need to rearrange the order of your tests so that they execute and pass.

Please ensure your **component tests** pass before you move on to **Task Toru**.

## Additional Task

### Task Toru

In the repository's `README.md` file, answer the following questions:

1. What is **Test Driven Development**?
2. What is **Behaviour Driven Development**?

Please reference your sources using **APA 7th Edition** before you move on to the **Code Review**.

### Code Review

Once you have completed all tasks, open a pull request and assign **grayson-orr** as a reviewer. Please do not merge the pull request.
