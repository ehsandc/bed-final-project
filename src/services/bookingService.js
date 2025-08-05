import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getAllBookings(req, res, next) {
  try {
    const { userId } = req.query;
    let where = {};
    if (userId) where.userId = userId;

    const bookings = await prisma.booking.findMany({ where });
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
    const booking = await prisma.booking.create({
      data: {
        userId,
        propertyId,
        checkinDate,
        checkoutDate,
        numberOfGuests,
        totalPrice,
        bookingStatus,
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
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: {
        userId,
        propertyId,
        checkinDate,
        checkoutDate,
        numberOfGuests,
        totalPrice,
        bookingStatus,
      },
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
