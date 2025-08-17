# Week 05

## Previous Class

Link to the previous class: [Week 04](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/tree/s2-25/lecture-notes/web-development-stream/04-react-query-tanstack-query.md)

---

## Overview

In this class, we will explore design patterns and programming principles that are essential for building scalable and maintainable web applications.

---

## Single Responsibility Principle

The **Single Responsibility Principle (SRP)** states that a component should have only one reason to change. In other words, a class or module should only have one job or responsibility.

Here is an example of a component that violates this principle:

```jsx
const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // Fetches user data
  useEffect(() => {
    fetch("/api/user/1")
      .then((res) => res.json())
      .then(setUser);
  }, []);

  // Fetches posts data
  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  // Renders everything
  return (
    <>
      <h1>{user.firstName} {user.lastName}</h1>
      <p>{user.emailAddress}</p>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
  );
};
```

Here is an example of a component that follows this principle:

```jsx
const UserInfo = (props) => (
  <>
    <h1>
      {props.user.firstName} {props.user.lastName}
    </h1>
    <p>{props.user.emailAddress}</p>
  </>
);

const PostList = (props) => (
  <ul>
    {props.posts.map((post) => (
      <li key={post.id}>{post.title}</li>
    ))}
  </ul>
);

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then(setUser);
  }, []);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  return (
    <>
      <UserInfo user={user} />
      <PostList posts={posts} />
    </>
  );
};
```

---

## Don't Repeat Yourself (DRY)

The **Don't Repeat Yourself (DRY) principle** states that you should avoid duplicating code. Instead, you should abstract and reuse code wherever possible.

Here is an example of code that violates the **DRY principle**:

```jsx
const UserProfile = () => {
  return (
    <>
      <h1>User Profile</h1>
      <p>Details about the user...</p>
    </>
  );
};

const AdminProfile = () => {
  return (
    <>
      <h1>Admin Profile</h1>
      <p>Details about the admin...</p>
    </>
  );
};
```

Here is an example of code that follows the **DRY principle**:

```jsx
const Profile = ({ userType }) => {
  return (
    <>
      <h1>{userType} Profile</h1>
      <p>Details about the {userType.toLowerCase()}...</p>
    </>
  );
};

const App = () => {
  return (
    <>
      <Profile userType="User" />
      <Profile userType="Admin" />
    </>
  );
};
```

---

## Separation of Concerns

**Separation of Concerns (SoC)** is a **design principle** that encourages the separation of an application's concerns into distinct sections, each addressing a specific aspect of the application. For example, components handle the presentation logic, custom hooks handle business logic and services handle API communication.

Example:

```jsx
// API communication
const userService = {
  getUser: () => fetch("/api/user/1").then((res) => res.json()),
};

// Business logic
const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    userService.getUser().then(setUser);
  }, []);

  return user;
};

// Presentation logic
const UserProfile = () => {
  const user = useUser();
  return (
    <>
      <h1>
        {user.firstName} {user.lastName}
      </h1>
      <p>{user.emailAddress}</p>
    </>
  );
};
```

---

## React Design Patterns

1. **Container/Presentational Pattern**: This pattern separates components into two categories: container/smart components which handle state and logic and presentational/dumb components which handle UI rendering.

```jsx
// Container/smart component
const UserContainer = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/user/1")
      .then((res) => res.json())
      .then(setUser);
  }, []);

  return <UserProfile user={user} />;
};

// Presentational/dumb component
const UserProfile = (props) => {
  if (!props.user) return <div>Loading...</div>;
  return (
    <>
      <h1>
        {props.user.firstName} {props.user.lastName}
      </h1>
      <p>{props.user.email}</p>
    </>
  );
};
```

2. **Higher-Order Components (HOCs)**: HOCs are functions that take a component and return a new component with additional props or behavior. They are often used for cross-cutting concerns like authentication, logging or data fetching.

```jsx
const withAuth = (Component) => {
  return (props) => {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
      // Check auth
      setIsAuth(true);
    }, []);

    if (!isAuth) return <p>Please login</p>;
    return <Component {...props} />;
  };
};

const Dashboard = () => <h1>Dashboard</h1>;
const ProtectedDashboard = withAuth(Dashboard);
```

3. **Custom Hooks**: Custom hooks are a way to extract and reuse stateful logic in functional components. They allow you to encapsulate complex logic and share it across multiple components.

```jsx
// Custom hook
const useCounter = (initial = 0) => {
  const [count, setCount] = useState(initial);
  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);
  return { count, increment, decrement };
};

const Counter = () => {
  const { count, increment, decrement } = useCounter(0);
  return (
    <>
      <p>{count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </>
  );
};
```

---

## Anti-Patterns

Here are some common anti-patterns to avoid in **React** development:

1. **Props Drilling**: Passing data through many layers of components can make your code hard to maintain. Consider using state management libraries to avoid this.

```jsx
// Props drilling
const App = () => {
  const user = {
    firstName: "John",
    lastName: "Doe",
    emailAddress: "john.doe@example.com",
  };
  return <Parent user={user} />;
};

const Parent = (props) => <Child user={props.user} />;
const Child = (props) => <GrandChild user={props.user} />;
const GrandChild = (props) => (
  <>
    <h1>
      {props.user.firstName} {props.user.lastName}
    </h1>
    <p>{props.user.emailAddress}</p>
  </>
);
```

2. **State Mutation**: Never mutate state directly. Always use the state updater function returned by `useState` or `setState` to update state.

```jsx
// Direct mutation
const [items, setItems] = useState([1, 2, 3]);
items.push(4); // Don't do this

// Create new array
setItems([...items, 4]);
```

3. **Inline Functions in Render**: Defining functions inside the render method can lead to performance issues. Instead, define functions outside the render method or use `useCallback`.

```jsx
// Inline function
const Component = () => (
  <button onClick={() => console.log("clicked")}>Click me</button>
);

// useCallback
const Component = () => {
  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []);

  return <button onClick={handleClick}>Click me</button>;
};
```

4. **Uncontrolled Components**: Avoid using uncontrolled components when you need to manage form state. Instead, use controlled components with state.

```jsx
// BAD: Uncontrolled
const Form = () => <input ref={inputRef} />;

// GOOD: Controlled
const Form = () => {
  const [value, setValue] = useState("");
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
};
```

---

## Next Class

Link to the next class: [Week 06](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/tree/s2-25/lecture-notes/web-development-stream/06-tailwind-css-shadcn-ui.md)
