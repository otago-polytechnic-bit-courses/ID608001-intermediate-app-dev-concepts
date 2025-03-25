import { useParams } from "react-router";

const User = () => {
  const { id } = useParams();

  return (
    <>
      <p>User ID: {id}</p>
    </>
  );
};

export default User;