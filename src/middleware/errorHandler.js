import * as Sentry from "@sentry/node";

export function errorHandler(err, req, res, next) {
  Sentry.captureException(err);
  res.status(500).json({
    error: "An error occurred on the server, please double-check your request!",
  });
}
