import express, { type Express } from "express";
import cors, { type CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import routes from "./api/routes/index.js";
import { sendSuccess } from "./utils/response.js";
import { centerlizedErrorHandler } from "./api/middlewares/centerlizedErrorHandler.js";
import { requestLogger } from "./api/middlewares/requestLogger.js";
import { logger } from "./utils/logger.js";

const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    logger.warn("CORS Error", {
      message: `Origin '${origin}' not allowed`,
      allowedOrigins,
    });
    return callback(new Error(`CORS policy error: Origin '${origin}' not allowed`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
  credentials: true,
};

export const app: Express = express();

app.use(requestLogger);

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to Prompt Verse Backend API",
    status: "Server is running",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      api: "/api",
      auth: "/api/auth",
      prompts: "/api/prompts",
      playground: "/api/playground",
    },
  });
});

const apiVersion = "/api/";

app.use(apiVersion, routes);

app.get("/health", (_, res) => {
  return sendSuccess(res, null, "Server is running");
});

app.use(centerlizedErrorHandler);
