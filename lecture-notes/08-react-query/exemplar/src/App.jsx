import { queryClient } from "./main";
import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";

const App = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const institution = Object.fromEntries(formData);
    postMutation.mutate(institution);
    e.target.reset();
  };

  if (isLoading) return "Loading...";
  if (err) return `An error has occurred: ${err.message}`;

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" />
        <label for="region">Region</label>
        <input type="text" id="region" name="region" />
        <label for="country">Country</label>
        <input type="text" id="country" name="country" />
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
