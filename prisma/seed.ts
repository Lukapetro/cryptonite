import { PrismaClient } from "@prisma/client";
import Assets from "./assetlist.json";

const prisma = new PrismaClient();

async function seed() {
  const email = "test@test.it";

  // cleanup the existing database
  await prisma.user.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });

  const user = await prisma.user.create({
    data: {
      email,
    },
  });

  for (const asset of Assets) {
    await prisma.asset.upsert({
      where: { id: asset.id },
      update: asset,
      create: asset,
    });
  }

  await prisma.wallet.create({
    data: {
      title: "Primo wallet",
      description: "Majors",
      userId: user.id,
      assets: {
        create: [
          {
            asset: {
              connect: {
                id: "bitcoin",
              },
            },
            percentage: 90,
          },
          {
            asset: {
              connect: {
                id: "ethereum",
              },
            },
            percentage: 10,
          },
        ],
      },
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
