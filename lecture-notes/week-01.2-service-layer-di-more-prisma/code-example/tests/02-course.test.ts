import { expect } from "chai";
import request from "supertest";

import app from "../src/app.js";
import { cleanupDatabase, disconnectPrisma } from "./helpers/db.js";

interface CourseData {
  name: string;
  code: string;
  description: string;
}

describe("Course CRUD", () => {
  const BASE_URL = "/api/courses";

  let institutionId: string;
  let departmentOneId: string;

  const courseData: CourseData[] = [
    {
      name: "Introduction to Programming",
      code: "CS101",
      description: "Basic programming concepts",
    },
    {
      name: "Advanced Algorithms",
      code: "CS301",
      description: "In-depth study of algorithms",
    },
    {
      name: "Data Structures",
      code: "CS201",
      description: "Study of data organization",
    },
  ];

  before(async () => {
    institutionId = global.testInstitutionId;
  });

  it("should create department one", async () => {
    const res = await request(app)
      .post(BASE_URL)
      .send({ name: courseData[0].name, code: courseData[0].code, description: courseData[0].description, institutionId });

    expect(res.status).to.equal(201);

    const newDepartment = res.body.data.find(
      (d: DepartmentData & { id: string }) => d.name === courseData[0].name,
    );
    departmentOneId = newDepartment.id;
  });

  it("should get all departments", async () => {
    const res = await request(app).get(BASE_URL);

    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.at.least(1);
  });

  it("should get department one by ID", async () => {
    const res = await request(app).get(`${BASE_URL}/${departmentOneId}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.name).to.equal(courseData[0].name);
  });

  it("should update department one", async () => {
    const res = await request(app)
      .put(`${BASE_URL}/${departmentOneId}`)
      .send({ name: courseData[1].name, institutionId });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Department with the id: ${departmentOneId} successfully updated`,
    );
    expect(res.body.data.name).to.equal(courseData[1].name);
  });

  it("should delete department one", async () => {
    const res = await request(app).delete(`${BASE_URL}/${departmentOneId}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Department with the id: ${departmentOneId} successfully deleted`,
    );
  });

  after(async () => {
    await cleanupDatabase();
    await disconnectPrisma();
  });
});
