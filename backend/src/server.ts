import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { env } from "./config/env";
import apiRouter from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import { apiLimiter } from "./middlewares/rateLimiter";

const app = express();

// --- 1. Global Middlewares ---
// Security Headers
app.use(helmet());

// CORS Configuration (Adjust origin in production)
app.use(
  cors({
    origin: env.NODE_ENV === "production" ? false : "*", // Restrict origins in production as needed
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Response Compression
app.use(compression());

// --- 2. Rate Limiting ---
app.use("/api", apiLimiter);

// --- 3. Routes ---
// Health Check Endpoint
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Rent Desk Backend API is active",
    timestamp: new Date().toISOString(),
  });
});

// Main API Router
app.use("/api", apiRouter);

// --- 4. Global Error Handling Middleware ---
app.use(errorHandler);

// --- 5. Start Server ---
app.listen(env.PORT, () => {
  console.log(`🚀 Server is running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});