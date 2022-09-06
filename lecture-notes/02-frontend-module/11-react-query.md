# 11: React Query

https://api.nasa.gov/

https://api.nasa.gov/planetary/apod?api_key=3Q6v9kGXsocmqCOxzXX9M21BsVmj0qb5QlzP95dI

https://www.youtube.com/watch?v=NQULKpW6hK4e

# 11: React Query

**React** does not have an opinionated way of fetching data. Usually, you will use the `useState()` and `useEffect()` hooks. For example:

```jsx
import axios from "axios";
import { useEffect, useState } from "react";

const Post = () => {
  const [post, setPost] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const getPosts = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        "https://jsonplaceholder.typicode.com/posts/1"
      );
      setPost(res.data);
      setIsLoading(false);
    } catch (err) {
      setError(false);
    }
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

What if I told you there is a way to fetch data without having to worry about using the 

```bash
npm install react-query
```

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

