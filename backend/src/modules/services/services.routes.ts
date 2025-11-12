import { Router } from "express";
import { prisma } from "../../utils/prisma";
import { requireAuth, requireRole } from "../../middleware/auth";
import { Role } from "@prisma/client";
import { z } from "zod";

const router = Router();

// GET /services – cualquier usuario autenticado
router.get("/", requireAuth, async (_req, res) => {
  const data = await prisma.service.findMany({ orderBy: { name: "asc" } });
  res.json(data);
});

// POST /services – solo ADMIN
router.post("/", requireAuth, requireRole(Role.ADMIN), async (req, res) => {
  const body = z.object({ name: z.string().min(2) }).safeParse(req.body);
  if (!body.success) return res.status(400).json({ message: "Invalid name" });

  const created = await prisma.service.create({ data: { name: body.data.name } });
  res.status(201).json(created);
});

export default router;
