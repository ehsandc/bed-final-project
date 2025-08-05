import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getAllUsers(req, res, next) {
  try {
    const { username, email } = req.query;
    let where = {};
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
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function createUser(req, res, next) {
  try {
    const { username, password, name, email, phoneNumber, pictureUrl } =
      req.body;
    const user = await prisma.user.create({
      data: { username, password, name, email, phoneNumber, pictureUrl },
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
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { username, password, name, email, phoneNumber, pictureUrl },
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
    await prisma.user.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "User deleted" });
  } catch (err) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "User not found" });
    } else {
      next(err);
    }
  }
}
