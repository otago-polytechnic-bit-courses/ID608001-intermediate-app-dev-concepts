import express from "express";

const app = express();

const PORT = process.env.PORT || 4000;

// Mock data
const institutions = [
  {
    id: 1,
    name: "Otago Polytechnic",
    region: "Otago",
    country: "New Zealand",
  },
  {
    id: 2,
    name: "Southern Institute of Technology",
    region: "Southland",
    country: "New Zealand",
  },
];


app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit http://localhost:${PORT}`
  );
});

export default app;
