/**
 * @file This file exports the base functions to handle the routes.
 * @author Grayson Orr
 */

import prisma from "../prisma/prisma.js";
import STATUS_CODES from "../utils/statusCode.js";

const capitaliseFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const createResource = async (req, res, model) => {
  try {
    const contentType = req.headers["content-type"];
    if (!contentType || contentType !== "application/json") {
      return res.status(400).json({
        msg: "Invalid Content-Type. Expected application/json.",
      });
    }

    await prisma[model].create({
      data: { ...req.body },
    });

    const newResources = await prisma[model].findMany();

    return res.status(STATUS_CODES.CREATED).json({
      msg: `${capitaliseFirstLetter(model)} successfully created`,
      data: newResources,
    });
  } catch (err) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      msg: err.message,
    });
  }
};

const getResources = async (req, res, model) => {
  const paginationDefault = {
    amount: 10, // The number of items per page
    page: 1, // The page number
  };

  try {
    const sortBy = req.query.sortBy || "id";
    const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";

    const amount = req.query.amount || paginationDefault.amount;
    const page = req.query.page || paginationDefault.page;

    const query = {
      take: Number(amount),
      skip: (Number(page) - 1) * Number(amount),
      orderBy: {
        [sortBy]: sortOrder,
      },
    };

    const where = {};
    Object.keys(req.query).forEach((param) => {
      if (
        param !== "sortBy" &&
        param !== "sortOrder" &&
        param !== "amount" &&
        param !== "page"
      ) {
        where[param] = { equals: req.query[param] || undefined };
      }
    });

    if (Object.keys(where).length > 0) {
      query.where = where;
    }

    const resources = await prisma[model].findMany(query);

    if (resources.length === 0) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: `No ${model}s found`, data: [] });
    }

    const totalResources = await prisma[model].count({
      where,
    });

    const nextPage =
      Number(page) < Math.ceil(totalResources / amount)
        ? Number(page) + 1
        : null;
    const previousPage = Number(page) > 1 ? Number(page) - 1 : null;

    return res.json({
      data: resources,
      nextPage,
      previousPage,
    });
  } catch (err) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      msg: err.message,
    });
  }
};

const getResource = async (req, res, model) => {
  try {
    const resource = await prisma[model].findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!resource) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: `No ${model} with the id: ${req.params.id} found` });
    }

    return res.json({
      data: resource,
    });
  } catch (err) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      msg: err.message,
    });
  }
};

const updateResource = async (req, res, model) => {
  try {
    const contentType = req.headers["content-type"];
    if (!contentType || contentType !== "application/json") {
      return res.status(400).json({
        msg: "Invalid Content-Type. Expected application/json.",
      });
    }

    let resource = await prisma[model].findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!resource) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: `No ${model} with the id: ${req.params.id} found` });
    }

    resource = await prisma[model].update({
      where: { id: Number(req.params.id) },
      data: { ...req.body },
    });

    return res.json({
      msg: `${capitaliseFirstLetter(model)} with the id: ${
        req.params.id
      } successfully updated`,
      data: resource,
    });
  } catch (err) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      msg: err.message,
    });
  }
};

const deleteResource = async (req, res, model) => {
  try {
    const resource = await prisma[model].findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!resource) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: `No ${model} with the id: ${req.params.id} found` });
    }

    await prisma[model].delete({
      where: { id: Number(req.params.id) },
    });

    return res.json({
      msg: `${capitaliseFirstLetter(model)} with the id: ${
        req.params.id
      } successfully deleted`,
    });
  } catch (err) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      msg: err.message,
    });
  }
};

export {
  createResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
};
