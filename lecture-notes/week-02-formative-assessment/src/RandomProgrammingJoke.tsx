import { useState, useEffect } from "react";

interface Joke {
  setup: string;
  punchline: string;
}

const RandomProgrammingJoke: React.FC = () => {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("https://official-joke-api.appspot.com/jokes/programming/random")
      .then((response) => response.json())
      .then((data: Joke[]) => {
        setJoke(data[0]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : joke ? (
        <p>
          {joke.setup} {joke.punchline}
        </p>
      ) : (
        <p>Failed to load joke.</p>
      )}
    </>
  );
};

export default RandomProgrammingJoke;
