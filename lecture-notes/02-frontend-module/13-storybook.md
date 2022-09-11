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

```bash
npm install prop-types
```

```bash
npm install --save-dev 
```

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

```js
import Button from "./Button";

export default {
    title: "Components/Button",
    component: Button,
    argTypes: { handleClick: { action: "handleClick" } },
};

const Template = (args) => <Button {...args} />

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

Test the changes before you move on to the **Code Review**.

---

## Code Review

Once you have completed all tasks, open a pull request and assign **grayson-orr** as a reviewer. Please do not merge the pull request.
