import prisma from "../../prisma/db.js";

const cleanupDatabase = async (): Promise<void> => {
  await prisma.course.deleteMany();
  await prisma.department.deleteMany();
  await prisma.institution.deleteMany();
  await prisma.user.deleteMany();
};

const disconnectPrisma = async (): Promise<void> => {
  await prisma.$disconnect();
};

export { cleanupDatabase, disconnectPrisma };