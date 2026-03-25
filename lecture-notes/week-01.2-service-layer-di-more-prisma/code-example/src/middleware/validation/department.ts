import { Request, Response, NextFunction } from "express";
import Joi from "joi";

import {
  CreateDepartmentBody,
  UpdateDepartmentBody,
} from "../../types/department.js";

const validatePostDepartment = (
  req: Request<{}, {}, CreateDepartmentBody>,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      "string.base": "name should be a string",
      "string.empty": "name cannot be empty",
      "string.min": "name should have a minimum length of {#limit}",
      "string.max": "name should have a maximum length of {#limit}",
      "any.required": "name is required",
    }),
    institutionId: Joi.string().uuid().required().messages({
      "string.base": "institutionId should be a string",
      "string.guid": "institutionId must be a valid UUID",
      "string.empty": "institutionId cannot be empty",
      "any.required": "institutionId is required",
    }),
  });

  const { name, institutionId } = req.body;

  const { error } = schema.validate(
    { name, institutionId },
    {
      abortEarly: false,
      convert: false,
    }
  );

  if (error) {
    const formattedErrors = error.details.map(({ message, type }) => ({
      message,
      type,
    }));
    return res.status(409).json({ errors: formattedErrors });
  }

  next();
};

const validatePutDepartment = (
  req: Request<{}, {}, UpdateDepartmentBody>,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).optional().messages({
      "string.base": "name should be a string",
      "string.empty": "name cannot be empty",
      "string.min": "name should have a minimum length of {#limit}",
      "string.max": "name should have a maximum length of {#limit}",
    }),
    institutionId: Joi.string().uuid().optional().messages({
      "string.base": "institutionId should be a string",
      "string.guid": "institutionId must be a valid UUID",
      "string.empty": "institutionId cannot be empty",
    }),
  })
    .min(1)
    .messages({
      "object.min": "at least one field must be provided for update",
    });

  const { name, institutionId } = req.body;

  const { error } = schema.validate(
    { name, institutionId },
    {
      abortEarly: false,
      convert: false,
    }
  );

  if (error) {
    const formattedErrors = error.details.map(({ message, type }) => ({
      message,
      type,
    }));
    return res.status(409).json({ errors: formattedErrors });
  }

  next();
};

export { validatePostDepartment, validatePutDepartment };