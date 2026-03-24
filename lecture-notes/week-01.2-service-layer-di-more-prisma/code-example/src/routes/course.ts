import express from "express";

import {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course.js";

import jwtAuth from "../middleware/jwtAuth.js";

import rbac from "../middleware/rbac.js";

import rateLimiter from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/", createCourse);
router.get("/", getCourses);
router.get("/:id", getCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;
