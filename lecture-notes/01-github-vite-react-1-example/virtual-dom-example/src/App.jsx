import { useState } from "react";

const App = () => {
  const [clicks, setClicks] = useState(0);

  const handleClick = () => {
    setClicks(clicks + 1);
  };

  return (
    <div>
      <p>You clicked {clicks} times</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};

export default App;
