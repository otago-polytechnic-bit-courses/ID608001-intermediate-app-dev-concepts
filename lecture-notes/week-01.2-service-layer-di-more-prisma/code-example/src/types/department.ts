interface DepartmentParams {
  id: string;
}

interface CreateDepartmentBody {
  name: string;
  institutionId: string;
}

interface UpdateDepartmentBody {
  name?: string;
  institutionId?: string;
}

export type { DepartmentParams, CreateDepartmentBody, UpdateDepartmentBody };
