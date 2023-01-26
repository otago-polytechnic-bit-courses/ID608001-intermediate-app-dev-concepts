import { useState, useEffect } from "react";

const Child = () => {
  useEffect(() => {
    console.log("componentWillUnmount");
  }, []);

  return (
    <>
      <h1>Child Component</h1>
    </>
  );
};

const Parent = () => {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <>
      <button onClick={() => setIsToggled(!isToggled)}>Toggle Child</button>
      {isToggled ? <Child /> : null}
    </>
  );
};

export default Parent;
