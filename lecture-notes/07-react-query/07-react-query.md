# 07: React Query

If you get stuck, a completed version of this project is available in the **exemplar** directory.

## React Query

**React Query** is a library that helps you fetch, cache and update data in your React applications. It is a great alternative to Redux and other state management libraries. It is also a great alternative to the `fetch` API and `axios` for fetching data from APIs.

### Setup

1. To get started, install the library:

```bash
npm install @tanstack/react-query
```

2. In `src/main.jsx`, import the `QueryClientProvider` and `QueryClient` from `@tanstack/react-query`:

```js
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
```

3. Create a new instance of `QueryClient`:

```js
export const queryClient = new QueryClient();
```

4. Wrap the `App` component in the `QueryClientProvider`:

```js
<React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
</React.StrictMode>,
```

### Query Example

In `src/App.jsx`, update the code to the following:

```js
import { queryClient } from "./main";
import { useQuery } from "@tanstack/react-query";

const App = () => {
  const { isLoading, err, data } = useQuery({
    queryKey: ["institutionData"],
    queryFn: () =>
      fetch(
        "https://id607001-graysono-wbnj.onrender.com/api/institutions"
      ).then((res) => res.json()),
  });

  if (isLoading) return "Loading...";
  if (err) return `An error has occurred: ${err.message}`;

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Institution</th>
            <th>Region</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          {data.data.length === 0 ? (
            <tr>
              <td colSpan="3">No data available</td>
            </tr>
          ) : (
            data.data.map((institution) => (
              <tr key={institution.id}>
                <td>{institution.name}</td>
                <td>{institution.region}</td>
                <td>{institution.country}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default App;
```

<ADD IMAGE HERE>

### Developer Tools

1. Install the `react-query-devtools` package:

```bash
npm install @tanstack/react-query-devtools --save-dev
```

2. In `src/main.jsx`, import the `ReactQueryDevtools` component from `@tanstack/react-query-devtools`:

```js
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
```

3. Add the `ReactQueryDevtools` component to the `QueryClientProvider`:

```js
<React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
</React.StrictMode>,
```

<ADD IMAGE HERE>

## Mutation Example

1. In `src/App.jsx`, import the `useMutation` hook from `@tanstack/react-query`:

```js
// ...
import { useQuery, useMutation } from "@tanstack/react-query";
```

2. Using the `useMutation` hook, create a new mutation:

```js
const App = () => {
  // ...
  const postMutation = useMutation({
    mutationFn: (institution) =>
      fetch("https://id607001-graysono-wbnj.onrender.com/api/institutions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(institution),
      }).then((res) => res.json()),
    onSuccess: () => queryClient.invalidateQueries("institutionData"),
  });
  // ...
};
```

**What is a mutation?**

A mutation is a function that performs an asynchronous task. It is similar to a query, but it is used for updating data.

3. Create a new function called `handleSubmit`:

```js
const App = () => {
  // ...
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const institution = Object.fromEntries(formData); // Convert the form data to an object
    postMutation.mutate(institution); // Call the mutation
    e.target.reset(); // Reset the form
  };
  // ...
};
```

4. Declare a `form` element in the `return` statement above the `table` element:

```js
// ...

return (
  <>
    <form onSubmit={handleSubmit}>
      <label for="name">Name</label>
      <input type="text" id="name" name="name" />
      <label for="region">Region</label>
      <input type="text" id="region" name="region" />
      <label for="country">Country</label>
      <input type="text" id="country" name="country" />
      <button type="submit">Submit</button>
    </form>
    {/* // ...  */}
  </>
);
// ...
```

<ADD IMAGE HERE>
