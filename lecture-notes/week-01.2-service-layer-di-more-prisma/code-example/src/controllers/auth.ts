import { Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "../../prisma/db.js";

import { RegisterBody, LoginBody } from "../types/auth.js";

const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { firstName, lastName, emailAddress, password, role } = req.body;

    // Check if user already exists by email address
    const user = await prisma.user.findUnique({
      where: { emailAddress },
    });

    if (user) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    // Generate a random salt to make the password hash unique
    const salt = await bcryptjs.genSalt();

    // Hash the password with the generated salt
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create a new user with the hashed password
    const createdUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        emailAddress,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        emailAddress: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({
      message: "User successfully registered",
      data: createdUser,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { emailAddress, password } = req.body;

    // Find user by email address
    const user = await prisma.user.findUnique({ where: { emailAddress } });

    if (!user) {
      res.status(401).json({ message: "Invalid email address" });
      return;
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    const { JWT_SECRET, JWT_LIFETIME } = process.env;

    if (!JWT_SECRET || !JWT_LIFETIME) {
      res.status(500).json({
        message:
          "JWT_SECRET and JWT_LIFETIME must be defined in environment variables",
      });
      return;
    }

    // Create a JWT token with the user's ID and role
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      JWT_SECRET as string,
      { expiresIn: JWT_LIFETIME },
    );

    res.status(200).json({
      message: "User successfully logged in",
      token: token,
    });
  } catch (err) {
    next(err);
  }
};

export { register, login };
