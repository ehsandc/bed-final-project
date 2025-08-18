import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getAllBookings(req, res, next) {
  try {
    const { userId } = req.query;
    let where = {};
    if (userId) where.userId = userId;

    const bookings = await prisma.booking.findMany({ where });
    if (userId && bookings.length === 0)
      return res.status(404).json({ error: "No bookings found for the user" });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

export async function createBooking(req, res, next) {
  try {
    const {
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
    } = req.body;
    // Basic validation
    if (
      !userId ||
      !propertyId ||
      !checkinDate ||
      !checkoutDate ||
      !numberOfGuests
    )
      return res.status(400).json({ error: "missing required fields" });
    const guests = Number(numberOfGuests);
    if (!Number.isInteger(guests) || guests < 1)
      return res
        .status(400)
        .json({ error: "numberOfGuests must be integer >= 1" });
    if (totalPrice != null && Number(totalPrice) < 0)
      return res.status(400).json({ error: "totalPrice must be >= 0" });

    const ci = new Date(checkinDate);
    const co = new Date(checkoutDate);
    if (isNaN(ci.getTime()) || isNaN(co.getTime()) || ci >= co)
      return res.status(400).json({ error: "Invalid checkin/checkout dates" });

    // Ensure user and property exist
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });
    if (!property) return res.status(404).json({ error: "Property not found" });
    const booking = await prisma.booking.create({
      data: {
        userId,
        propertyId,
        checkinDate: ci,
        checkoutDate: co,
        numberOfGuests: guests,
        totalPrice: totalPrice != null ? Number(totalPrice) : 0,
        bookingStatus: bookingStatus || "confirmed",
      },
    });
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
}

export async function getBookingById(req, res, next) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    next(err);
  }
}

export async function updateBooking(req, res, next) {
  try {
    const {
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
    } = req.body;
    const data = {};
    if (userId !== undefined) data.userId = userId;
    if (propertyId !== undefined) data.propertyId = propertyId;
    if (checkinDate !== undefined) data.checkinDate = new Date(checkinDate);
    if (checkoutDate !== undefined) data.checkoutDate = new Date(checkoutDate);
    if (numberOfGuests !== undefined) {
      const guests = Number(numberOfGuests);
      if (!Number.isInteger(guests) || guests < 1)
        return res
          .status(400)
          .json({ error: "numberOfGuests must be integer >= 1" });
      data.numberOfGuests = guests;
    }
    if (totalPrice !== undefined) {
      if (Number(totalPrice) < 0)
        return res.status(400).json({ error: "totalPrice must be >= 0" });
      data.totalPrice = Number(totalPrice);
    }
    if (bookingStatus !== undefined) data.bookingStatus = bookingStatus;

    // validate date ordering if both provided
    if (
      data.checkinDate &&
      data.checkoutDate &&
      data.checkinDate >= data.checkoutDate
    )
      return res.status(400).json({ error: "Invalid checkin/checkout dates" });

    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data,
    });
    res.json(booking);
  } catch (err) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Booking not found" });
    } else {
      next(err);
    }
  }
}

export async function deleteBooking(req, res, next) {
  try {
    await prisma.booking.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "Booking deleted" });
  } catch (err) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Booking not found" });
    } else {
      next(err);
    }
  }
}
