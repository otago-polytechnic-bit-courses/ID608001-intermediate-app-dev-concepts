# Week 06

## Previous Class

Link to the previous class: [Week 06](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/tree/s2-25/lecture-notes/web-development-stream/06-tailwind-css-shadcn-ui.md)

---

## Before We Start

Open your repository in **Visual Studio Code**. Create a new branch called **week-07-routing**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Read the comments in the code examples. It will help you understand where to type the code. Also, some code examples may show **TypeScript** warnings.

---

## Create a New Vite Project

1. Create a new project using **Create Vite App**:

```bash
npm init vite@latest
```

2. When prompted, select the following options:

- Project name: **week-07-routing**
- Framework: **React**
- Variant: **TypeScript + SWC**

3. Change into the project directory:

```bash
cd week-07-routing
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

## Routing

**Routing** is the process of determining the URL to which the user should be redirected based on the user's actions. **React Router** is a popular library for handling routing in **React** applications.

---

## React Router

**React Router** is a collection of navigational components that compose declaratively with your application. It allows you to manage the URL and navigate between different views in your **React** application.

---

### Installation

Install **React Router** using the following command:

```bash
npm install react-router
```

---

### Main File

In the `main.tsx` file, update the code to the following:

```tsx
// Omitted for brevity
import { BrowserRouter, Routes, Route } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
```

There are a few things to note in the code above:

- Import the `BrowserRouter`, `Routes`, and `Route` components from `react-router`.
- Wrap the `App` component in the `Route` component and specify the path as `/`. This means that the `App` component will be rendered when the URL matches `/`.
- Wrap the `Routes` component in the `BrowserRouter` component. This provides the routing functionality to the application.

What happens if you navigate to a different URL? Try navigating to a different URL and see what happens.

---

### Nested Routes

**React Router** supports nested routes. This means that you can have routes within routes. This is useful for creating complex layouts and views in your application.

> **Note:** The code examples below assume that you have already created the components for `Dashboard`, `Home`, and `Settings`.

In the `main.tsx` file, update the code to the following:

```tsx
// Omitted for brevity

import Dashboard from "./components/Dashboard.tsx";
import Home from "./components/Home.tsx";
import Settings from "./components/Settings.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
```

In the `Dashboard` component, you can use the `Outlet` component to render the nested routes:

```tsx
import { Outlet } from "react-router";

const Dashboard = () => {
  return (
    <>
      <h1>Dashboard</h1>
      <Outlet />
    </>
  );
};

export default Dashboard;
```

Now, when you navigate to `/dashboard` or `/dashboard/settings`, the `Dashboard` component will be rendered along with the nested routes.

---

### Dynamic Routes

**React Router** supports dynamic routes, which allow you to pass parameters in the URL and use those parameters to render different components or data.

In the `main.tsx` file, update the code to the following:

```tsx
// Omitted for brevity

import User from "./components/User.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Omitted for brevity */}
        <Route path="user/:id" element={<User />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
```

In the `User` component, you can access the `id` parameter from the URL using the `useParams` hook:

```tsx
import { useParams } from "react-router";

const User = () => {
  const { id } = useParams();

  return (
    <>
      <h1>User ID: {id}</h1>
    </>
  );
};

export default User;
```

Now, when you navigate to `/user/1`, the `User` component will be rendered with the `id` parameter set to `1`.

---

### Linking

**React Router** provides the `Link` and `NavLink` components to create links between different routes in your application. These components handle the navigation without causing a full page reload.

In the `App` component, update the code to the following:

```tsx
import { Link, NavLink } from "react-router";

const App = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="dashboard">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="user/1">User 1</NavLink>
          </li>
        </ul>
        <Link to="dashboard/settings">Go to Dashboard Settings</Link>
      </nav>
    </>
  );
};

export default App;
```

The `NavLink` component creates a link to the specified route. When you click on the link, the URL will change, and the corresponding component will be rendered.

---

### 404 Page

**React Router** allows you to create a 404 page that will be rendered when the URL does not match any of the defined routes. This is useful for handling unknown routes and providing a fallback page.

In the `main.tsx` file, update the code to the following:

```tsx
// Omitted for brevity

import NotFound from "./components/NotFound.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        {/* Omitted for brevity */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
``` 

> **Note:** Declare the `Route` component for the 404 page before the other routes.

In the `NotFound` component, you can display a message indicating that the page was not found:

```tsx
const NotFound = () => {
  return (
    <>
      <h1>404 - Page Not Found</h1>
    </>
  );
};

export default NotFound;
```

Now, when you navigate to a URL that does not match any of the defined routes, the `NotFound` component will be rendered.

---

## Exercises

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository `README.md` file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

---

### Task One

Using **Tailwind CSS**, **Shadcn UI** and **React Router**, create a simple web application that displays a list of items. The application should have the following features:

- A home page that displays a list of items
- A details page that displays more information about a selected item
- A contact page that displays contact information
- A 404 page that is displayed when the URL does not match any of the defined routes
- A navigation menu that allows the user to navigate between the different pages

---

## Next Class

Link to the next class: [Week 08](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/tree/s2-25/lecture-notes/web-development-stream/08-env-variables-vercel-micro-frontends.md)
