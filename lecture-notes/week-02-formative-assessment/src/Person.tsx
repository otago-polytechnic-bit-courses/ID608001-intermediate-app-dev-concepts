interface PersonProps {
  id: number;
  name: string;
  age: number;
  isStudent: boolean;
  onDelete: (id: number) => void;
}

const Person: React.FC<PersonProps> = (props) => {
  return (
    <>
      <p>Name: {props.name}</p>
      <p>Age: {props.age}</p>
      <p>Student: {props.isStudent ? "Yes" : "No"}</p>
      <button onClick={() => props.onDelete(props.id)}>Delete</button>
    </>
  );
};

export default Person;
