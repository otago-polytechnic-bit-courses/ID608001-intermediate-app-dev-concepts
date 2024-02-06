import { queryClient } from "./main";

import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";

const App = () => {
  const registerForm = useForm();
  const loginForm = useForm();
  const institutionForm = useForm();

  const { mutate: postRegisterMutation, data: registerData } = useMutation({
    mutationFn: (user) =>
      fetch("http://localhost:3000/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
        }),
      }).then((res) => {
        if (res.status === 201) {
          registerForm.reset((formValues) => ({
            ...formValues,
            name: "",
            email: "",
            password: "",
            role: "",
          }));
        }
        return res.json();
      }),
  });

  const { mutate: postLoginMutation, data: loginData } = useMutation({
    mutationFn: (user) =>
      fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
        }),
      }).then((res) => {
        if (res.status === 200) {
          loginForm.reset((formValues) => ({
            ...formValues,
            email: "",
            password: "",
          }));
        }
        return res.json();
      }),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      queryClient.invalidateQueries("institutionData");
    },
  });

  const { isLoading, data: institutionData } = useQuery({
    queryKey: ["institutionData"],
    queryFn: () =>
      fetch("http://localhost:3000/api/v1/institutions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => res.json()),
  });

  const { mutate: postInstitutionMutation, data: postInstitutionData } =
    useMutation({
      mutationFn: (institution) =>
        fetch("http://localhost:3000/api/v1/institutions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: institution.name,
            region: institution.region,
            country: institution.country,
          }),
        }).then((res) => {
          if (res.status === 201) {
            institutionForm.reset((formValues) => ({
              ...formValues,
              name: "",
              region: "",
              country: "",
            }));
          }
          return res.json();
        }),
      onSuccess: () => {
        queryClient.invalidateQueries("institutionData");
      },
    });

  const handleRegisterSubmit = (values) => postRegisterMutation(values);
  const handleLoginSubmit = (values) => postLoginMutation(values);
  const handleInstitutionSubmit = (values) => postInstitutionMutation(values);

  if (isLoading) return "Loading...";

  return (
    <>
      <h2>Register</h2>
      <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}>
        <label htmlFor="register-name">Name</label>
        <input
          type="text"
          id="register-name"
          name="name"
          {...registerForm.register("name")}
        />
        <label htmlFor="register-email">Email</label>
        <input
          type="text"
          id="register-email"
          name="email"
          {...registerForm.register("email")}
        />
        <label htmlFor="register-password">Password</label>
        <input
          type="password"
          id="register-password"
          name="password"
          {...registerForm.register("password")}
        />
        <label htmlFor="register-role">Role</label>
        <input
          type="text"
          id="role"
          name="role"
          {...registerForm.register("role")}
        />
        <button type="submit">Submit</button>
      </form>
      <p>{registerData?.msg}</p>

      <h2>Login</h2>
      <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)}>
        <label htmlFor="login-email">Email</label>
        <input
          type="text"
          id="login-email"
          name="email"
          {...loginForm.register("email")}
        />
        <label htmlFor="login-password">Password</label>
        <input
          type="password"
          id="login-password"
          name="password"
          {...loginForm.register("password")}
        />
        <button type="submit">Submit</button>
      </form>
      <p>{loginData?.msg}</p>

      <h2>Institutions</h2>
      <form onSubmit={institutionForm.handleSubmit(handleInstitutionSubmit)}>
        <label htmlFor="institution-name">Name</label>
        <input
          type="text"
          id="institution-name"
          name="name"
          {...institutionForm.register("name")}
        />
        <label htmlFor="region">Region</label>
        <input
          type="text"
          id="region"
          name="region"
          {...institutionForm.register("region")}
        />
        <label htmlFor="country">Country</label>
        <input
          type="text"
          id="country"
          name="country"
          {...institutionForm.register("country")}
        />
        <button type="submit">Submit</button>
      </form>
      <p>{postInstitutionData?.msg}</p>
      <table>
        <thead>
          <tr>
            <th>Institution</th>
            <th>Region</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          {institutionData.msg ? (
            <tr>
              <td colSpan="3">{institutionData.msg}</td>
            </tr>
          ) : (
            institutionData.data.map((institution) => (
              <tr key={institution.id}>
                <td>{institution.name}</td>
                <td>{institution.region}</td>
                <td>{institution.country}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          queryClient.invalidateQueries("institutionData");
        }}
      >
        Logout
      </button>
    </>
  );
};

export default App;
