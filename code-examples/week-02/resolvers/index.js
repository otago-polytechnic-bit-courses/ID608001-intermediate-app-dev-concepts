import institutionQueries from "./institutionQueries.js";
import institutionMutations from "./institutionMutations.js";

const resolvers = {
  ...institutionQueries,
  ...institutionMutations,
};

export default resolvers;
