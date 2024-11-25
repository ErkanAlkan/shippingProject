import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const createGuestUser = async (): Promise<void> => {
  try {
    const guestPassword = "guestpassword123";
    const hashedPassword = await bcrypt.hash(guestPassword, 10);

    const guestUser = await prisma.user.create({
      data: {
        email: "guest1@guest.com",
        password: hashedPassword,
      },
    });

    console.log("Guest user created:", guestUser);
  } catch (error) {
    console.error("Error creating guest user:", error);
  } finally {
    await prisma.$disconnect();
  }
};

createGuestUser();
