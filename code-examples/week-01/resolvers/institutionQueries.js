import institutions from "../data/institutions.js";

const institutionQueries = {
  institutions: () => institutions,
  institution: ({ id }) => institutions.find((inst) => inst.id === Number(id)),
};

export default institutionQueries;
