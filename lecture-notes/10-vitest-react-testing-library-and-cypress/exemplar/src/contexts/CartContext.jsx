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
