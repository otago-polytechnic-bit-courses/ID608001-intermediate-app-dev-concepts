import { useState } from "react";

const MyCounter = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => setCount(count + 1);

  return (
    <>
      <button onClick={handleClick}>You clicked me {count} times</button>
    </>
  );
};

export default MyCounter;
