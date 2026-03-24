import { ParamsDictionary } from "express-serve-static-core";

interface InstitutionParams extends ParamsDictionary {
  id: string;
}

interface CreateInstitutionBody {
  name: string;
  region: string;
  country: string;
}

interface UpdateInstitutionBody {
  name?: string;
  region?: string;
  country?: string;
}

export type { InstitutionParams, CreateInstitutionBody, UpdateInstitutionBody };
