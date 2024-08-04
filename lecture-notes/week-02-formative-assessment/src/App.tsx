import { useState } from "react";

import Counter from "./Counter";
import RandomProgrammingJoke from "./RandomProgrammingJoke";
import Person from "./Person";
import MultiplicationMatrix from "./MultiplicationMatrix";

interface PersonData {
  id: number;
  name: string;
  age: number;
  isStudent: boolean;
}

const App = () => {
  const [persons, setPersons] = useState<PersonData[]>([
    { id: 1, name: "John Doe", age: 30, isStudent: true },
    { id: 2, name: "Jane Doe", age: 25, isStudent: false },
    { id: 3, name: "Jack Doe", age: 20, isStudent: true },
    { id: 4, name: "Jill Doe", age: 15, isStudent: false },
    { id: 5, name: "Jim Doe", age: 10, isStudent: true },
  ]);

  const handleDelete = (id: number) => {
    setPersons(persons.filter((person) => person.id !== id));
  };

  return (
    <>
      <Counter />
      <RandomProgrammingJoke />
      {persons.map((person) => (
        <Person
          key={person.id}
          id={person.id}
          name={person.name}
          age={person.age}
          isStudent={person.isStudent}
          onDelete={handleDelete}
        />
      ))}
      <MultiplicationMatrix />
    </>
  );
};

export default App;
