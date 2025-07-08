import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { queryClient } from "./main";

const App = () => {
  const [users, setUsers] = useState([]);
  
  const userForm = useForm();
  const { reset, handleSubmit, register } = userForm;

  const { isLoading, error, data } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/users").then((res) =>
        res.json()
      ),
  });

  const postMutation = useMutation({
    mutationFn: (user) =>
      fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      }).then((res) => res.json()),
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setUsers((prev) => [...prev, { ...newUser, id: newUser.id }]);
      reset();
    },
  });

  const allUsers = [...(data ?? []), ...users];

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;

  const handleSubmitForm = (user) => {
    if (user.id) {
      // updateMutation.mutate(user);
    } else {
      postMutation.mutate(user);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" {...register("name")} />
        <label htmlFor="city">City</label>
        <input type="text" id="city" {...register("address.city")} />
        <label htmlFor="email">Email</label>
        <input type="text" id="email" {...register("email")} />
        <button type="submit">Submit</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>City</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.address.city}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default App;
