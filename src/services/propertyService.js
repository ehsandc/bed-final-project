import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getAllProperties(req, res, next) {
  try {
    const { location, pricePerNight } = req.query;
    let where = {};
    if (location) where.location = location;
    if (pricePerNight) where.pricePerNight = parseFloat(pricePerNight);

    const properties = await prisma.property.findMany({ where });
    res.json(properties);
  } catch (err) {
    next(err);
  }
}

export async function createProperty(req, res, next) {
  try {
    const {
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      hostId,
      rating,
    } = req.body;
    const property = await prisma.property.create({
      data: {
        title,
        description,
        location,
        pricePerNight,
        bedroomCount,
        bathRoomCount,
        maxGuestCount,
        hostId,
        rating,
      },
    });
    res.status(201).json(property);
  } catch (err) {
    next(err);
  }
}

export async function getPropertyById(req, res, next) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
    });
    if (!property) return res.status(404).json({ error: "Property not found" });
    res.json(property);
  } catch (err) {
    next(err);
  }
}

export async function updateProperty(req, res, next) {
  try {
    const {
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      hostId,
      rating,
    } = req.body;
    const property = await prisma.property.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        location,
        pricePerNight,
        bedroomCount,
        bathRoomCount,
        maxGuestCount,
        hostId,
        rating,
      },
    });
    res.json(property);
  } catch (err) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Property not found" });
    } else {
      next(err);
    }
  }
}

export async function deleteProperty(req, res, next) {
  try {
    await prisma.property.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "Property deleted" });
  } catch (err) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Property not found" });
    } else {
      next(err);
    }
  }
}
