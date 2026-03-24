import { ParamsDictionary } from "express-serve-static-core";
interface DepartmentParams extends ParamsDictionary {
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
