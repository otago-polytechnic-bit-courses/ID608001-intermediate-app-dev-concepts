import { expect } from "chai";
import request from "supertest";

import app from "../src/app.js";

interface DepartmentData {
  name: string;
}

describe("Department CRUD", () => {
  const BASE_URL = "/api/departments";

  let token: string;
  let institutionId: string;
  let departmentOneId: string;
  let departmentTwoId: string;

  const departmentData: DepartmentData[] = [
    { name: "Information Technology" },
    { name: "Nursing" },
    { name: "Business" },
  ];

  before(async () => {
    token = global.testToken;
    institutionId = global.testInstitutionId;
  });

  it("should create department one", async () => {
    const res = await request(app)
      .post(BASE_URL)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: departmentData[0].name, institutionId });

    expect(res.status).to.equal(201);

    departmentOneId = res.body.data.id;
  });

  it("should create department two", async () => {
    const res = await request(app)
      .post(BASE_URL)
      .set("Authorization", `Bearer ${token}`)

      .send({ name: departmentData[1].name, institutionId });

    expect(res.status).to.equal(201);

    departmentTwoId = res.body.data.id;
  });

  it("should get all departments", async () => {
    const res = await request(app).get(BASE_URL);

    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.at.least(1);
  });

  it("should get department one by ID", async () => {
    const res = await request(app).get(`${BASE_URL}/${departmentOneId}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.name).to.equal(departmentData[0].name);
  });

  it("should update department one", async () => {
    const res = await request(app)
      .put(`${BASE_URL}/${departmentOneId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: departmentData[1].name, institutionId });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Department with the id: ${departmentOneId} successfully updated`,
    );
    expect(res.body.data.name).to.equal(departmentData[1].name);
  });

  it("should delete department one", async () => {
    const res = await request(app)
      .delete(`${BASE_URL}/${departmentOneId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Department with the id: ${departmentOneId} successfully deleted`,
    );
  });

  after(async () => {
    global.testDepartmentId = departmentTwoId;
  });
});
