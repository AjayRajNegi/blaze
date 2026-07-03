import cors from "cors";
import express from "express";
import helmet from "helmet";
import { config } from "./src/config/env";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.env === "production" ? ["https://mydomain.com"] : "*",
    credentials: true,
  }),
);
