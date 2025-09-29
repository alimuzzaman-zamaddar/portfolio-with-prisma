import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Middleware to authenticate and attach the user to the request object
export function auth(requiredRole: string | null = null) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) return res.status(401).json({ message: "Missing token" });

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        role: string;
      };
      req.user = payload; 

      // If the route requires a specific role, check the user's role
      if (requiredRole && payload.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}
