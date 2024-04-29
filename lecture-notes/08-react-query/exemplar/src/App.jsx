import { queryClient } from "./main";
import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

const App = () => {
  const institutionForm = useForm();

  // const { isLoading, data: institutionData } = useQuery({
  //   queryKey: ["institutionData"],
  //   queryFn: () =>
  //     fetch(
  //       "https://id607001-graysono-1i3w.onrender.com/api/institutions"
  //     ).then((res) => res.json()),
  // });

  const {
    isLoading,
    data: institutionData,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["institutionData"],
    queryFn: ({ pageParam = 1 }) =>
      fetch(
        `https://id607001-graysono-1i3w.onrender.com/api/institutions?page=${pageParam}&amount=5`
      ).then((res) => res.json()),
    getNextPageParam: (prevData) => prevData.nextPage,
  });

  const { mutate: postInstitutionMutation, data: postInstitutionData } =
    useMutation({
      mutationFn: (institution) =>
        fetch("https://id607001-graysono-1i3w.onrender.com/api/institutions", {
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

  const handleInstitutionSubmit = (values) =>
    postInstitutionMutation(values);

  if (isLoading) return "Loading...";

  return (
    <>
      <form onSubmit={institutionForm.handleSubmit(handleInstitutionSubmit)}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
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
          {institutionData.pages[0].msg ? (
            <tr>
              <td colSpan="3">{institutionData.pages[0].msg}</td>
            </tr>
          ) : (
            <>
              {institutionData.pages
                .flatMap((data) => data.data)
                .map((institution) => (
                  <tr key={institution.id}>
                    <td>{institution.name}</td>
                    <td>{institution.region}</td>
                    <td>{institution.country}</td>
                  </tr>
                ))}
            </>
          )}
        </tbody>
      </table>
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </>
  );
};

export default App;
