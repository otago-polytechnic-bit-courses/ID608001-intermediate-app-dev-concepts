import institutionResolvers from "./institutionResolvers.js";
import departmentResolvers from "./departmentResolvers.js";

const resolvers = {
  ...institutionResolvers,
  ...departmentResolvers,
};

export default resolvers;
