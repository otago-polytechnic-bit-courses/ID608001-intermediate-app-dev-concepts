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