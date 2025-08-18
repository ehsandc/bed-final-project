import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export async function getAllHosts(req, res, next) {
  try {
    const { name } = req.query;
    let where = {};
    if (name) where.name = name;

    const hosts = await prisma.host.findMany({ where });
    if (name && hosts.length === 0)
      return res
        .status(404)
        .json({ error: "No hosts found matching the criteria" });
    res.json(hosts);
  } catch (err) {
    next(err);
  }
}

export async function createHost(req, res, next) {
  try {
    const {
      username,
      password,
      name,
      email,
      phoneNumber,
      pictureUrl,
      aboutMe,
    } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "username and password required" });

    const existing = await prisma.host.findUnique({ where: { username } });
    if (existing) return res.status(409).json({ error: "Username exists" });

    const hashed = await bcrypt.hash(password, 10);
    const host = await prisma.host.create({
      data: {
        username,
        password: hashed,
        name: name || "",
        email: email || "",
        phoneNumber: phoneNumber || "",
        pictureUrl: pictureUrl || "",
        aboutMe: aboutMe || "",
      },
    });
    res.status(201).json({ ...host, password: undefined });
  } catch (err) {
    next(err);
  }
}

export async function getHostById(req, res, next) {
  try {
    const host = await prisma.host.findUnique({
      where: { id: req.params.id },
    });
    if (!host) return res.status(404).json({ error: "Host not found" });
    res.json(host);
  } catch (err) {
    next(err);
  }
}

export async function updateHost(req, res, next) {
  try {
    const {
      username,
      password,
      name,
      email,
      phoneNumber,
      pictureUrl,
      aboutMe,
    } = req.body;
    const data = {};
    if (username !== undefined) data.username = username;
    if (password !== undefined) data.password = await bcrypt.hash(password, 10);
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (phoneNumber !== undefined) data.phoneNumber = phoneNumber;
    if (pictureUrl !== undefined) data.pictureUrl = pictureUrl;
    if (aboutMe !== undefined) data.aboutMe = aboutMe;

    const host = await prisma.host.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ ...host, password: undefined });
  } catch (err) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Host not found" });
    } else {
      next(err);
    }
  }
}

export async function deleteHost(req, res, next) {
  try {
    await prisma.host.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "Host deleted" });
  } catch (err) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Host not found" });
    } else {
      next(err);
    }
  }
}
