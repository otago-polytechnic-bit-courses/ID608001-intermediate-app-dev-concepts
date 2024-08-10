import { useQuery } from "@tanstack/react-query";

const App = () => {
  const { isLoading, data: institutionData } = useQuery({
    queryKey: ["institutionData"],
    queryFn: () =>
      fetch(
        "https://s2-24-intro-app-dev-repo-grayson-orr.onrender.com//api/institutions"
      ).then((res) => res.json()),
  });

  if (isLoading) return "Loading...";

  return (
    <>
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
    </>
  );
};

export default App;