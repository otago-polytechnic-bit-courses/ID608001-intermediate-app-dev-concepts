import { Prisma } from "@prisma/client";

import prisma from "../../prisma/db.js";

const createDepartmentWithCourse = async (
  departmentData: Prisma.DepartmentCreateInput,
  courseData: Omit<Prisma.CourseCreateInput, "department">,
) => {
  return prisma.$transaction(async (tx) => {
    const department = await tx.department.create({
      data: departmentData,
    });

    const course = await tx.course.create({
      data: {
        ...courseData,
        departmentId: department.id,
      },
    });

    return { department, course };
  });
};

export { createDepartmentWithCourse };
