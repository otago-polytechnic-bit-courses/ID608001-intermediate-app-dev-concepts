import { useState } from "react";

const products = [
  { id: 1, name: "Product 1", price: 10.0 },
  { id: 2, name: "Product 2", price: 20.0 },
  { id: 3, name: "Product 3", price: 30.0 },
];

const MyProducts = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (productId) => {
    setCart([...cart, productId]);
  };

  return (
    <>
      {products.map((product) => (
        <Product
          key={product.id}
          name={product.name}
          price={product.price}
          addToCart={addToCart}
        />
      ))}
    </>
  );
};

const Product = (props) => {
  return (
    <>
      <h1>
        {props.name} - ${props.price}
      </h1>
      <button onClick={() => props.addToCart(props.product.id)}>
        Add To Cart
      </button>
    </>
  );
};

export default MyProducts;
