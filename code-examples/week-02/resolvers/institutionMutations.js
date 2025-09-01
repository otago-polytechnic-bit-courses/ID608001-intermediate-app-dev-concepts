const institutionMutations = {
  createInstitution: async ({ input }, { prisma }) => {
    await prisma.institution.create({
      data: {
        name: input.name,
        region: input.region,
        country: input.country,
      },
    });

    const newInstitutions = await prisma.institution.findMany();

    return {
      message: "Institution successfully created",
      data: newInstitutions,
    };
  },

  updateInstitution: async ({ id, input }, { prisma }) => {
    let institution = await prisma.institution.findUnique({
      where: { id },
    });

    if (!institution) {
      throw new Error(`No institution with the id: ${id} found`);
    }

    institution = await prisma.institution.update({
      where: { id },
      data: {
        name: input.name,
        region: input.region,
        country: input.country,
      },
    });

    return {
      message: `Institution with the id: ${id} successfully updated`,
      data: institution,
    };
  },

  deleteInstitution: async ({ id }, { prisma }) => {
    const institution = await prisma.institution.findUnique({
      where: { id },
    });

    if (!institution) {
      throw new Error(`No institution with the id: ${id} found`);
    }

    await prisma.institution.delete({
      where: { id },
    });

    return {
      message: `Institution with the id: ${id} successfully deleted`,
    };
  },
};

export default institutionMutations;
