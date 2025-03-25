import { Link } from "react-router";

const items = [
  { id: 1, name: "Item One" },
  { id: 2, name: "Item Two" },
  { id: 3, name: "Item Three" },
];

const Home = () => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Items List</h1>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              to={`/details/${item.id}`}
              className="text-blue-600 underline hover:text-blue-800"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;
