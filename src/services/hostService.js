import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getAllHosts(req, res, next) {
  try {
    const { name } = req.query;
    let where = {};
    if (name) where.name = name;

    const hosts = await prisma.host.findMany({ where });
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
    const host = await prisma.host.create({
      data: {
        username,
        password,
        name,
        email,
        phoneNumber,
        pictureUrl,
        aboutMe,
      },
    });
    res.status(201).json(host);
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
    const host = await prisma.host.update({
      where: { id: req.params.id },
      data: {
        username,
        password,
        name,
        email,
        phoneNumber,
        pictureUrl,
        aboutMe,
      },
    });
    res.json(host);
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
