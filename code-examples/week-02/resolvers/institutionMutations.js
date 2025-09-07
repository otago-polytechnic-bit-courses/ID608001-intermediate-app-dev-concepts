import prisma from "../prisma/client.js";

const institutionMutations = {
  createInstitution: async (data) => {
    return prisma.institution.create({
      data: {
        name: data.name,
        region: data.region,
        country: data.country,
      },
    });
  },
};

export default institutionMutations;
