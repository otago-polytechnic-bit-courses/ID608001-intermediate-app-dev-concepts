import { Prisma, Department } from "@prisma/client";

import prisma from "../../prisma/db.js";
import { PaginationResult } from "../types/pagination.js";

class DepartmentRepository {
  async create(data: Prisma.DepartmentCreateInput): Promise<Department> {
    return await prisma.department.create({ data });
  }

  async findAll(
    filters: Record<string, string> = {},
    sortBy: string = "id",
    sortOrder: string = "asc",
    page: string = "1",
    pageSize: string = "10",
  ): Promise<PaginationResult<Department>> {
    const parsedPage = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const parsedPageSize =
      parseInt(pageSize, 10) > 0 ? parseInt(pageSize, 10) : 10;

    const where: Prisma.DepartmentWhereInput = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== "") {
        if (typeof value === "string") {
          Object.assign(where, { [key]: { contains: value } });
        } else if (typeof value === "boolean" || typeof value === "number") {
          Object.assign(where, { [key]: { equals: value } });
        }
      }
    }

    const totalCount = await prisma.department.count({ where });
    const totalPages = Math.ceil(totalCount / parsedPageSize);

    const departments = await prisma.department.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (parsedPage - 1) * parsedPageSize,
      take: parsedPageSize,
    });

    return {
      data: departments,
      pagination: {
        currentPage: parsedPage,
        pageSize: parsedPageSize,
        totalCount,
        totalPages,
        nextPage: parsedPage < totalPages ? parsedPage + 1 : null,
        prevPage: parsedPage > 1 ? parsedPage - 1 : null,
      },
    };
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
