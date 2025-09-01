const departmentMutations = {
  createDepartment: async ({ input }, { prisma }) => {
    const department = await prisma.department.create({
      data: input,
      include: { institution: true },
    });
    return department;
  },

  updateDepartment: async ({ id, input }, { prisma }) => {
    const department = await prisma.department.update({
      where: { id },
      data: input,
      include: { institution: true },
    });
    return department;
  },

  deleteDepartment: async ({ id }, { prisma }) => {
    return await prisma.department.delete({
      where: { id },
      include: { institution: true },
    });
  },
};

export default departmentMutations;
