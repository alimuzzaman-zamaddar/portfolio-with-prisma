import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";


export function auth(requiredRole: string | null = null) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) return res.status(401).json({ message: "Missing token" });

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: number;
        role: string;
        email?: string;
      };
      req.user = payload; 
      console.log(payload, "payload from auth middleware");
      if (requiredRole && payload.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}
