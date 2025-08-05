import express from "express";
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

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log("Server is listening on port 3000");
  });
}

export default app;
