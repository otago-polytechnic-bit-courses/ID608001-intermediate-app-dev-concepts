import { Request, Response, NextFunction } from "express";

const rbac = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    // Check if the user is authenticated and has a role
    if (!user || !user.role) {
      return res
        .status(403)
        .json({ message: "Forbidden. User is not authenticated" });
    }

    // Check if the user's role matches the required role
    if (user.role !== requiredRole) {
      return res.status(403).json({
        message: `Forbidden. Insufficient privileges for role: ${user.role}`,
      });
    }

    next();
  };
};

export default rbac;
