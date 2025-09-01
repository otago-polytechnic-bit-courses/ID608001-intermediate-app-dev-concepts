import institutionQuery from "./institutionQueries.js";
import departmentQuery from "./departmentQueries.js";
import institutionMutations from "./institutionMutations.js";

const resolvers = {
  ...institutionQuery,
  ...departmentQuery,
};

export default resolvers;
