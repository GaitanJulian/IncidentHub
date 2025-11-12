import express from "express";
import cors from "cors";
import helmet from "helmet";
import { requestId } from "./middleware/requestId";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler";

import swaggerUi from "swagger-ui-express";
import { openapiSpec } from "./docs/openapi";

import authRoutes from "./modules/auth/auth.routes";
import serviceRoutes from "./modules/services/services.routes";
import incidentRoutes from "./modules/incidents/incidents.routes";

import { authLimiter } from "./middleware/rateLimit";

export const app = express();

app.use("/auth", authLimiter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use(requestId);

morgan.token("rid", (req) => (req as any).requestId as string);
app.use(morgan(':method :url :status :response-time ms rid=:rid'));

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