import { useQuery } from "@tanstack/react-query";

const App = () => {
  const {
    isLoading,
    error,
    data: institutionData,
  } = useQuery({
    queryKey: ["institutionData"],
    queryFn: () =>
      fetch("http://localhost:3000/api/institutions").then((res) => res.json()),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      {institutionData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Institution</th>
              <th>Region</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {institutionData.map((institution) => (
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
