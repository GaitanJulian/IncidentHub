import type { Request, Response, NextFunction } from "express";
import { log } from "../utils/logger";

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  log("error", "unhandled_error", { path: req.path, method: req.method, err: err instanceof Error ? err.message : err });
  res.status(500).json({ message: "Internal server error" });
}
