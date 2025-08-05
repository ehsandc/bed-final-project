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
    await prisma.user.create({ data: user });
  }

  // Seed Hosts
  for (const host of hosts) {
    await prisma.host.create({ data: host });
  }

  // Seed Properties
  for (const property of properties) {
    await prisma.property.create({ data: property });
  }

  // Seed Bookings
  for (const booking of bookings) {
    await prisma.booking.create({ data: booking });
  }

  // Seed Reviews
  for (const review of reviews) {
    await prisma.review.create({ data: review });
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
