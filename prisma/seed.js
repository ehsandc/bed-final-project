import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";

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

  // Seed Users (use username for upsert and hash passwords)
  for (const user of users) {
    const hashed = await bcrypt.hash(user.password || "password", 10);
    await prisma.user.upsert({
      where: { username: user.username },
      update: {},
      create: { ...user, password: hashed },
    });
  }

  // Seed Hosts (use username for upsert and hash passwords)
  for (const host of hosts) {
    const hashed = await bcrypt.hash(host.password || "password", 10);
    await prisma.host.upsert({
      where: { username: host.username },
      update: {},
      create: { ...host, password: hashed },
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
