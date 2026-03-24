import { Department } from "@prisma/client";

import departmentRepository from "../repositories/department.js";
import {
  CreateDepartmentBody,
  UpdateDepartmentBody,
} from "../types/department.js";
import { PaginationResult } from "../types/pagination.js";
import { NotFoundError } from "../errors/index.js";

class DepartmentService {
  async create(data: CreateDepartmentBody): Promise<Department[]> {
    await departmentRepository.create(data);
    const result = await departmentRepository.findAll();
    return result.data;
  }

  async getAll(
    filters: Record<string, string> = {},
    sortBy: string = "id",
    sortOrder: string = "asc",
    page: string = "1",
    pageSize: string = "10",
  ): Promise<PaginationResult<Department>> {
    const result = await departmentRepository.findAll(
      filters,
      sortBy,
      sortOrder,
      page,
      pageSize,
    );

    if (result.data.length === 0) {
      throw new NotFoundError("No departments found");
    }

    return result;
  }

  async getById(id: string): Promise<Department> {
    const department = await departmentRepository.findById(id);

    if (!department) {
      throw new NotFoundError(`No department with the id: ${id} found`);
    }

    return department;
  }

  async update(id: string, data: UpdateDepartmentBody): Promise<Department> {
    await this.getById(id); // Throws NotFoundError if not found
    return departmentRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id); // Throws NotFoundError if not found
    await departmentRepository.delete(id);
  }
}

export default new DepartmentService();
