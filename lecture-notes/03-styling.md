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

`styled-components` is a library that allows you to write CSS styles in JavaScript. It uses a technique called "tagged template literals" to create a component that has the styles attached to it. It allows you to create and use your own custom components that are already styled, rather than having to add class names to existing HTML elements.

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

You can then use this `Button` component in your JSX like any other component:

```jsx
<Button>Click me</Button>
```

`styled-components` also provides a way to pass props to the component and use them in the styling, this way you can have dynamic styling.

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

## SASS

SASS is a CSS preprocessor that extends the functionality of CSS and makes it easier to write and maintain styles for web pages. It was created to make writing CSS more efficient, maintainable, and reusable.

Some of the key features of SASS are:

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

SASS code is written in a syntax similar to CSS but with additional features and functionality. The SASS code is then compiled into CSS, which is then used by the browser to style the web page.

## Tailwind

