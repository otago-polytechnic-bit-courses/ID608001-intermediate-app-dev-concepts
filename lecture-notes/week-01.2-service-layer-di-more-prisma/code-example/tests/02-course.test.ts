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

  let departmentId: string;
  let courseOneId: string;

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
    departmentId = global.testDepartmentId;
  });

  it("should create course one", async () => {
    const res = await request(app)
      .post(BASE_URL)
      .send({
        name: courseData[0].name,
        code: courseData[0].code,
        description: courseData[0].description,
        departmentId,
      });

    expect(res.status).to.equal(201);

    const newCourse = res.body.data.find(
      (d: CourseData & { id: string }) => d.name === courseData[0].name,
    );
    courseOneId = newCourse.id;
  });

  it("should get all courses", async () => {
    const res = await request(app).get(BASE_URL);

    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.at.least(1);
  });

  it("should get course one by ID", async () => {
    const res = await request(app).get(`${BASE_URL}/${courseOneId}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.name).to.equal(courseData[0].name);
  });

  it("should update course one", async () => {
    const res = await request(app)
      .put(`${BASE_URL}/${courseOneId}`)
      .send({ name: courseData[1].name, departmentId });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Course with the id: ${courseOneId} successfully updated`,
    );
    expect(res.body.data.name).to.equal(courseData[1].name);
  });

  it("should delete course one", async () => {
    const res = await request(app).delete(`${BASE_URL}/${courseOneId}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Course with the id: ${courseOneId} successfully deleted`,
    );
  });

  after(async () => {
    await cleanupDatabase();
    await disconnectPrisma();
  });
});
  