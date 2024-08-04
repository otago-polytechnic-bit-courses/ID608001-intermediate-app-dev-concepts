import { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState<number>(0); // Initial state is 0

  const increment = (amount: number) => {
    setCount(count + amount); // Increment the count by the given amount
  };

  return (
    <>
      <p>{count}</p>
      <button onClick={() => increment("1")}>Increment</button>
    </>
  );
};

export default Counter;
