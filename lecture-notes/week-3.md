# Week 03

## Before We Start

Open your **s2-24-intermediate-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-03-formative-assessment** from **week-02-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

If you get stuck, a completed version of this project is available in the **exemplar** directory.

## Preparation

1. Create a new project using **Create Vite App**:

```bash
npm init vite@latest
```

2. When prompted, select the following options:

- Project name: **week-03-formative-assessment**
- Framework: **React**
- Variant: **TypeScript + SWC**

3. Change into the project directory:

```bash
cd week-03-formative-assessment
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

## State Management

State management is a way to manage the state of your application. It is a way to store and update data in your application. There are many ways to manage state in your application. In this lecture, we will be looking at **Redux**.

---

## Components

In the `src` directory, create a new directory called `components`. In the `components` directory, create the following files:

- `Book.tsx`
- `BookList.tsx`

In `src/components/Book.tsx`, add the following code:

```js
const Book = (props) => {
  return (
    <>
      <p>{props.name}</p>
      <p>${props.price}</p>
      <button
        onClick={() =>
          props.addToCart({
            id: props.id,
            name: props.name,
            price: props.price,
          })
        }
      >
        Add to cart
      </button>
    </>
  );
};

export default Book;
```

In `src/components/BookList.tsx`, add the following code:

```js
import { useEffect, useState } from "react";

import Book from "./Book";

const BookList = () => {
  const [books] = useState([
    { id: 1, name: "Pride and Prejudice", price: 10 },
    { id: 2, name: "1984", price: 10 },
    { id: 3, name: "Crime and Punishment", price: 10 },
    { id: 4, name: "Hamlet", price: 10 },
  ]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  const addToCart = (id, name, price) =>
    setCart((prevCart) => [...prevCart, { id, name, price }]);

  return (
    <>
      {books.map((book) => (
        <Book key={book.id} id={book.id} name={book.name} price={book.price} />
      ))}
    </>
  );
};

export default BookList;
```

In `src/App.tsx`, add the following code:

```js
import BookList from "./components/BookList";

const App = () => {
  return <BookList />;
};

export default App;
```

---

## Redux

Thus far, you have used **props** to pass data from a parent component to a child component. However, if you have a deeply nested component tree, you may find yourself passing props through many components. It is where a state management library can help.

In a typical **React** data flow, components communicate with each other using **props**. For example, `BookList.tsx` passes data to `Book.tsx`. Though this is a simple example, usually when a child component that is nested several levels deep needs to access data from a parent component, you will need to pass props through many components. This is called **prop drilling**.

**Prop-drilling** can be avoided by using a state management library like **Redux**. **Redux** is a way to pass data through the component tree without having to pass props manually at every level. It is a way to share data between components without having to explicitly pass props.

---

### Getting Started

To get started, install the following dependencies:

```bash
npm install redux @reduxjs/toolkit react-redux
```

---

### Slice

A **Redux** slice is a way to organise the state and the reducer functions. 

In the `src` directory, create a new directory called `slices`. In the `slices` directory, create a new file called `cartSlice.js`. In `src/reducers/cartSlice.js`, add the following code:

```js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.cart = [...state.cart, action.payload];
    },
  },
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;
```

Here we are creating a **Redux** slice using the `createSlice()` function. The `createSlice()` function accepts an object as an argument. The object contains a `name` property, an `initialState` property, and a `reducers` property. The `name` property is a string that describes the slice. The `initialState` property is an object that contains the initial state of the slice. The `reducers` property is an object that contains the reducer functions. The `createSlice()` function returns an object that contains the reducer functions and the action creator functions.

---

### Store

A **Redux** store is an object that holds the state of your application. It is the single source of truth for your application. 

In the `src/utils` directory, create a new file called `store.js`. In `src/utils/store.js`, add the following code:

```js
import { configureStore } from "@reduxjs/toolkit";
import cartSliceReducer from "../slices/cartSlice";

export const store = configureStore({
  reducer: {
    data: cartSliceReducer,
  },
});
```

Here we are creating a **Redux** store using the `configureStore()` function. The `configureStore()` function accepts an object as an argument. The object contains a `reducer` property. The `reducer` property is an object that contains the reducer functions. The `configureStore()` function returns a **Redux** store.

---

### Provider

In `src/App.tsx`, update the code to the following:

```js
import { Provider } from "react-redux";

import BookList from "./components/BookList";
import { store } from "./utils/store";

const App = () => {
  return (
    <Provider store={store}>
      <BookList />
    </Provider>
  );
};

export default App;
```

Here we are wrapping the `BookList` component with the `Provider` component. This will allow the `BookList` component and its child components to access the **Redux** store.

---

### useDispatch

In `src/components/Book.tsx`, update the code to the following:

```js
import { useDispatch } from "react-redux";

import { addToCart } from "../slices/cartSlice";

const Book = (props) => {
  const dispatch = useDispatch();

  return (
    <>
      <p>{props.name}</p>
      <p>${props.price}</p>
      <button
        onClick={() =>
          dispatch(
            addToCart({
              id: props.id,
              name: props.name,
              price: props.price,
            })
          )
        }
      >
        Add to cart
      </button>
    </>
  );
};

export default Book;
```

Here we are using the `useDispatch()` hook to dispatch the `addToCart()` action creator function. The `dispatch()` function accepts an action object as an argument. The `dispatch()` function dispatches the action object to the reducer function.

---

### useSelector

In `src/components/BookList.tsx`, update the code to the following:

```js
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Book from "./Book";

const BookList = () => {
  const { cart } = useSelector((state) => state.data);

  const [books] = useState([
    { id: 1, name: "Pride and Prejudice", price: 10 },
    { id: 2, name: "1984", price: 10 },
    { id: 3, name: "Crime and Punishment", price: 10 },
    { id: 4, name: "Hamlet", price: 10 },
  ]);

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  return (
    <>
      {books.map((book) => (
        <Book key={book.id} id={book.id} name={book.name} price={book.price} />
      ))}
    </>
  );
};

export default BookList;
```

Here we are using the `useSelector()` hook to access the **Redux** store. The `useSelector()` hook accepts a function as an argument. The function accepts the state as an argument. The `useSelector()` hook returns the state.

---

## Formative Assessment

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

---

### Task One

Convert the `Book` and `BookList` components to use TypeScript.

---

### Task Two

Move the `books` state in the `BookList` component to the `initialState` object in the `src/slices/cartSlice.js` file. Update the `BookList.tsx` file to use the `useSelector()` hook to access the `books` state.

---

### Task Three

In the `src/components` directory, create a new file called `Cart.tsx`. In the `Cart.tsx` file, display the total number of items and the total price of the items in the cart. Use the `useSelector()` hook to access the `cart` state.

---

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.
