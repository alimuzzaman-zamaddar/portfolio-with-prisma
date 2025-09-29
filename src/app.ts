import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { postRouter } from "./modules/post/post.routes";
import { userRouter } from "./modules/user/user.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { projectRouter } from "./modules/project/project.routes";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes";

const app = express();

// Security middleware
app.use(helmet()); // Set security headers

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Other middleware
app.use(compression()); // Compresses response bodies for faster delivery
app.use(express.json({ limit: "10mb" })); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Parse URL-encoded bodies

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("combined"));
}

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/projects", projectRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/user", userRouter);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Default route for testing
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Portfolio Backend API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      posts: "/api/posts",
      projects: "/api/projects",
      dashboard: "/api/dashboard",
      users: "/api/user",
    },
  });
});

// Global error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Global error handler:", err);

    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }
);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    path: req.path,
    method: req.method,
  });
});

export default app;
