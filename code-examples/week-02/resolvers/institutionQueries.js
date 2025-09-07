import prisma from "../prisma/client.js";

const institutionQueries = {
  institutions: async () => await prisma.institution.findMany(),
  institution: async (_, { id }) =>
    await prisma.institution.findUnique({ where: { id } }),
};

export default institutionQueries;
