import axios from "axios";

import UsersTable from "@/components/UsersTable";

const Home = ({ users }) => {
  return (
    <>
      <h1>Users</h1>
      <UsersTable data={users} />
    </>
  );
};

export const getServerSideProps = async () => {
  const usersRes = await axios.get("https://jsonplaceholder.typicode.com/users");
  return {
    props: {
      users: usersRes.data,
    },
  };
};

export default Home;
