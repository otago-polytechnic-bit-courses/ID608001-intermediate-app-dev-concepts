import { useState, useEffect } from "react";

const MyCounterTwo = () => {
  const [increment, setIncrement] = useState(0);
  const [decrement, setDecrement] = useState(0);

  useEffect(() => {
    console.log("componentDidMount");
  }, []);

  useEffect(() => {
    console.log("componentDidUpdate - increment");
  }, [increment]);

  useEffect(() => {
    console.log("componentDidUpdate - decrement");
  }, [decrement]);

  return (
    <>
      <button onClick={() => setIncrement(increment + 1)}>Increment</button>
      <h1>{increment}</h1>
      <button onClick={() => setDecrement(decrement - 1)}>Decrement</button>
      <h1>{decrement}</h1>
    </>
  );
};

export default MyCounterTwo;
