import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.AUTH_SECRET_KEY, (err, user) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}
