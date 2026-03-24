import { ParamsDictionary } from "express-serve-static-core";

interface CourseParams extends ParamsDictionary {
  id: string;
}

interface CreateCourseBody {
  name: string;
  code: string;
  description: string;
  departmentId: string;
}

interface UpdateCourseBody {
  name?: string;
  code?: string;
  description?: string;
  departmentId?: string;
}

export type { CourseParams, CreateCourseBody, UpdateCourseBody };
