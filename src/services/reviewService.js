import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getAllReviews(req, res, next) {
  try {
    const reviews = await prisma.review.findMany();
    res.json(reviews);
  } catch (err) {
    next(err);
  }
}

export async function createReview(req, res, next) {
  try {
    const { userId, propertyId, rating, comment } = req.body;
    // Validation: missing fields
    if (!userId || !propertyId || rating === undefined)
      return res
        .status(400)
        .json({ error: "userId, propertyId and rating are required" });
    const r = Number(rating);
    if (!Number.isInteger(r) || r < 1 || r > 5)
      return res
        .status(400)
        .json({ error: "rating must be an integer between 1 and 5" });
    // Optional: ensure the referenced records exist
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });
    if (!property) return res.status(404).json({ error: "Property not found" });
    const review = await prisma.review.create({
      data: { userId, propertyId, rating: r, comment: comment || "" },
    });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
}

export async function getReviewById(req, res, next) {
  try {
    const review = await prisma.review.findUnique({
      where: { id: req.params.id },
    });
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (err) {
    next(err);
  }
}

export async function updateReview(req, res, next) {
  try {
    const { userId, propertyId, rating, comment } = req.body;
    const data = {};
    if (userId !== undefined) data.userId = userId;
    if (propertyId !== undefined) data.propertyId = propertyId;
    if (rating !== undefined) {
      const r = Number(rating);
      if (!Number.isInteger(r) || r < 1 || r > 5)
        return res
          .status(400)
          .json({ error: "rating must be an integer between 1 and 5" });
      data.rating = r;
    }
    if (comment !== undefined) data.comment = comment;
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data,
    });
    res.json(review);
  } catch (err) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Review not found" });
    } else {
      next(err);
    }
  }
}

export async function deleteReview(req, res, next) {
  try {
    await prisma.review.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "Review deleted" });
  } catch (err) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Review not found" });
    } else {
      next(err);
    }
  }
}
