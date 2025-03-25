import { useParams } from "react-router";

const itemDetails = {
  1: "This is detailed information about Item One.",
  2: "Here are the details for Item Two.",
  3: "Detailed view of Item Three goes here.",
};

const Details = () => {
  const { id } = useParams();
  const detail = itemDetails[Number(id)];

  if (!detail) {
    return <p>Item not found.</p>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">Item Details</h1>
      <p>{detail}</p>
    </>
  );
};

export default Details;
