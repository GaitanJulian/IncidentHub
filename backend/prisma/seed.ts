import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const pwd = await bcrypt.hash("admin12345", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@incidenthub.dev" },
    update: {},
    create: { email: "admin@incidenthub.dev", name: "Admin", passwordHash: pwd, role: Role.ADMIN },
  });

  const [svc1, svc2] = await Promise.all([
    prisma.service.upsert({ where: { name: "Customer Portal" }, update: {}, create: { name: "Customer Portal" } }),
    prisma.service.upsert({ where: { name: "Payments API" }, update: {}, create: { name: "Payments API" } }),
  ]);

  console.log("Seeded:", { admin, services: [svc1.name, svc2.name] });
}

main().finally(() => prisma.$disconnect());
