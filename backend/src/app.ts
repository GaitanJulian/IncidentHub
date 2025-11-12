import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler";

import swaggerUi from "swagger-ui-express";
import { openapiSpec } from "./docs/openapi";

import authRoutes from "./modules/auth/auth.routes";
import serviceRoutes from "./modules/services/services.routes";
import incidentRoutes from "./modules/incidents/incidents.routes";

export const app = express();

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => res.json({ ok: true, name: "IncidentHub API" }));
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/auth", authRoutes);
app.use("/services", serviceRoutes);
app.use("/incidents", incidentRoutes);

app.use(errorHandler);