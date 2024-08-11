# Week 04

## Before We Start

Open your **s2-24-intermediate-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-04-formative-assessment** from **week-03-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Read the comments in the code examples. It will help you understand where to type the code. Also, some code examples may show **TypeScript** warnings.

---

## Create a New Vite Project

1. Create a new project using **Create Vite App**:

```bash
npm init vite@latest
```

2. When prompted, select the following options:

- Project name: **week-04-formative-assessment**
- Framework: **React**
- Variant: **TypeScript + SWC**

3. Change into the project directory:

```bash
cd week-04-formative-assessment
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

## React Query

**React Query** is a library that helps you fetch, cache and update data in your React applications. It is a great alternative to Redux and other state management libraries. It is also a great alternative to the `fetch` API and `axios` for fetching data from APIs.

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
</StrictMode>,
```

---

### Query Example

In `src/App.tsx`, update the code to the following:

```js
import { useQuery } from "@tanstack/react-query";

const App = () => {
  const { isLoading, data: institutionData } = useQuery({
    queryKey: ["institutionData"],
    queryFn: () =>
      fetch(
        "https://s2-24-intro-app-dev-repo-grayson-orr.onrender.com/api/institutions"
      ).then((res) => res.json()),
  });

  if (isLoading) return "Loading...";

  return (
    <>
      {institutionData.data.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Institution</th>
              <th>Region</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {institutionData.data.map((institution) => (
              <tr key={institution.id}>
                <td>{institution.name}</td>
                <td>{institution.region}</td>
                <td>{institution.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {institutionData.data.length === 0 && <p>No data available.</p>}
    </>
  );
};

export default App;
```

In the browser, you should see the following:

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/main-s2-24/resources/img/08-react-query/08-react-query-1.jpeg?raw=true)

### Developer Tools

1. Install the `react-query-devtools` package:

```bash
npm install @tanstack/react-query-devtools --save-dev
```

2. In `src/main.tsx`, import the `ReactQueryDevtools` component from `@tanstack/react-query-devtools`:

```js
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
```

3. Add the `ReactQueryDevtools` component to the `QueryClientProvider`:

```js
<StrictMode>
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
</StrictMode>
```

Click on the icon in the bottom right corner to open the developer tools.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/main-s2-24/resources/img/08-react-query/08-react-query-2.jpeg?raw=true)

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/main-s2-24/resources/img/08-react-query/08-react-query-3.jpeg?raw=true)

## Mutation Example

1. In `src/App.tsx`, import the `useMutation` hook from `@tanstack/react-query` and `queryClient` from `src/main.tsx`:

```js
import { useQuery, useMutation } from "@tanstack/react-query";

import { queryClient } from "./main";
```

2. Using the `useMutation` hook, create a new mutation:

```js
const App = () => {
  // ...
  const { mutate: postInstitutionMutation, data: postInstitutionData } =
    useMutation({
      mutationFn: (institution) =>
        fetch(
          "https://s2-24-intro-app-dev-repo-grayson-orr.onrender.com/api/institutions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: institution.name,
              region: institution.region,
              country: institution.country,
            }),
          }
        ).then((res) => res.json()),
      onSuccess: () => queryClient.invalidateQueries("institutionData"),
    });
  // ...
};

export default App;
```

**What is a mutation?**

A mutation is a function that performs an asynchronous task. It is similar to a query, but it is used for updating data.

3. We are going to use `react-hook-form` to handle the form. Install the package:

```bash
npm install react-hook-form
```

`react-hook-form` is a library that helps you create forms in React. It is a great alternative to `Formik` and other form libraries.

4. Declare the `useForm` hook from `react-hook-form`:

```js
// ...
import { useForm } from "react-hook-form";
// ...
const App = () => {
  const institutionForm = useForm();
  // ...
};

export default App;
```

5. Create a new function called `handleInstitutionSubmit`:

```js
const App = () => {
  // ...
  const handleInstitutionSubmit = (values) => postInstitutionMutation(values);
  // ...
};
```

6. Update the `then()` method with the following:

```js
const App = () => {
  // ...
  const { mutate: postInstitutionMutation } =
    useMutation({
      mutationFn: (institution) =>
        fetch(
          "https://s2-24-intro-app-dev-repo-grayson-orr.onrender.com/api/institutions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: institution.name,
              region: institution.region,
              country: institution.country,
            }),
          }
        ).then((res) => {
          if (res.status === 201) {
            institutionForm.reset((formValues) => ({
              ...formValues,
              name: "",
              region: "",
              country: "",
            }));
          }
          return res.json();
        }),
      onSuccess: () => queryClient.invalidateQueries("institutionData"),
    });
  // ...
};

export default App;
```

7. Declare a `form` element in the `return` statement above the `table` element:

```js
// ...
return (
  <>
    <form onSubmit={institutionForm.handleSubmit(handleInstitutionSubmit)}>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        id="name"
        {...institutionForm.register("name")}
      />
      <label htmlFor="region">Region</label>
      <input
        type="text"
        id="region"
        {...institutionForm.register("region")}
      />
      <label htmlFor="country">Country</label>
      <input
        type="text"
        id="country"
        {...institutionForm.register("country")}
      />
      <button type="submit">Submit</button>
    </form>
    {/* // ...  */}
  </>
);
// ...
```

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/main-s2-24/resources/img/08-react-query/08-react-query-4.jpeg)

---

## Formative Assessment

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

---

### Task One

Convert the `App` components to use TypeScript.

---

### Task Two - DELETE Mutation (Research)

Create a new mutation that deletes an institution. The mutation should take an `id` as an argument and should invalidate the `institutionData` query upon success. For each table row, add a **Delete** button that calls the mutation when clicked.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/main-s1-24/resources/img/08-react-query/formative-assessment/08-react-query-formative-assessment-1.jpeg)

---

### Task Three - PUT Mutation (Research)

Create a new mutation that updates an institution. The mutation should take an `institution` as an argument and should invalidate the institutionData query upon success. For each table row, add an **Edit** button that populates the form with the institution's data when clicked. When the form is submitted, the mutation should be called.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/main-s1-24/resources/img/08-react-query/formative-assessment/08-react-query-formative-assessment-2.jpeg)


---

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.
