import institutionQueries from "./institutionQueries.js";
import departmentQueries from "./departmentQueries.js";

const resolvers = {
  ...institutionQueries,
  ...departmentQueries,
};

export default resolvers;
