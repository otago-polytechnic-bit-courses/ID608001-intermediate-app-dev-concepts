import { Prisma, Institution } from "@prisma/client";

import prisma from "../../prisma/db.js";

interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}

class InstitutionRepository {
  async create(data: Prisma.InstitutionCreateInput): Promise<Institution> {
    return await prisma.institution.create({ data });
  }

  async findAll(
    filters: Record<string, unknown> = {},
    sortBy: string = "id",
    sortOrder: string = "asc",
    page: string | number = 1,
    pageSize: string | number = 10,
  ): Promise<PaginationResult<Institution>> {
    const newParsedPage = parseInt(String(page), 10) > 0 ? parseInt(String(page), 10) : 1;
    const newParsedPageSize = parseInt(String(pageSize), 10) > 0 ? parseInt(String(pageSize), 10) : 10;

    const totalCount: number = await prisma.institution.count({
      where: filters,
    });

    const totalPages: number = Math.ceil(totalCount / newParsedPageSize);

    const query: Prisma.InstitutionFindManyArgs = {
      orderBy: { [sortBy]: sortOrder },
      skip: (newParsedPage - 1) * newParsedPageSize,
      take: newParsedPageSize,
    };

    if (Object.keys(filters).length > 0) {
      query.where = {};

      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== "") {
          if (typeof value === "string") {
            query.where[key] = { contains: value };
          } else if (typeof value === "boolean") {
            query.where[key] = { equals: value };
          } else if (typeof value === "number") {
            query.where[key] = { equals: value };
          }
        }
      }
    }

    const institutions = await prisma.institution.findMany(query);

    return {
      data: institutions,
      pagination: {
        currentPage: newParsedPage,
        pageSize: newParsedPageSize,
        totalCount,
        totalPages,
        nextPage: newParsedPage < totalPages ? newParsedPage + 1 : null,
        prevPage: newParsedPage > 1 ? newParsedPage - 1 : null,
      },
    };
  }

  async findById(id: string): Promise<Institution | null> {
    return await prisma.institution.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    data: Prisma.InstitutionUpdateInput,
  ): Promise<Institution> {
    return await prisma.institution.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Institution> {
    return await prisma.institution.delete({
      where: { id },
    });
  }
}

export default new InstitutionRepository();
