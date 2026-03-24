import request from "supertest";

import app from "../../src/app.js";
import { cleanupDatabase } from "./db.js";

interface RegisterPayload {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  role: string;
}

const setupTestAuth = async (): Promise<string> => {
  const BASE_URL = "/api/auth";

  const user: RegisterPayload = {
    firstName: "Jane",
    lastName: "Doe",
    emailAddress: "jane.doe@example.com",
    password: "janedoe123",
    role: "ADMIN",
  };

  await cleanupDatabase();

  await request(app).post(`${BASE_URL}/register`).send(user);

  const res = await request(app).post(`${BASE_URL}/login`).send({
    emailAddress: user.emailAddress,
    password: user.password,
  });

  return res.body.token as string;
};

export default setupTestAuth;