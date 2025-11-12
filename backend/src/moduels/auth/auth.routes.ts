import { Router } from "express";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../utils/config";
import { Role } from "@prisma/client";
import { z } from "zod";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
  role: z.enum(["REPORTER", "SUPPORT", "ADMIN"]).optional(),
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid data" });

  const { email, name, password, role } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ message: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, name, passwordHash, role: (role as Role) ?? Role.REPORTER },
  });

  res.status(201).json({ id: user.id, email: user.email, name: user.name, role: user.role });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid credentials" });

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ uid: user.id, role: user.role }, config.jwtSecret, { expiresIn: "1d" });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

export default router;
