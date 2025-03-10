import { useQuery, useMutation } from "@tanstack/react-query";

import { queryClient } from "./main";

import { useForm } from "react-hook-form";


const App = () => {
  const institutionForm = useForm();
  const handleInstitutionSubmit = (values) => postInstitutionMutation(values);

  const {
    isLoading,
    error,
    data: institutionData,
  } = useQuery({
    queryKey: ["institutionData"],
    queryFn: () =>
      fetch("http://localhost:3000/api/institutions").then((res) => res.json()),
  });

  const { mutate: postInstitutionMutation } =
    useMutation({
      mutationFn: (institution) =>
        fetch(
          "http://localhost:3000/api/institutions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: institution.name,
              region: institution.region,
              country: institution.country,
            }),
          }
        ).then((res) => {
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
      onSuccess: () => queryClient.invalidateQueries({
        queryKey: ["institutionData"],
      }),
    });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <>
    <form onSubmit={institutionForm.handleSubmit(handleInstitutionSubmit)}>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        id="name"
        {...institutionForm.register("name")}
      />
      <label htmlFor="region">Region</label>
      <input
        type="text"
        id="region"
        {...institutionForm.register("region")}
      />
      <label htmlFor="country">Country</label>
      <input
        type="text"
        id="country"
        {...institutionForm.register("country")}
      />
      <button type="submit">Submit</button>
    </form>
      {institutionData.data.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Institution</th>
              <th>Region</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {institutionData.data.map((institution) => (
              <tr key={institution.id}>
                <td>{institution.name}</td>
                <td>{institution.region}</td>
                <td>{institution.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available.</p>
      )}
    </>
  );
};

export default App;
