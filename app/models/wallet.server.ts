import type { Asset, User, Wallet } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Wallet } from "@prisma/client";

export function getWallet({
  id,
  userId,
}: Pick<Wallet, "id"> & {
  userId: User["id"];
}) {
  return prisma.wallet.findFirst({
    select: { id: true, title: true, status: true, assets: true },
    where: { id, userId },
  });
}

export function getWalletListItems({ userId }: { userId: User["id"] }) {
  return prisma.wallet.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export function createWallet({
  description,
  title,
  userId,
}: Pick<Wallet, "description" | "title"> & {
  userId: User["id"];
}) {
  return prisma.wallet.create({
    data: {
      title,
      description,
      status: "empty",
      assets: {
        create: [
          {
            asset: {
              connect: {
                id: "bitcoin",
              },
            },
            percentage: 100,
          },
        ],
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteWallet({
  id,
  userId,
}: Pick<Wallet, "id"> & { userId: User["id"] }) {
  return prisma.wallet.deleteMany({
    where: { id, userId },
  });
}
