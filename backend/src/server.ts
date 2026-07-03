import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { config } from "./config/env";
import { errorMiddleware } from "./middleware/error.middleware";
import { logger } from "./utils/logger";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.env === "production" ? ["https://mydomain.com"] : "*",
    credentials: true,
  }),
);

app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: {
      success: false,
      message: "Too many request, please try again later.",
    },
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  logger.debug(`-> ${req.method} ${req.path}`);
  next();
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running.",
    env: config.env,
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorMiddleware);

app.listen(config.port, () => {
  logger.info(`Blaze API running on port ${config.port} ${[config.env]}`);
});

export default app;
