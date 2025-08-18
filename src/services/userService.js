import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export async function getAllUsers(req, res, next) {
  try {
    const { username, email } = req.query;
    const where = {};
    if (username) where.username = username;
    if (email) where.email = email;

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        pictureUrl: true,
      },
    });

    if ((username || email) && users.length === 0)
      return res
        .status(404)
        .json({ error: "No users found matching the criteria" });

    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function createUser(req, res, next) {
  try {
    const { username, password, name, email, phoneNumber, pictureUrl } =
      req.body;
    if (!username || !password)
      return res.status(400).json({ error: "username and password required" });

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return res.status(409).json({ error: "Username exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashed,
        name: name || "",
        email: email || "",
        phoneNumber: phoneNumber || "",
        pictureUrl: pictureUrl || "",
      },
    });

    res.status(201).json({ ...user, password: undefined });
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        pictureUrl: true,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const { username, password, name, email, phoneNumber, pictureUrl } =
      req.body;
    const data = {};
    if (username !== undefined) data.username = username;
    if (password !== undefined) data.password = await bcrypt.hash(password, 10);
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (phoneNumber !== undefined) data.phoneNumber = phoneNumber;
    if (pictureUrl !== undefined) data.pictureUrl = pictureUrl;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ ...user, password: undefined });
  } catch (err) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "User not found" });
    } else {
      next(err);
    }
  }
}

export async function deleteUser(req, res, next) {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "User deleted" });
  } catch (err) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "User not found" });
    } else {
      next(err);
    }
  }
}
