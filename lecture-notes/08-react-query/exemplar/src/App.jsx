import { queryClient } from "./main";
import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

const App = () => {
  const form = useForm();

  // const { isLoading, err, data } = useQuery({
  //   queryKey: ["institutionData"],
  //   queryFn: () =>
  //     fetch(
  //       "https://id607001-graysono-wbnj.onrender.com/api/institutions"
  //     ).then((res) => res.json()),
  // });

  const {
    isLoading,
    err,
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["institutionData"],
    queryFn: ({ pageParam = 1 }) =>
      fetch(
        `https://id607001-graysono-wbnj.onrender.com/api/institutions?page=${pageParam}&amount=5`
      ).then((res) => res.json()),
    getNextPageParam: (prevData) => prevData.nextPage,
  });

  const postMutation = useMutation({
    mutationFn: (institution) =>
      fetch("https://id607001-graysono-wbnj.onrender.com/api/institutions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: institution.name,
          region: institution.region,
          country: institution.country,
        }),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries("institutionData");
    },
  });

  const handleSubmit = (values) => {
    console.log(values);
    postMutation.mutate(values);
    form.reset((formValues) => ({
      ...formValues,
      name: "",
      region: "",
      country: "",
    }));
  };

  if (isLoading) return "Loading...";
  if (err) return `An error has occurred: ${err.message}`;

  return (
    <>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" {...form.register("name")} />
        <label htmlFor="region">Region</label>
        <input
          type="text"
          id="region"
          name="region"
          {...form.register("region")}
        />
        <label htmlFor="country">Country</label>
        <input
          type="text"
          id="country"
          name="country"
          {...form.register("country")}
        />
        <button type="submit">Submit</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Institution</th>
            <th>Region</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          {data.pages[0].msg ? (
            <tr>
              <td colSpan="3">{data.pages[0].msg}</td>
            </tr>
          ) : (
            <>
              {data.pages
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
