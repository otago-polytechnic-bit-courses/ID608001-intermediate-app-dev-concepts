import institutions from "../data/institutions.js";
import departments from "../data/departments.js";
import { findById } from "../helpers/utils.js";

const departmentQueries = {
  departments: () => {
    if (departments.length === 0) {
      throw new Error("No departments found");
    }
    return departments.map((dept) => ({
      ...dept,
      institution: () => findById(institutions, dept.institutionId),
    }));
  },

  department: ({ id }) => {
    const department = findById(departments, id);
    if (!department) throw new Error(`No department with the id: ${id} found`);
    return {
      ...department,
      institution: () => findById(institutions, department.institutionId),
    };
  },
};

export default departmentQueries;
