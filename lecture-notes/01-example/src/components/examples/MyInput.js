import { useState } from "react";

const MyInput = () => {
  const [text, setText] = useState("John Doe");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>You typed: {text}</p>
      <button onClick={() => setText("John Doe")}>Reset</button>
    </>
  );
};

export default MyInput;
