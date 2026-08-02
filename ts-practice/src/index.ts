interface Studio {
  id: number;
  name: string;
  suburb: string;
  city: string;
  isAcceptingMembers: boolean;
  createdAt: string;
}

async function fetchStudios(): Promise<Studio[]> {
  const response = await fetch("http://127.0.0.1:8000/api/studios/");
  const raw: unknown = await response.json();
  return raw as Studio[]; // an assertion: you are telling TypeScript to trust you here
}

const studiosPromise = fetchStudios();

// Display the studios in the console when the promise resolves
studiosPromise.then((studios) => {
  console.log("studios", studios);
});