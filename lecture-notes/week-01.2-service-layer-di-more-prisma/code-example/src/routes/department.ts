import express from "express";

import {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/department.js";

import jwtAuth from "../middleware/jwtAuth.js";

import rbac from "../middleware/rbac.js";

import rateLimiter from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/", jwtAuth, rbac("ADMIN"), createDepartment);
router.get("/", rateLimiter, getDepartments);
router.get("/:id", rateLimiter, getDepartment);
router.put("/:id", jwtAuth, rbac("ADMIN"), updateDepartment);
router.delete("/:id", jwtAuth, rbac("ADMIN"), deleteDepartment);

export default router;
