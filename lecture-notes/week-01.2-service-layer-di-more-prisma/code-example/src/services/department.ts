import { Prisma, Department } from "@prisma/client";

import departmentRepository from "../repositories/department.js";
import { PaginationResult } from "../types/pagination.js";
import { NotFoundError } from "../errors/index.js";

class DepartmentService {
  async create(data: Prisma.DepartmentCreateInput): Promise<Department> {
    return await departmentRepository.create(data);
  }

  async getAll(
    filters: Record<string, string> = {},
    sortBy: string = "id",
    sortOrder: string = "asc",
    page: string = "1",
    pageSize: string = "10",
  ): Promise<PaginationResult<Department>> {
    const departments = await departmentRepository.findAll(
      filters,
      sortBy,
      sortOrder,
      page,
      pageSize,
    );

    if (departments.data.length === 0) {
      throw new NotFoundError("No departments found");
    }

    return departments;
  }

  async getById(id: string): Promise<Department> {
    const department = await departmentRepository.findById(id);

    if (!department) {
      throw new NotFoundError(`No department with the id: ${id} found`);
    }

    return department;
  }

  async update(
    id: string,
    data: Prisma.DepartmentUpdateInput,
  ): Promise<Department> {
    await this.getById(id); // Throws NotFoundError if not found
    return departmentRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id); // Throws NotFoundError if not found
    await departmentRepository.delete(id);
  }
}

export default new DepartmentService();
