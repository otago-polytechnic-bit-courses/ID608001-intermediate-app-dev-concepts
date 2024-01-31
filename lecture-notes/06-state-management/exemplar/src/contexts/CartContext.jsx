import { createContext, useState } from "react";

const CartContext = createContext();

const CartProvider = (props) => {
  const [cart, setCart] = useState([]);

  const addToCart = (name, price) =>
    setCart((prevState) => [...prevState, { name, price }]);

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {props.children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
