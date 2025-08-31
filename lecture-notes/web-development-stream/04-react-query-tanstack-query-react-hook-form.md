# Week 04

## Previous Class

Link to the previous class: [Week 03](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/tree/s2-25/lecture-notes/web-development-stream/03-state-management.md)

---

## Before We Start

Open your repository in **Visual Studio Code**. Create a new branch called **week-04-react-query-tanstack-query-react-hook-form**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Read the comments in the code examples. It will help you understand where to type the code. Also, some code examples may show **TypeScript** warnings.

---

## Create a New Vite Project

1. Create a new project using **Create Vite App**:

```bash
npm init vite@latest
```

2. When prompted, select the following options:

- Project name: **week-04-react-query-tanstack-query-react-hook-form**
- Framework: **React**
- Variant: **TypeScript + SWC**

3. Change into the project directory:

```bash
cd week-04-react-query-tanstack-query-react-hook-form
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

## React Query/Tanstack Query

**React Query** or **Tanstack Query** is a library that helps you fetch, cache and update data in your React applications. It is a great alternative to Redux and other state management libraries. It is also a great alternative to the `fetch` API and `axios` for fetching data from APIs.

---

### Setup

1. To get started, install the library:

```bash
npm install @tanstack/react-query
```

2. In `src/main.tsx`, import the `QueryClientProvider` and `QueryClient` from `@tanstack/react-query`:

```js
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
```

3. Create a new instance of `QueryClient`:

```js
export const queryClient = new QueryClient();
```

4. Wrap the `App` component in the `QueryClientProvider`:

```js
<StrictMode>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
</StrictMode>
```

---

### Query Example

In `src/App.tsx`, update the code to the following:

```js
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const App = () => {
  const [users, setUsers] = useState([]); 

  const { isLoading, error, data } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/users").then((res) =>
        res.json()
      ),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>City</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {(data ?? []).map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.address.city}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default App;
```

Open your browser and navigate to <http://localhost:5173>. You should see a table with the users' data.

> **Note:** The **JSON Placeholder API** does not persist data. If you refresh the page, the data will be fetched again from the API.

---

## Mutation Example

1. In `src/App.tsx`, import the `useMutation` hook from `@tanstack/react-query` and `queryClient` from `src/main.tsx`:

```js
// ...
import { useQuery, useMutation } from "@tanstack/react-query";

import { queryClient } from "./main";
```

2. Using the `useMutation` hook, create a new mutation:

```js
const App = () => {
  // ...
  const postMutation = useMutation({
    mutationFn: (user) =>
      fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      }).then((res) => res.json()),
    onSuccess: (newUser) => {
      queryClient.setQueryData(["users"], (oldUsers = []) => [
        ...oldUsers,
        newUser,
      ]);
    },
  });
  // ...
};

export default App;
```

**What is a mutation?**

A mutation is a function that performs an asynchronous task. It is similar to a query, but it is used for updating data.

---

## React Hook Form

1. We are going to use `react-hook-form` to handle the form. Install the package:

```bash
npm install react-hook-form
```

`react-hook-form` (RHF) is a library that helps you create forms in React. It is a great alternative to `Formik` and other form libraries.

What is the difference between `react-hook-form` and normal form?

- RHF uses uncontrolled components, which means you do not need to use `useState` to manage the form state. Instead of using `value` and `onChange`, you can use the `register` function to register the form fields.
- RHF is more performant than normal forms because it does not re-render the entire form when the form state changes.

2. Declare the `useForm` hook from `react-hook-form`:

```js
// ...
import { useForm } from "react-hook-form";
// ...
const App = () => {
  // ...
  const userForm = useForm();
  const { reset, handleSubmit, register } = userForm;
  // ...
};

export default App;
```

3. Create a new function called `handleSubmitForm`:

```js
const App = () => {
  // ...
  const handleSubmitForm = (user) => {
    if (user.id) {
      // Update mutation logic will go here
    } else {
      postMutation.mutate(user);
    }
  };
  // ...
};
```

4. Update the `postMutation` method so that the form resets on success:

```js
const postMutation = useMutation({
  mutationFn: (user) =>
    // ...
  onSuccess: (newUser) => {
    // ...
    reset(); 
  },
});
```

5. Declare a `form` element in the `return` statement above the `table` element:

```js
// ...
return (
  <>
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <label htmlFor="name">Name</label>
      <input type="text" id="name" {...register("name")} />
      <label htmlFor="city">City</label>
      <input type="text" id="city" {...register("address.city")} />
      <label htmlFor="email">Email</label>
      <input type="text" id="email" {...register("email")} />
      <button type="submit">Submit</button>
    </form>
    {/* // ...  */}
  </>
);
// ...
```

---

## Exercises

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

---

### Task One - DELETE Mutation 

Create a new mutation that deletes a user. The mutation should take an `id` as an argument and should invalidate the `users` query upon success. For each table row, add a **Delete** button that calls the mutation when clicked.

---

### Task Two - PUT Mutation 

Create a new mutation that updates a user. The mutation should take a user object as an argument and should invalidate the `users` query upon success. For each table row, add an **Edit** button that populates the form with the user's data when clicked.

--- 

## Independent Research

In this section, you will independently research concepts covered in the course.

---

### Task One

**Zod** is a **TypeScript**-first schema declaration and validation library. It is used to validate data in **TypeScript** applications. It is a great alternative to `Yup` and other validation libraries.

Research how to use **Zod** with **React Hook Form** to validate the form fields.

> **Resource:** [Zod Documentation](https://zod.dev/)

---

## Next Class

Link to the next class: [Week 05](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/tree/s2-25/lecture-notes/web-development-stream/05-design-patterns-programming-principles.md)
