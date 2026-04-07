import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * JWT authentication middleware.
 *
 * Expects the request to carry an Authorization header in the form:
 *   Authorization: Bearer <token>
 *
 * On success — attaches `req.user = { _id: string }` and calls next().
 * On failure — returns 401 immediately.
 */
export function authMiddleware(req: any, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    // Normalize to a consistent shape the rest of the app can rely on
    req.user = { _id: decoded.userId };

    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}