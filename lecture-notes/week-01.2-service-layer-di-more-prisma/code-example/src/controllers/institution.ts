import { Request, Response, NextFunction } from "express";

import institutionService from "../services/institution.js";

import {
  InstitutionParams,
  CreateInstitutionBody,
  UpdateInstitutionBody,
} from "../types/institution.js";

const createInstitution = async (
  req: Request<{}, {}, CreateInstitutionBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, region, country } = req.body;
    const institution = await institutionService.create({
      name,
      region,
      country,
    });
    res.status(201).json({
      message: "Institution successfully created",
      data: institution,
    });
  } catch (err) {
    next(err);
  }
};

const getInstitutions = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      name,
      region,
      country,
      sortBy = "id",
      sortOrder = "asc",
      page = "1",
      pageSize = "10",
    } = req.query as Record<string, string>;

    const filters: Record<string, string> = {};
    if (name) filters.name = name;
    if (region) filters.region = region;
    if (country) filters.country = country;

    const validSortOrders = ["asc", "desc"];
    const order = validSortOrders.includes(sortOrder.toLowerCase())
      ? sortOrder.toLowerCase()
      : "asc";

    const validSortFields = ["id", "name", "region", "country"];
    const fields = validSortFields.includes(sortBy.toLowerCase())
      ? sortBy.toLowerCase()
      : "id";

    const institutions = await institutionService.getAll(
      filters,
      fields,
      order,
      page,
      pageSize,
    );

    res.status(200).json({
      data: institutions.data,
      pagination: institutions.pagination,
    });
  } catch (err) {
    next(err);
  }
};

const getInstitution = async (
  req: Request<InstitutionParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const institution = await institutionService.getById(req.params.id);
    res.status(200).json({ data: institution });
  } catch (err) {
    next(err);
  }
};

const updateInstitution = async (
  req: Request<InstitutionParams, {}, UpdateInstitutionBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, region, country } = req.body;
    const institution = await institutionService.update(req.params.id, {
      name,
      region,
      country,
    });
    res.status(200).json({
      message: `Institution with the id: ${req.params.id} successfully updated`,
      data: institution,
    });
  } catch (err) {
    next(err);
  }
};

const deleteInstitution = async (
  req: Request<InstitutionParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await institutionService.delete(req.params.id);
    res.status(200).json({
      message: `Institution with the id: ${req.params.id} successfully deleted`,
    });
  } catch (err) {
    next(err);
  }
};

export {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
};
