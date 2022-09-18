# 09: Styling

## Preparation

Use the repository from the previous **Formative Assessment**. Create a new branch called `09-playground`. Checkout to the `09-playground` branch and open the repository in **Visual Studio Code**.

---

## CSS

**CSS** is very easy to implement. You can have internal like you saw in **08-react-recap** or like below.

In the `src/components` directory, create a new file called `Square.css`. In the `Square.css` file, add the following style:

```css
.square {
  border: 1px solid #000;
  cursor: pointer;
  font-size: 30px;
  font-weight: 800;
  outline: none;
}
```

**Note:** The name of the **CSS** file is the same name as the **component** file.

To use the style in the `Square.css` file in the `Square` **component**, you need to import it. From there, you can use the `className` attribute and set its value to the style. The `className` attribute can have multiple values. For example, `className="styleOne styleTwo"`.

```jsx
import "./Square.css";

const Square = (props) => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
};

export default Square;
```

---

## CSS in JS

**CSS in JS** is slightly different to the **CSS** mentioned above where the styles are encapsulated.

To get started, run the following command:

```bash
npm install react-jss
```

```jsx
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  square: {
    border: "1px solid #000",
    cursor: "pointer",
    fontSize: "30px",
    fontWeight: "800",
    outline: "none",
  },
});

const Square = (props) => {
  const classes = useStyles();

  return (
    <button className={classes.square} onClick={props.onClick}>
      {props.value}
    </button>
  );
};

export default Square;
```

**Resource:** <https://cssinjs.org>

---

## Styled Components

**Styled Components** allow you to create **components** by writing actual **CSS**.

To get started, run the following command:

```bash
npm install styled-components
```

```jsx
import styled from "styled-components";

const Square = (props) => {
  const Button = styled.button`
    border: 1px solid #000;
    cursor: pointer;
    font-size: 30px;
    font-weight: 800;
    outline: none;
  `;

  return <Button onClick={props.onClick}>{props.value}</Button>;
};

export default Square;
```

**Resource:** <https://styled-components.com/docs>

---

## Formative Assessment

### Task Tahi

Refactor the `Square`, `Board` and `Game` **components** to use either **CSS in JS** or **Styled Components**. Test the changes before you move on to **Task Rua**.

## Additional Tasks

### Task Rua

Create a new branch called `09-playground-sass`. Checkout to the `09-playground-sass` branch.

### Task Toru

In the repository's `README.md` file, answer the following questions:

1. What is **Sass**?
2. What are three advantages to using **Sass**?
3. What are three features available in **Sass**?

Please reference your sources using **APA 7th Edition**.

### Task Whā

Refactor the `Square`, `Board` and `Game` **components** to use **Sass**. Test the changes before you move on to the **Code Review**.

---

## Code Review

Once you have completed all tasks, open a pull request and assign **grayson-orr** as a reviewer. Please do not merge the pull request.
