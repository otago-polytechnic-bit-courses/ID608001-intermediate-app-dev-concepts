import axios from "axios";
import { useRouter } from "next/router";

import UsersTable from "@/components/UsersTable";

const User = ({ user }) => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <h1>User {id}</h1>
      <UsersTable data={[user]} />
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { id } = context.params;
  const userRes = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return {
    props: {
      user: userRes.data,
    },
  };
};

export default User;
