# 01 A: GitHub Workflow

# 01 B: React Basics

## Components

### What is a component?

In React, a component is a reusable piece of code that represents a part of the user interface. It can accept inputs (props) and return a React element that describes how the component should be rendered. Components are the building blocks of a React application, and they can be used to create complex user interfaces by composing simple components together.

There are two main types of components in React: functional components and class components. Functional components are simple JavaScript functions that take in props and return a React element, while class components are ES6 classes that extend from React.Component and have a render method that returns a React element.

A component can also have its own internal state and lifecycle methods that allow it to change over time based on user interactions or other events. Components can also communicate with each other by passing data down via props and handling events via callbacks.

### How to write a component

There are two main ways to write a component in React: using a functional component or using a class component.

Functional component:

```jsx
import React from "react";

const MyComponent = (props) => {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
    </div>
  );
};

export default MyComponent;
```

In this example, the component is defined as a simple JavaScript function called `MyComponent` that takes in a single argument, `props`. The function returns a JSX element that describes how the component should be rendered.

Class component:

```jsx
import React, { Component } from "react";

class MyComponent extends Component {
  render() {
    return (
      <div>
        <h1>Hello, {this.props.name}!</h1>
      </div>
    );
  }
}

export default MyComponent;
```

In this example, the component is defined as a class called `MyComponent` that extends from `React.Component`. The class has a single method called `render` that returns a JSX element that describes how the component should be rendered.

Both of these components can be used in other parts of your React application by importing and using them:

```jsx
import MyComponent from "./MyComponent";

const App = () => {
  return (
    <div>
      <MyComponent name="John" />
    </div>
  );
}
```

It is important to notice that the second example uses `this.props.name` instead of `props.name` because this refers to the component instance.

Also, it is important to note that in both examples, the component's name should start with an uppercase letter, this is because in React, the component names that starts with lowercase letter are reserved for built-in browser elements like `div`, `p` etc.
