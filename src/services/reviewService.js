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
    const review = await prisma.review.create({
      data: { userId, propertyId, rating, comment },
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
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { userId, propertyId, rating, comment },
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
