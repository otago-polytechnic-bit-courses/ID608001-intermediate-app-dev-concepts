# 03: Styling

## CSS Modules

**CSS Modules** are a way to write **CSS** styles that are scoped to a specific component rather than having global styles that may accidentally affect other elements in the application.

**CSS Modules** work by automatically generating unique class names based on the component's file name. This way, styles defined in one component will not affect other components, even if they have the same class name.

When you use **CSS Modules**, you will need to use the `.module.css` file extension instead of the regular `.css` extension. You can then import the **CSS** styles into your component using the import statement and use the class names in your **JSX**.

Here is an example:

```jsx
// src/components/examples/MyCSSModules.js
import styles from "./MyCSSModules.module.css";

const MyCSSModules = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.text}>Hello, World!</h1>
    </div>
  );
};

export default MyCSSModules;
```

```css
/* src/components/examples/MyCSSModules.module.css */
.container {
  background-color: #ff00ff;
  padding: 20px;
}

.text {
  font-size: 18px;
  color: #00ff00;
}
```

In this example, `MyCSSModules` uses two class names from the styles object imported from `MyCSSModules.module.css`. These class names are locally scoped to the `MyCSSModules`.

## Styled Components

`styled-components` is a library that allows you to write **CSS** styles in **JavaScript**. It uses a technique called "tagged template literals" to create a component that has the styles attached to it. It allows you to create and use your own custom components that are already styled, rather than having to add class names to existing **HTML** elements.

For example, you can use the styled function from the library to create a `Button` that has its own styles:

```jsx
import styled from "styled-components";

const Button = styled.button`
  background-color: blue;
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
`;
```

You can then use this `Button` component in your **JSX** like any other component:

```jsx
<Button>Click me</Button>
```

`styled-components` also provides a way to pass `props` to the component and use them in the styling, this way you can have dynamic styling.

```jsx
const Button = styled.button`
  background-color: ${(props) => (props.primary ? "blue" : "green")};
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
`;
```

and then use it like this:

```jsx
<Button primary>Click me</Button>
```

This what it would would look like if you used it in a component:

```jsx
import { useState, useEffect } from "react";
import styled from "styled-components";

const Button = styled.button`
  background-color: blue;
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
`;

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Check if component has mounted, then apply styles
  });

  return (
    <>
      <h1>Hello, World!</h1>
      {isMounted && <Button>Hello, World!</Button>}
    </>
  );
}
```

This is an example of a higher-ordered component. This is where a component wraps another component and conditionally renders it based on whether the component is being rendered on the server or the client.

`withNoSsr` accepts an argument called `Component` which is the component to be wrapped. It returns a new function called `NoSsrWrapper`.

In `NoSsrWrapper`, it calls the custom hook called `useIsMounted` which returns a boolean called `isMounted` state and a function `setIsMounted` to update the state. The useIsMounted hook uses the useState and useEffect hooks to set the isMounted state to true only after the component has mounted.

The NoSsrWrapper component then conditionally renders the Component only if isMounted is true. This ensures that the Component is not rendered on the server during server-side rendering (SSR) when there is no browser DOM available.

By wrapping a component with withNoSsr, you can ensure that the component is only rendered client-side and not server-side, which can improve performance and prevent errors related to differences in the server and client environments.

```jsx
import { useState, useEffect } from "react";

const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return [isMounted, setIsMounted];
};

const withNoSsr = (Component) => {
  return function NoSsrWrapper(props) {
    const [isMounted] = useIsMounted();
    return isMounted ? <Component {...props} /> : null;
  };
};

export default withNoSsr;
```

```jsx
import styled from "styled-components";
import withNoSsr from "@/utils/useIsMounted";

const Button = styled.button`
  background-color: blue;
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
`;

const Home = () => {
  return (
    <>
      <h1>Hello, World!</h1>
      <Button>Hello</Button>
    </>
  );
}

export default withNoSsr(Home);
```

## SASS

**SASS** is a **CSS preprocessor** that extends the functionality of **CSS** and makes it easier to write and maintain styles for web pages. It was created to make writing **CSS** more efficient, maintainable, and reusable.

Some of the key features of **SASS** are:

1. Variables: You can use variables to store values that you can reuse throughout your styles.

```css
$primary-color: blue;
$font-size: 16px;

.header {
  background-color: $primary-color;
  font-size: $font-size;
}
```

2. Nesting: You can nest styles within other styles, making it easier to understand the hierarchy of your styles and reducing the amount of code you need to write.

```css
.header {
  background-color: blue;
  font-size: 16px;

  h1 {
    color: white;
    font-weight: bold;
  }
}
```

3. Mixins: You can reuse styles in multiple places without duplicating code. You can define a mixin once and then include it in multiple places in your styles.

```css
@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.header {
  background-color: blue;
  font-size: 16px;
  @include center;
}
```

4. Functions: You can perform operations on values, such as manipulating colours or manipulating values to generate styles.

```css
$primary-color: blue;

.header {
  background-color: darken($primary-color, 10%);
  font-size: 16px;
}
```

5. Partials and Imports: You can break up your styles into smaller, reusable components called partials. You can then import these partials into your main stylesheet.

```css
// _variables.scss
$primary-color: blue;
$font-size: 16px;

// _mixins.scss
@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// main.scss
@import "variables";
@import "mixins";

.header {
  background-color: $primary-color;
  font-size: $font-size;
  @include center;
}
```

**SASS** code is written in a syntax similar to **CSS** but with additional features and functionality. The **SASS** code is then compiled into **CSS**, which is then used by the browser to style the web page.

# Formative Assessment

Before you start, create a new branch called **03-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work


## Task 1:

Create a **signup** form using **Styled Components**. The **signup** form must have the following fields:

* First name
* Last name
* Email address
* Password
* Confirm password

When you submit the **signup** form via a **button** click, you must check the following errors:

* First name must be at least two characters
* Last name must be at least two characters
* Email address must be in a valid format
* Password must be at least eight characters
* Confirm password must match Password

If there are any errors, display them below the **signup** form.

Render the **signup** form on a page called `signup.js`.

## Task 2:

Convert the following **CSS** to **SASS**:

```css
nav {
  background-color: #00ff00;
  padding: 1em;
}

nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

nav ul li {
  display: inline-block;
}

button {
  background-color: #ff0000;
  color: #000;
}

button:hover {
  background-color: #000;
  color: #fff;
}
```

You need to demonstrate the use of variables and nesting.

**Note:** You do not need to test this.

## Task 3:

Using the following resource - https://dev.to/josemukorivo/create-a-reusable-table-with-react-styled-components-and-compound-components-design-pattern-40cn, convert the `UserTable` component so that it is using **Styled Components**.

## Task 4 (Research):

Create a **login** form using **Tailwind CSS**. The **login** form must have the following fields:

* Username
* Password

When you submit the **login** form via a **button** click, you must check the following errors:

* Username is not empty
* Password is not empty

If there are any errors, display them below the **login** form.

Render the **login** form on a page called `login.js`.

**Resource:** https://tailwindcss.com/docs/installation

# Formative Assessment Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please don't merge your own pull request.
