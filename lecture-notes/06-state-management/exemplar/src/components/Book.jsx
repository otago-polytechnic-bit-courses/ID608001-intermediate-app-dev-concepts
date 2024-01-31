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
