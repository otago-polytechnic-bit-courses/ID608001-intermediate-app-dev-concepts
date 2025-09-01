const institutionResolvers = {
  institutions: async (args, { prisma }) => {
    try {
      const institutions = await prisma.institution.findMany({
        include: {
          departments: true,
        },
      });

      if (institutions.length === 0) {
        throw new Error("No institutions found");
      }

      return institutions;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  institution: async ({ id }, { prisma }) => {
    try {
      const institution = await prisma.institution.findUnique({
        where: { id },
        include: {
          departments: true,
        },
      });

      if (!institution) {
        throw new Error(`No institution with the id: ${id} found`);
      }

      return institution;
    } catch (err) {
      throw new Error(err.message);
    }
  },
};

export default institutionResolvers;
