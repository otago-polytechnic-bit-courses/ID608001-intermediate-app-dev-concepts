interface RegisterBody {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  role: string;
}

interface LoginBody {
  emailAddress: string;
  password: string;
}

export type { RegisterBody, LoginBody };
