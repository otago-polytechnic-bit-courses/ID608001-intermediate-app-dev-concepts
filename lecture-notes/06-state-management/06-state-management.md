# 06: State Management

If you get stuck, a completed version of this project is available in the **exemplar** directory.

## Preparation

1. Create a new project using **Create Vite App**:

```bash
npm init vite@latest
```

2. When prompted, select the following options:

- Project name: **06-state-management**
- Framework: **React**
- Variant: **JavaScript + SWC**

3. `cd` into **06-state-management**, run `npm install` and open it in your code editor.

## State Management

State management is a way to manage the state of your application. It is a way to store and update data in your application. There are many ways to manage state in your application. In this lecture, we will be looking at **React Context API** and **Redux**.

---

In the `src` directory, create a new directory called `components`. In the `components` directory, create the following files:

- `Book.jsx`
- `BookList.jsx`

In `src/components/Book.jsx`, add the following code:

```js
import PropTypes from "prop-types"; // Remember to install this dependency

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

Book.prototypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default Book;
```

In `src/components/BookList.jsx`, add the following code:

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

  const addToCart = (name, price) =>
    setCart((prevCart) => [...prevCart, { name, price }]);

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

In `src/App.jsx`, add the following code:

```js
import BookList from "./components/BookList";

const App = () => {
  return <BookList />;
};

export default App;
```

## React Context API

Thus far, you have used **props** to pass data from a parent component to a child component. However, if you have a deeply nested component tree, you may find yourself passing props through many components. It is where a state management library can help.

In a typical **React** data flow, components communicate with each other using **props**. For example, `BookList.jsx` passes data to `Book.jsx`. Though this is a simple example, usually when a child component that is nested several levels deep needs to access data from a parent component, you will need to pass props through many components. This is called **prop drilling**.

**Prop-drilling** can be avoided by using **React Context API**. **React Context API** is a way to pass data through the component tree without having to pass props manually at every level. It is a way to share data between components without having to explicitly pass props.

---

In the `src` directory, create a new directory called `contexts`. In the `contexts` directory, create a new file called `CartContext.jsx`. In `src/contexts/CartContext.jsx`, add the following code:

```js
import { createContext, useState } from "react";

const CartContext = createContext();

const CartProvider = (props) => {
  const [cart, setCart] = useState([]);

  const addToCart = (id, name, price) =>
    setCart((prevCart) => [...prevCart, { id, name, price }]);

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {props.children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
```

- `createContext()` creates a context object. It returns a Provider and a Consumer. The Provider is used to provide data to the child components. The Consumer is used to consume the data.
- `CartContext.Provider` provides data to the child components. It accepts a `value` prop. The `value` prop is an object that contains the data that you want to share with the child components.

---

In `src/App.jsx`, update the code to the following:

```js
import { CartProvider } from "./contexts/CartContext";
import BookList from "./components/BookList";

const App = () => {
  return (
    <CartProvider>
      <BookList />
    </CartProvider>
  );
};

export default App;
```

Here we are wrapping the `BookList` component with the `CartProvider` component. This will allow the `BookList` component and its child components to access the data provided by the `CartProvider` component.

---

In `src/components/Book.jsx`, update the code to the following:

```js
import { useContext } from "react";
import PropTypes from "prop-types";

import { CartContext } from "../contexts/CartContext";

const Book = (props) => {
  const { addToCart } = useContext(CartContext);

  return (
    <>
      <p>{props.name}</p>
      <p>${props.price}</p>
      <button
        onClick={() =>
          addToCart({
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

Book.prototypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};

export default Book;
```

Here we are using the `useContext()` hook to access the data provided by the `CartProvider` component. We are destructuring the `addToCart` function from the `CartContext` object. This will allow us to access the `addToCart` function in the `onClick` event handler.

---

In `src/components/BookList.jsx`, update the code to the following:

```js
import { useContext, useEffect, useState } from "react";

import Book from "./Book";
import { CartContext } from "../../contexts/CartContext";
CartContext;

const BookList = () => {
  const { cart } = useContext(CartContext);

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

Here we are using the `useContext()` hook to access the data provided by the `CartProvider` component. We are destructuring the `cart` array from the `CartContext` object. This will allow us to access the `cart` array in the `useEffect()` hook.

## Redux

**Redux** much like **React Context API** is a way to manage state in your application. It provides a predictable state container which means the state of your application is stored in a single **JavaScript** object called a **store**.

To get started, install the following dependencies:

```bash
npm install redux @reduxjs/toolkit react-redux
```

---

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
      state.cart.push(action.payload);
    },
  },
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;
```

Here we are creating a **Redux** slice using the `createSlice()` function. The `createSlice()` function accepts an object as an argument. The object contains a `name` property, an `initialState` property, and a `reducers` property. The `name` property is a string that describes the slice. The `initialState` property is an object that contains the initial state of the slice. The `reducers` property is an object that contains the reducer functions. The `createSlice()` function returns an object that contains the reducer functions and the action creator functions.

---

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

In `src/App.jsx`, update the code to the following:

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

In `src/components/Book.jsx`, update the code to the following:

```js
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { addToCart } from "../slices/cartSlice";

const Book = (props) => {
  const dispatch = useDispatch();

  return (
    <>
      <p>{props.name}</p>
      <p>${props.price}</p>
      <button onClick={() => dispatch(addToCart(props.name, props.price))}>
        Add to cart
      </button>
    </>
  );
};

Book.prototypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};

export default Book;
```

Here we are using the `useDispatch()` hook to dispatch the `addToCart()` action creator function. The `dispatch()` function accepts an action object as an argument. The `dispatch()` function dispatches the action object to the reducer function.

---

In `src/components/BookList.jsx`, update the code to the following:

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

# Formative Assessment

Before you start, create a new branch called **06-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

## Task Tahi

Move the `books` state in the `BookList` component to the `initialState` object in the `src/slices/cartSlice.js` file. Update the `BookList.jsx` file to use the `useSelector()` hook to access the `books` state.

## Task Rua

In the `src/components` directory, create a new file called `Cart.jsx`. In the `Cart.jsx` file, display the total number of items and the total price of the items in the cart. Use the `useSelector()` hook to access the `cart` state.

# Formative Assessment Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.
