import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  // Load JSON data
  const users = JSON.parse(
    await fs.readFile(path.resolve("src/data/users.json"), "utf-8")
  ).users;
  const hosts = JSON.parse(
    await fs.readFile(path.resolve("src/data/hosts.json"), "utf-8")
  ).hosts;
  const properties = JSON.parse(
    await fs.readFile(path.resolve("src/data/properties.json"), "utf-8")
  ).properties;
  const bookings = JSON.parse(
    await fs.readFile(path.resolve("src/data/bookings.json"), "utf-8")
  ).bookings;
  const reviews = JSON.parse(
    await fs.readFile(path.resolve("src/data/reviews.json"), "utf-8")
  ).reviews;

  // Seed Users
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  // Seed Hosts
  for (const host of hosts) {
    await prisma.host.upsert({
      where: { id: host.id },
      update: {},
      create: host,
    });
  }

  // Seed Properties
  for (const property of properties) {
    await prisma.property.upsert({
      where: { id: property.id },
      update: {},
      create: property,
    });
  }

  // Seed Bookings
  for (const booking of bookings) {
    await prisma.booking.upsert({
      where: { id: booking.id },
      update: {},
      create: booking,
    });
  }

  // Seed Reviews
  for (const review of reviews) {
    await prisma.review.upsert({
      where: { id: review.id },
      update: {},
      create: review,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
