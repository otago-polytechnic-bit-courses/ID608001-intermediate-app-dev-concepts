import InfoCard from "./InfoCard";

const App = () => {
  const data = [
    {
      title: "Register User",
      description: "Register a new user.",
      method: "POST",
      url: "/api/v1/auth/register",
      requestBody: {
        email: "string",
        firstName: "string",
        lastName: "string",
        // Add more if required
      },
      responseBody: {
        msg: "User registered successfully",
        data: "object",
      },
    },
  ];

  return (
    <>
      {data.map((api, index) => (
        <InfoCard
          key={index}
          title={api.title}
          description={api.description}
          method={api.method}
          url={api.url}
          requestBody={api.requestBody}
          responseBody={api.responseBody}
        />
      ))}
    </>
  );
};

export default App;
