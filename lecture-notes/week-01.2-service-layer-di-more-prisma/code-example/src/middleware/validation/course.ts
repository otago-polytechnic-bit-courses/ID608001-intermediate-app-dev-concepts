import { Request, Response, NextFunction } from "express";
import Joi from "joi";

import { CreateCourseBody, UpdateCourseBody } from "../../types/course.js";

const validatePostCourse = (
  req: Request<{}, {}, CreateCourseBody>,
  res: Response,
  next: NextFunction,
) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      "string.base": "name should be a string",
      "string.empty": "name cannot be empty",
      "string.min": "name should have a minimum length of {#limit}",
      "string.max": "name should have a maximum length of {#limit}",
      "any.required": "name is required",
    }),
    code: Joi.string().min(2).max(20).required().messages({
      "string.base": "code should be a string",
      "string.empty": "code cannot be empty",
      "string.min": "code should have a minimum length of {#limit}",
      "string.max": "code should have a maximum length of {#limit}",
      "any.required": "code is required",
    }),
    description: Joi.string().min(5).max(500).required().messages({
      "string.base": "description should be a string",
      "string.empty": "description cannot be empty",
      "string.min": "description should have a minimum length of {#limit}",
      "string.max": "description should have a maximum length of {#limit}",
      "any.required": "description is required",
    }),
    departmentId: Joi.string().uuid().required().messages({
      "string.base": "departmentId should be a string",
      "string.guid": "departmentId must be a valid UUID",
      "string.empty": "departmentId cannot be empty",
      "any.required": "departmentId is required",
    }),
  });

  const { name, code, description, departmentId } = req.body;

  const { error } = schema.validate(
    { name, code, description, departmentId },
    {
      abortEarly: false,
      convert: false,
    },
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

const validatePutCourse = (
  req: Request<{}, {}, UpdateCourseBody>,
  res: Response,
  next: NextFunction,
) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).optional().messages({
      "string.base": "name should be a string",
      "string.empty": "name cannot be empty",
      "string.min": "name should have a minimum length of {#limit}",
      "string.max": "name should have a maximum length of {#limit}",
    }),
    code: Joi.string().min(2).max(20).optional().messages({
      "string.base": "code should be a string",
      "string.empty": "code cannot be empty",
      "string.min": "code should have a minimum length of {#limit}",
      "string.max": "code should have a maximum length of {#limit}",
    }),
    description: Joi.string().min(5).max(500).optional().messages({
      "string.base": "description should be a string",
      "string.empty": "description cannot be empty",
      "string.min": "description should have a minimum length of {#limit}",
      "string.max": "description should have a maximum length of {#limit}",
    }),
    departmentId: Joi.string().uuid().optional().messages({
      "string.base": "departmentId should be a string",
      "string.guid": "departmentId must be a valid UUID",
      "string.empty": "departmentId cannot be empty",
    }),
  })
    .min(1)
    .messages({
      "object.min": "at least one field must be provided for update",
    });

  const { name, code, description, departmentId } = req.body;

  const { error } = schema.validate(
    { name, code, description, departmentId },
    {
      abortEarly: false,
      convert: false,
    },
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

export { validatePostCourse, validatePutCourse };
