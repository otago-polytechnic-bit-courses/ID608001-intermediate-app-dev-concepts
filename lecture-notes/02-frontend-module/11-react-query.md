# 11: React Query

## Preparation

Use the repository from the previous **Formative Assessment**. Create a new branch called `11-playground`. Checkout to the `11-playground` branch and open the repository in **Visual Studio Code**.

---

## Create React App

To get started, run the following commands: 

```bash
npx create-react-app post
cd posts
```

**Resource:** <https://create-react-app.dev>

---

## React Query

**React** does not have an opinionated way of fetching data. Usually, you will use the `useState()` and `useEffect()` hooks. 

---

## Posts

In the `root/src` directory of the `post` application, create a new directory called `components`.

### src/components/Post.js

In the `components` directory, create a new file called `Post.js`. In the `Post.js` file, add the following code:

```jsx
import axios from "axios";
import { useEffect, useState } from "react";

const Post = () => {
  const [post, setPost] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const getPosts = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        "https://jsonplaceholder.typicode.com/posts/1"
      );
      setPost(res.data);
    } catch (err) {
      setError(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

  if (isLoading) return <h1>Loading...</h1>;

  if (error) return <h1>Unable to fetch data. Please try again later</h1>;

  const { title, body } = post;

  return (
    <>
      <h1>{title}</h1>
      <p>{body}</p>
    </>
  );
};

export default Post;
```

```jsx
import Post from "./components/Post";

const App = () => {
  return (
    <>
      <Post />
    </>
  );
};

export default App;
```

What if I told you there is a way to fetch data without having to worry about using the `useState()` and `useEffect()` hooks. This is where **React Query** comes in. To get started, run the command: 

```bash
npm install react-query
```

### App.js

Refactor the `App.js` file as follows:

```jsx
import { QueryClientProvider, QueryClient } from "react-query";
import Post from "./components/Post";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Post />
    </QueryClientProvider>
  );
};

export default App;
```

**What is going on here:**

- Importing `QueryClientProvider` and `QueryClient` from `react-query`. The `QueryClientProvider` component is used to connect a `QueryClient` to your application. 
- Create a new instance of `QueryClient`. **Note:** It can used to interact with a cache.
- Set the `QueryClientProvider` component's `client` prop value to the new instance of `QueryClient`.

**Resources:**

- <https://react-query-v3.tanstack.com/reference/QueryClientProvider>
- <https://react-query-v3.tanstack.com/reference/QueryClient>

### src/components/Post.js

Refactor the `Post.js` file as follows:

```jsx
import axios from "axios";
import { useQuery } from "react-query";

const Post = () => {
  const { isLoading, error, data } = useQuery('post', async () => {
    return await axios.get(
      "https://jsonplaceholder.typicode.com/posts/1"
    );
  });

  if (isLoading) return <h1>Loading...</h1>

  if (error) return <h1>Unable to fetch data. Please try again later</h1>

  const { title, body } = data.data;

  return (
    <>
      <h1>{title}</h1>
      <p>{body}</p>
    </>
  );
};

export default Post;
```

**What is going on here:**

- Importing `useQuery` from `react-query`. This return variables such as `isLoading`, `error` and `data`.
- Calling the `useQuery()` hook which accepts two arguments - key, i.e., 'post' and callback, i.e., a `GET` request to the **JSON Placeholder API**.
- Using the `isLoading`, `error` and `data` variables return by the `useQuery()` hook.

**Resource:** <https://react-query-v3.tanstack.com/reference/useQuery>

---

## Formative Assessment

### Task Tahi

If you have not already, implement the code examples above before you move on to **Task Rua**.

### Task Rua

In the repository's `README.md` file, answer the following question:

1. What are two other ways you can use **React Query**?

Please reference your sources using **APA 7th Edition** before you move on to **Task Toru**.

### Task Toru

Using the **NASA API**, display 25 photos of the **Mars Rover**. **Note:** To use the **NASA API**, you will have to generate an **API key**. Test the changes before you move on to the **Code Review**.

### Code Review

Once you have completed all tasks, open a pull request and assign **grayson-orr** as a reviewer. Please do not merge the pull request.
