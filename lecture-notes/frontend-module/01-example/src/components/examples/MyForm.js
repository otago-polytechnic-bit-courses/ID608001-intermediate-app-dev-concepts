import { useState } from "react";

const MyForm = () => {
  const [name, setName] = useState("John Doe");
  const [age, setAge] = useState(50);

  return (
    <>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={() => setAge(age + 1)}>Increment age</button>
      <p>
        Hello, {name}. You are {age}.
      </p>
    </>
  );
};

export default MyForm;
