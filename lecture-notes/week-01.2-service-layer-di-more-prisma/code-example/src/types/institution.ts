interface InstitutionParams {
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
