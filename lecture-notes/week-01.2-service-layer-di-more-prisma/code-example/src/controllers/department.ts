import { Request, Response, NextFunction } from "express";

import departmentService from "../services/department.js";

import {
  DepartmentParams,
  CreateDepartmentBody,
  UpdateDepartmentBody,
} from "../types/department.js";

const createDepartment = async (
  req: Request<{}, {}, CreateDepartmentBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, institutionId } = req.body;
    const departments = await departmentService.create({
      name,
      institutionId,
    });
    res.status(201).json({
      message: "Department successfully created",
      data: departments,
    });
  } catch (err) {
    next(err);
  }
};

const getDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      name,
      institutionId,
      sortBy = "id",
      sortOrder = "asc",
      page = "1",
      pageSize = "10",
    } = req.query as Record<string, string>;

    const filters: Record<string, string> = {};
    if (name) filters.name = name;
    if (institutionId) filters.institutionId = institutionId;

    const validSortOrders = ["asc", "desc"];
    const order = validSortOrders.includes(sortOrder.toLowerCase())
      ? sortOrder.toLowerCase()
      : "asc";

    const validSortFields = ["id", "name", "institutionId"];
    const fields = validSortFields.includes(sortBy.toLowerCase())
      ? sortBy.toLowerCase()
      : "id";

    const result = await departmentService.getAll(
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

const getDepartment = async (
  req: Request<DepartmentParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const department = await departmentService.getById(req.params.id);
    res.status(200).json({ data: department });
  } catch (err) {
    next(err);
  }
};

const updateDepartment = async (
  req: Request<DepartmentParams, {}, UpdateDepartmentBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, institutionId } = req.body;

    const department = await departmentService.update(req.params.id, {
      name,
      institutionId,
    });
    res.status(200).json({
      message: `Department with the id: ${req.params.id} successfully updated`,
      data: department,
    });
  } catch (err) {
    next(err);
  }
};

const deleteDepartment = async (
  req: Request<DepartmentParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await departmentService.delete(req.params.id);
    res.status(200).json({
      message: `Department with the id: ${req.params.id} successfully deleted`,
    });
  } catch (err) {
    next(err);
  }
};

export {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
};
