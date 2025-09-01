import institutions from "../data/institutions.js";
import departments from "../data/departments.js";
import { findById, filterBy } from "../helpers/utils.js";

const institutionResolvers = {
  institutions: () => {
    if (institutions.length === 0) {
      throw new Error("No institutions found");
    }
    return institutions.map((inst) => ({
      ...inst,
      departments: () => filterBy(departments, "institutionId", inst.id),
    }));
  },
  
  institution: ({ id }) => {
    const institution = findById(institutions, id);
    if (!institution)
      throw new Error(`No institution with the id: ${id} found`);
    return {
      ...institution,
      departments: () => filterBy(departments, "institutionId", institution.id),
    };
  },
};

export default institutionResolvers;
