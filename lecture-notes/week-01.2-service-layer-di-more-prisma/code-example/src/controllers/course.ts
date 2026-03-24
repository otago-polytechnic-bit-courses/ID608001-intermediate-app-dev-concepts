import { Request, Response, NextFunction } from "express";

import courseService from "../services/course.js";

import {
  CourseParams,
  CreateCourseBody,
  UpdateCourseBody,
} from "../types/course.js";

const createCourse = async (
  req: Request<{}, {}, CreateCourseBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, code, description, departmentId } = req.body;
    const courses = await courseService.create({
      name,
      code,
      description,
      department: { connect: { id: departmentId } },
    });
    res.status(201).json({
      message: "Course successfully created",
      data: courses,
    });
  } catch (err) {
    next(err);
  }
};

const getCourses = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      name,
      code,
      description,
      departmentId,
      sortBy = "id",
      sortOrder = "asc",
      page = "1",
      pageSize = "10",
    } = req.query as Record<string, string>;

    const filters: Record<string, string> = {};
    if (name) filters.name = name;
    if (code) filters.code = code;
    if (description) filters.description = description;
    if (departmentId) filters.departmentId = departmentId;

    const validSortOrders = ["asc", "desc"];
    const order = validSortOrders.includes(sortOrder.toLowerCase())
      ? sortOrder.toLowerCase()
      : "asc";

    const validSortFields = [
      "id",
      "name",
      "code",
      "description",
      "departmentId",
    ];
    const fields = validSortFields.includes(sortBy.toLowerCase())
      ? sortBy.toLowerCase()
      : "id";

    const result = await courseService.getAll(
      filters,
      fields,
      order,
      page,
      pageSize,
    );

    res.status(200).json({
      data: result.data,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};

const getCourse = async (
  req: Request<CourseParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const course = await courseService.getById(req.params.id);
    res.status(200).json({ data: course });
  } catch (err) {
    next(err);
  }
};

const updateCourse = async (
  req: Request<CourseParams, {}, UpdateCourseBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, code, description, departmentId } = req.body;

    const course = await courseService.update(req.params.id, {
      name,
      code,
      description,
      department: { connect: { id: departmentId } },
    });
    res.status(200).json({
      message: `Course with the id: ${req.params.id} successfully updated`,
      data: course,
    });
  } catch (err) {
    next(err);
  }
};

const deleteCourse = async (
  req: Request<CourseParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await courseService.delete(req.params.id);
    res.status(200).json({
      message: `Course with the id: ${req.params.id} successfully deleted`,
    });
  } catch (err) {
    next(err);
  }
};

export { createCourse, getCourses, getCourse, updateCourse, deleteCourse };
