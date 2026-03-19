import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Admin seeding process...");

  // 1. Delete all existing admins
  console.log("Deleting existing admins...");
  await prisma.admin.deleteMany({});
  console.log("All existing admins deleted.");

  // 2. Prepare new admin credentials
  const email = "bizpart242@gmail.com";
  const password = "iniakunbizpart";
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Create the new admin
  console.log(`Creating new admin with email: ${email}`);
  const newAdmin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  console.log("Admin seeding completed successfully!");
  console.log(`Admin created: ${newAdmin.email}`);
}

main()
  .catch((e) => {
    console.error("Error seeding admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
