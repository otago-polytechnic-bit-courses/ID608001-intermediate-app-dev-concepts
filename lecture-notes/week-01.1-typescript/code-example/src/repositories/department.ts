import { Prisma, Department } from "@prisma/client";

import prisma from "../../prisma/db.js";

class DepartmentRepository {
  async create(data: Prisma.DepartmentCreateInput): Promise<Department> {
    return await prisma.department.create({ data });
  }

  async findAll(): Promise<Department[]> {
    return await prisma.department.findMany();
  }

  async findById(id: string): Promise<Department | null> {
    return await prisma.department.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    data: Prisma.DepartmentUpdateInput,
  ): Promise<Department> {
    return await prisma.department.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Department> {
    return await prisma.department.delete({
      where: { id },
    });
  }
}

export default new DepartmentRepository();
