import express from "express";
import cors from "cors";
import * as Sentry from "@sentry/node";
import dotenv from "dotenv";
import { logger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import usersRouter from "./routes/users.js";
import hostsRouter from "./routes/hosts.js";
import propertiesRouter from "./routes/properties.js";
import bookingsRouter from "./routes/bookings.js";
import reviewsRouter from "./routes/reviews.js";
import loginRouter from "./routes/login.js";

dotenv.config();
Sentry.init({ dsn: process.env.SENTRY_DSN });

const app = express();

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://localhost:3000",
      "https://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(Sentry.Handlers.requestHandler());
app.use(express.json());
app.use(logger);

app.use("/login", loginRouter);
app.use("/users", usersRouter);
app.use("/hosts", hostsRouter);
app.use("/properties", propertiesRouter);
app.use("/bookings", bookingsRouter);
app.use("/reviews", reviewsRouter);

app.use(Sentry.Handlers.errorHandler());
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Booking API is running",
    timestamp: new Date().toISOString(),
  });
});

if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

export default app;
