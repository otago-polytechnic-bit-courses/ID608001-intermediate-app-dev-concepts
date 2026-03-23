import { User } from "@prisma/client";

type RegisterBody = Omit<User, "id" | "createdAt" | "updatedAt">;

type LoginBody = Pick<User, "emailAddress" | "password">;

export type { RegisterBody, LoginBody };
