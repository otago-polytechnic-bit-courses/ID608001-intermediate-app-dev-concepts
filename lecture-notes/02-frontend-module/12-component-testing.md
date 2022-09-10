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

---

## Login Form

In the `root/src` directory of the `login-form` application, create a new directory called `components`.

### src/components/Login.js

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

### src/components/Login.test.js

In the `components` directory, create a new file called `Login.test.js`. In the `Login.test.js` file, add the following code:

```js
import { fireEvent, render, screen } from "@testing-library/react";
import Login from "./Login";

test("username input should be rendered", () => {
  render(<Login />);
  const usernameInputElement = screen.getByPlaceholderText("Username");
  expect(usernameInputElement).toBeInTheDocument();
});

test("button should be rendered", () => {
  render(<Login />);
  const buttonElement = screen.getByRole("button");
  expect(buttonElement).toBeInTheDocument();
});

test("username input should be empty", () => {
  render(<Login />);
  const usernameInputElement = screen.getByPlaceholderText("Username");
  expect(usernameInputElement.value).toBe("");
});

test("error message should not be visible", () => {
  render(<Login />);
  const messageSpanElement = screen.getByTestId("message");
  expect(messageSpanElement).toHaveTextContent("");
});

test("username input should change", () => {
  render(<Login />);
  const usernameInputElement = screen.getByPlaceholderText("Username");
  const usernameValue = "John Doe";
  fireEvent.change(usernameInputElement, { target: { value: usernameValue } });
  expect(usernameInputElement.value).toBe(usernameValue);
});

test("password input should change", () => {
  render(<Login />);
  const passwordInputElement = screen.getByPlaceholderText("Password");
  const passwordValue = "Pazzw0rd123";
  fireEvent.change(passwordInputElement, { target: { value: passwordValue } });
  expect(passwordInputElement.value).toBe(passwordValue);
});

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

### Code Review

Once you have completed all tasks, open a pull request and assign **grayson-orr** as a reviewer. Please do not merge the pull request.
