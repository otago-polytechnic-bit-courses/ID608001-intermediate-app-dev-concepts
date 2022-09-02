# 10: Context API


```jsx
const Cart = () => {
  return (
    <h3>Cart: 0</h3>
  );
};

export default Cart;
```

```jsx
const Book = (props) => {
  return (
    <>
      <h1>{props.name}</h1>
      <h3>{props.price}</h3>
      <button onClick={() => props.addToCart()}>Add to cart</button>
    </>
  );
};

export default Book;
```

```jsx
import { useEffect, useState } from 'react';
import Book from './Book';

const BookList = () => {
  useEffect(() => {
    console.log(cart);
  });

  const [books, setBooks] = useState([
    { name: 'Pride and Prejudice', price: '$10' },
    { name: '1984', price: '$15' },
    { name: 'Crime and Punishment', price: '$20' },
    { name: 'Hamlet', price: '$20' }
  ]);

  const [cart, setCart] = useState([]);

  const addToCart = (name, price) => {
    setCart(prevCart => [...prevCart, { name, price }]);
  };

  return (
    <>
      {books.map((book, idx) => (
        <Book
          key={idx}
          name={book.name}
          price={book.price}
          addToCart={() => addToCart(book.name, book.price)}
        />
      ))}
    </>
  );
};

export default BookList;
```

```jsx
import BookList from './components/BookList';
import Cart from './components/Cart';

const App = () => {
	return (
		<>
			<Cart />
			<BookList />
		</>
	);
}

export default App;
```

```jsx
import { createContext, useState } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (name, price) => {
    setCart((prevState) => [...prevState, { name, price }]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>{children}</CartContext.Provider>
  );
};

export { CartContext, CartProvider }
```

```jsx
import BookList from './components/BookList';
import Cart from './components/Cart';
import { CartProvider } from './contexts/CartContext';

const App = () => {
  return (
    <>
      <CartProvider>
        <Cart />
        <BookList />
      </CartProvider>
    </>
  );
}

export default App;
```

```jsx
import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

const Cart = () => {
  const { cart } = useContext(CartContext);
  return (
    <>
      <h3>Cart: {cart.length}</h3>
    </>
  );
};

export default Cart;
```

```jsx
import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

const Book = (props) => {
  const { addToCart } = useContext(CartContext);

  return (
    <>
      <h1>{props.name}</h1>
      <h3>{props.price}</h3>
      <button onClick={() => addToCart(props.name, props.price)}>Add to cart</button>
    </>
  );
};

export default Book;
```

```jsx
import { useContext, useEffect, useState } from 'react';
import Book from './Book';
import { CartContext } from "../contexts/CartContext";

const BookList = () => {
  const { cart } = useContext(CartContext);

  useEffect(() => {
    console.log(cart);
  });

  const [books, _] = useState([
    { name: 'Pride and Prejudice', price: '$10' },
    { name: '1984', price: '$15' },
    { name: 'Crime and Punishment', price: '$20' },
    { name: 'Hamlet', price: '$20' }
  ]);

  return (
    <>
      {books.map((book, idx) => (
        <Book
          key={idx}
          name={book.name}
          price={book.price}
        />
      ))}
    </>
  );
};

export default BookList;
```