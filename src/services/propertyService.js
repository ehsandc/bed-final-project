import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getAllProperties(req, res, next) {
  try {
    const { location, pricePerNight } = req.query;
    let where = {};
    if (location) where.location = location;
    if (pricePerNight) where.pricePerNight = parseFloat(pricePerNight);

    const properties = await prisma.property.findMany({ where });
    if ((location || pricePerNight) && properties.length === 0)
      return res
        .status(404)
        .json({ error: "No properties found matching the criteria" });
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
    // Basic validation
    if (!title || !location || !hostId)
      return res
        .status(400)
        .json({ error: "title, location and hostId are required" });
    if (pricePerNight != null && Number(pricePerNight) < 0)
      return res.status(400).json({ error: "pricePerNight must be >= 0" });
    if (bedroomCount != null && Number(bedroomCount) < 0)
      return res.status(400).json({ error: "bedroomCount must be >= 0" });
    if (bathRoomCount != null && Number(bathRoomCount) < 0)
      return res.status(400).json({ error: "bathRoomCount must be >= 0" });
    if (maxGuestCount != null && Number(maxGuestCount) < 1)
      return res.status(400).json({ error: "maxGuestCount must be >= 1" });
    const property = await prisma.property.create({
      data: {
        title,
        description,
        location,
        pricePerNight: pricePerNight != null ? Number(pricePerNight) : 0,
        bedroomCount: bedroomCount != null ? Number(bedroomCount) : 0,
        bathRoomCount: bathRoomCount != null ? Number(bathRoomCount) : 0,
        maxGuestCount: maxGuestCount != null ? Number(maxGuestCount) : 1,
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
    if (pricePerNight != null && Number(pricePerNight) < 0)
      return res.status(400).json({ error: "pricePerNight must be >= 0" });
    if (bedroomCount != null && Number(bedroomCount) < 0)
      return res.status(400).json({ error: "bedroomCount must be >= 0" });
    if (bathRoomCount != null && Number(bathRoomCount) < 0)
      return res.status(400).json({ error: "bathRoomCount must be >= 0" });
    if (maxGuestCount != null && Number(maxGuestCount) < 1)
      return res.status(400).json({ error: "maxGuestCount must be >= 1" });

    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (location !== undefined) data.location = location;
    if (pricePerNight !== undefined) data.pricePerNight = Number(pricePerNight);
    if (bedroomCount !== undefined) data.bedroomCount = Number(bedroomCount);
    if (bathRoomCount !== undefined) data.bathRoomCount = Number(bathRoomCount);
    if (maxGuestCount !== undefined) data.maxGuestCount = Number(maxGuestCount);
    if (hostId !== undefined) data.hostId = hostId;
    if (rating !== undefined) data.rating = rating;

    const property = await prisma.property.update({
      where: { id: req.params.id },
      data,
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
