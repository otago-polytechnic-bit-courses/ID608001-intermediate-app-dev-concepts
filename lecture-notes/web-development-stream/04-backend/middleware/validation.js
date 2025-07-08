import Joi from "joi";

import STATUS_CODES from "../utils/statusCode.js";

const institutionSchema = Joi.object({
  name: Joi.string().min(3).max(100).messages({
    "string.base": "name should be a string",
    "string.empty": "name cannot be empty",
    "string.min": "name should have a minimum length of {#limit}",
    "string.max": "name should have a maximum length of {#limit}",
  }),
  region: Joi.string().min(3).max(100).messages({
    "string.base": "region should be a string",
    "string.empty": "region cannot be empty",
    "string.min": "region should have a minimum length of {#limit}",
    "string.max": "region should have a maximum length of {#limit}",
  }),
  country: Joi.string().min(3).max(100).messages({
    "string.base": "country should be a string",
    "string.empty": "country cannot be empty",
    "string.min": "country should have a minimum length of {#limit}",
    "string.max": "country should have a maximum length of {#limit}",
  }),
});

const validateSchema = (schema, isRequired = false) => {
  return (req, res, next) => {
    const { error } = isRequired
      ? schema.required().validate(req.body)
      : schema.validate(req.body);

    if (error) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        msg: error.details[0].message,
      });
    }

    next();
  };
};

const validatePostInstitution = validateSchema(institutionSchema, true);
const validatePutInstitution = validateSchema(institutionSchema);

export { validatePostInstitution, validatePutInstitution };
