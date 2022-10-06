import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const email = "test@test.it";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const user = await prisma.user.create({
    data: {
      email,
    },
  });

  const bitcoinAsset = await prisma.asset.create({ data: { name: "bitcoin" } });

  await prisma.wallet.create({
    data: {
      title: "Primo wallet",
      description: "Majors",
      userId: user.id,
      assets: {
        create: [
          {
            asset: {
              create: {
                name: "ethereum",
              },
            },
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
