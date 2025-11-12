import { Router } from "express";
import { prisma } from "../../utils/prisma";
import { requireAuth, requireRole } from "../../middleware/auth";
import { Role, IncidentStatus, Severity } from "@prisma/client";
import { z } from "zod";

const router = Router();

// GET /incidents?status=&service=
router.get("/", requireAuth, async (req, res) => {
  const { status, service } = req.query as { status?: IncidentStatus; service?: string };
  const where: any = {};
  if (status) where.status = status;
  if (service) where.service = { name: { contains: service, mode: "insensitive" } };

  const data = await prisma.incident.findMany({
    where,
    include: { service: true, reporter: true, assignee: true, updates: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(data);
});

// POST /incidents – cualquier autenticado (reporter/support/admin)
const createSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  serviceId: z.string(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
});

router.post("/", requireAuth, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid data" });

  const { title, description, serviceId, severity } = parsed.data;
  const user = (req as any).user;

  const created = await prisma.incident.create({
    data: {
      title,
      description,
      serviceId,
      reporterId: user.id,
      severity: (severity as Severity) ?? Severity.MEDIUM,
    },
  });

  res.status(201).json(created);
});

// PUT /incidents/:id/status – solo SUPPORT/ADMIN
const statusSchema = z.object({ status: z.enum(["OPEN", "INVESTIGATING", "RESOLVED"]) });

router.put("/:id/status", requireAuth, requireRole(Role.SUPPORT, Role.ADMIN), async (req, res) => {
  const { id } = req.params;
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid status" });

  const updated = await prisma.incident.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  res.json(updated);
});

// POST /incidents/:id/comment – cualquier autenticado
const commentSchema = z.object({ message: z.string().min(2) });

router.post("/:id/comment", requireAuth, async (req, res) => {
  const { id } = req.params;
  const parsed = commentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid message" });

  const user = (req as any).user;
  const created = await prisma.incidentUpdate.create({
    data: { incidentId: id, userId: user.id, message: parsed.data.message },
  });

  res.status(201).json(created);
});

export default router;
