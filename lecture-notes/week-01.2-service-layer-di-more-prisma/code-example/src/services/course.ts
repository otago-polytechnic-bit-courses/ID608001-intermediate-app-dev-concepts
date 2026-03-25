import { Prisma, Course } from "@prisma/client";

import courseRepository from "../repositories/course.js";
import { PaginationResult } from "../types/pagination.js";
import { NotFoundError } from "../errors/index.js";

class CourseService {
  async create(data: Prisma.CourseCreateInput): Promise<Course> {
    return await courseRepository.create(data);
  }

  async getAll(
    filters: Record<string, string> = {},
    sortBy: string = "id",
    sortOrder: string = "asc",
    page: string = "1",
    pageSize: string = "10",
  ): Promise<PaginationResult<Course>> {
    const courses = await courseRepository.findAll(
      filters,
      sortBy,
      sortOrder,
      page,
      pageSize,
    );

    if (courses.data.length === 0) {
      throw new NotFoundError("No courses found");
    }

    return courses;
  }

  async getById(id: string): Promise<Course> {
    const course = await courseRepository.findById(id);

    if (!course) {
      throw new NotFoundError(`No course with the id: ${id} found`);
    }

    return course;
  }

  async update(id: string, data: Prisma.CourseUpdateInput): Promise<Course> {
    await this.getById(id); // Throws NotFoundError if not found
    return courseRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id); // Throws NotFoundError if not found
    await courseRepository.delete(id);
  }
}

export default new CourseService();
