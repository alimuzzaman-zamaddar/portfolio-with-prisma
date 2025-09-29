import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_OWNER_EMAIL!;
  const pass = process.env.SEED_OWNER_PASSWORD!;

  const hashed = await bcrypt.hash(pass, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password: hashed, role: "OWNER", name: "Portfolio Owner" },
  });

  console.log("✅ Seeded owner:", email);
}
main().finally(() => prisma.$disconnect());
