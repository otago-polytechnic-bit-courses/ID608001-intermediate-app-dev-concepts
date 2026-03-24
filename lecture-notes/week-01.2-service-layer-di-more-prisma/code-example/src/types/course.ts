interface CourseParams {
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
