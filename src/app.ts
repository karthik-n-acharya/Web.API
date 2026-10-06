import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { openApiDocument } from "./config/openapi.js";
import chatRouter from "./routes/chat.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import healthRouter from "./routes/health.routes.js";
import swaggerUi from "swagger-ui-express";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL }));
app.use(express.json({ limit: "10kb" }));
if (env.NODE_ENV !== "production") {
  app.use("/api-docs", (_request, response, next) => {
    response.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:",
    );
    next();
  });
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
}
app.use("/api", healthRouter);
app.use("/api", chatRouter);
app.use(errorHandler);

export default app;
