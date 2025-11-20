import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  // Cleanup existing data
  await prisma.note.deleteMany();
  await prisma.readingSession.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  // Create test user
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      username: "testuser",
      password: hashedPassword,
      displayName: "Test User",
    },
  });

  const gatsby = await prisma.book.create({
    data: {
      userId: user.id,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      totalPages: 180,
      status: "completed",
      currentPage: 180,
      genre: "Classic",
    },
  });

  await prisma.readingSession.create({
    data: {
      userId: user.id,
      bookId: gatsby.id,
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      endTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60), // 1 hour duration
      durationMinutes: 60,
      pagesRead: 30,
    },
  });

  await prisma.book.create({
    data: {
      userId: user.id,
      title: "Clean Code",
      author: "Robert C. Martin",
      totalPages: 464,
      status: "reading",
      currentPage: 120,
      genre: "Technical",
    },
  });

  await prisma.book.create({
    data: {
      userId: user.id,
      title: "Project Hail Mary",
      author: "Andy Weir",
      totalPages: 496,
      status: "to-read",
      genre: "Sci-Fi",
    },
  });

  console.log(`Created user with id: ${user.id}`);
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
