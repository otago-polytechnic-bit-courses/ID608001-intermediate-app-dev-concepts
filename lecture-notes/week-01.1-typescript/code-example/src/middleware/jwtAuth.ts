import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Look for the Authorization header which should start with 'Bearer '
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Split the header and grab the token part after 'Bearer '
    const token = authHeader.split(" ")[1];

    // Verify the token using the secret key from environment variables
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET,
    ) as jwt.JwtPayload & { id: string; role: string };

    // Add the decoded payload to the request so other routes can use it
    req.user = payload;

    // Continue to the next middleware or route
    return next();
  } catch (err) {
    // The token is missing, invalid or expired
    return res
      .status(401)
      .json({ message: "Not authorized to access this route" });
  }
};

export default jwtAuth;
