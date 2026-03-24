import { Prisma, Course } from "@prisma/client";

import prisma from "../../prisma/db.js";
import { PaginationResult } from "../types/pagination.js";

class CourseRepository {
  async create(data: Prisma.CourseCreateInput): Promise<Course> {
    return await prisma.course.create({ data });
  }

  async findAll(
    filters: Record<string, string> = {},
    sortBy: string = "id",
    sortOrder: string = "asc",
    page: string = "1",
    pageSize: string = "10",
  ): Promise<PaginationResult<Course>> {
    const parsedPage = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const parsedPageSize =
      parseInt(pageSize, 10) > 0 ? parseInt(pageSize, 10) : 10;

    const where: Prisma.CourseWhereInput = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== "") {
        if (typeof value === "string") {
          Object.assign(where, { [key]: { contains: value } });
        } else if (typeof value === "boolean" || typeof value === "number") {
          Object.assign(where, { [key]: { equals: value } });
        }
      }
    }

    const totalCount = await prisma.course.count({ where });
    const totalPages = Math.ceil(totalCount / parsedPageSize);

    const courses = await prisma.course.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (parsedPage - 1) * parsedPageSize,
      take: parsedPageSize,
    });

    return {
      data: courses,
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

  async findById(id: string): Promise<Course | null> {
    return await prisma.course.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Prisma.CourseUpdateInput): Promise<Course> {
    return await prisma.course.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Course> {
    return await prisma.course.delete({
      where: { id },
    });
  }
}

export default new CourseRepository();
