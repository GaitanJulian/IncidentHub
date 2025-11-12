import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../utils/config";
import { prisma } from "../utils/prisma";
import { Role } from "@prisma/client";

export interface JwtPayload { uid: string; role: Role; }

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });
  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
    const user = await prisma.user.findUnique({ where: { id: payload.uid } });
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    (req as any).user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as { role: Role } | undefined;
    if (!user || !roles.includes(user.role)) return res.status(403).json({ message: "Forbidden" });
    next();
  };
}
