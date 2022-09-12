# 13: Storybook

## Preparation

Use the repository from the previous **Formative Assessment**. Create a new branch called `13-playground`. Checkout to the `13-playground` branch and open the repository in **Visual Studio Code**.

---

## Create React App

To get started, run the following commands: 

```bash
npx create-react-app bedtime-story
cd bedtime-story
```

**Resource:** <https://create-react-app.dev>

---

## Prop Types

Install the following dependency:

```bash
npm install prop-types
```

As the name suggests, **Prop Types** checks your **props'** types at runtime.

**Resource:** <https://www.npmjs.com/package/prop-types>

## Storybook

**Storybook** is a UI development tool that allows you develop your component outside your application and in an isolated environment.

**Resource:** <https://storybook.js.org/>

## Bedtime Story

In the `root/src` directory of the `bedtime-story` application, create a new directory called `components`.

### src/components/Button.js

In the `components` directory, create a new file called `Button.js`. In the `Button.js` file, add the following code:

```jsx
import PropTypes from "prop-types";

const Button = (props) => {
  let scale = 0.0;
  if (props.size === "sm") scale = 1.0;
  else if (props.size === "md") scale = 2.0;
  else scale = 3.0;

  const style = {
    color: props.color,
    backgroundColor: props.backgroundColor,
    padding: `${scale * 0.5}rem ${scale * 1}rem`,
    border: "none",
  };

  return (
    <button onClick={props.handleClick} style={style}>{props.textContent}</button>
  );
};

Button.propTypes = {
  textContent: PropTypes.string,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  handleClick: PropTypes.func,
};

export default Button;
```

### src/components/Button.stories.js

**Note:** Please read the comments carefully.

In the `components` directory, create a new file called `Button.stories.js`. In the `Button.stories.js` file, add the following code:

```js
import Button from "./Button";

// This determines where this story goes in the story list
export default {
    title: "Components/Button", // The title prop is optional
    component: Button,
    argTypes: { handleClick: { action: "handleClick" } },
};

// Create a template of how args map to rendering
const Template = (args) => <Button {...args} />

/** 
 * A technique for making a copy of a function, i.e., Template. You use
 * this technique to allow each exported story to set it own properties,
 * but use the same implementation
 */
export const Red = Template.bind({})
Red.args = {
  backgroundColor: "#ff0000",
  textContent: "Click Me!",
  size: "sm",
}

export const Green = Template.bind({})
Green.args = {
  backgroundColor: "#00ff00",
  textContent: "Click Me!",
  size: "md",
}

export const Blue = Template.bind({})
Blue.args = {
  backgroundColor: "#0000ff",
  textContent: "Click Me!",
  size: "lg",
}
```

---

## Formative Assessment

### Task Tahi

If you have not already, implement the code examples above before you move on to **Task Rua**.

### Task Rua

Complete the **Intro to Storybook** tutorial - <https://storybook.js.org/tutorials/intro-to-storybook>. Once you have completed the **Addons** section, move on to the **Code Review**.

---

## Code Review

Once you have completed all tasks, open a pull request and assign **grayson-orr** as a reviewer. Please do not merge the pull request.
