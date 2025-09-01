const departmentResolvers = {
  departments: async (args, { prisma }) => {
    try {
      const departments = await prisma.department.findMany({
        include: {
          institution: true,
        },
      });

      if (departments.length === 0) {
        throw new Error("No departments found");
      }

      return departments;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  department: async ({ id }, { prisma }) => {
    try {
      const department = await prisma.department.findUnique({
        where: { id },
        include: {
          institution: true,
        },
      });

      if (!department) {
        throw new Error(`No department with the id: ${id} found`);
      }

      return department;
    } catch (err) {
      throw new Error(err.message);
    }
  },
};

export default departmentResolvers;
