# 03: Styling

## CSS Modules

CSS Modules are a way to write CSS styles that are scoped to a specific component rather than having global styles that may accidentally affect other elements in the application.

CSS Modules work by automatically generating unique class names based on the component's file name. This way, styles defined in one component will not affect other components, even if they have the same class name.

When you use CSS Modules, you will need to use the .module.css file extension instead of the regular .css extension. You can then import the CSS styles into your component using the import statement and use the class names in your JSX.

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
}

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

`styled-components` is a library that allows you to write CSS styles in JavaScript. It uses a technique called "tagged template literals" to create a component that has the styles attached to it. It allows you to create and use your own custom components that are already styled, rather than having to add class names to existing HTML elements.

For example, you can use the styled function from the library to create a `Button` that has its own styles:

```jsx
import styled from 'styled-components';

const Button = styled.button`
  background-color: blue;
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
`;
```

You can then use this `Button` component in your JSX like any other component:

```jsx
<Button>Click me</Button>
```

`styled-components` also provides a way to pass props to the component and use them in the styling, this way you can have dynamic styling.

```jsx
const Button = styled.button`
  background-color: ${props => props.primary ? 'blue' : 'green'};
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

## Sass

## Tailwind
