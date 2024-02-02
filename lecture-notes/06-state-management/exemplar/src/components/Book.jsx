import PropTypes from "prop-types";
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

Book.prototypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};

export default Book;