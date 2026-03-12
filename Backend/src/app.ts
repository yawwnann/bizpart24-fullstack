import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middlewares/error.middleware";
import routes from "./routes";

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin:
      process.env.FRONTEND_URL || "https://bizpart24-fullstack.vercel.app/",
    credentials: true,
  }),
);
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use("/api", routes);

// Error Handling
app.use(errorHandler);

export default app;
