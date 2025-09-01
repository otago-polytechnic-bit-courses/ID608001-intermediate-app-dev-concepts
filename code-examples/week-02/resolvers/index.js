import institutionQueries from "./institutionQueries.js";
import departmentQueries from "./departmentQueries.js";
import institutionMutations from "./institutionMutations.js";
import departmentMutations from "./departmentMutations.js";

const resolvers = {
  ...institutionQueries,
  ...departmentQueries,
  ...institutionMutations,
  ...departmentMutations,
};

export default resolvers;
