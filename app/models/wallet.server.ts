import type { Asset, AssetsOnWallets, User, Wallet } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Wallet } from "@prisma/client";

export default function calculateStatus({
  percentage,
}: {
  percentage: AssetsOnWallets["percentage"];
}) {
  switch (percentage) {
    case 0:
      return "vuoto";
    case 100:
      return "completo";

    default:
      return "parziale";
  }
}

export function getAllWallets() {
  return prisma.wallet.findMany({
    select: {
      id: true,
      user: true,
      userId: true,
      assets: true,
      status: true,
      createdAt: true,
      _count: true,
      title: true,
    },
  });
}

export function getWallet({
  id,
  userId,
}: Pick<Wallet, "id"> & {
  userId: User["id"];
}) {
  return prisma.wallet.findFirst({
    select: {
      id: true,
      title: true,
      status: true,
      assets: true,
      description: true,
    },
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
  assets,
  percentage,
}: Pick<Wallet, "description" | "title"> & {
  userId: User["id"];
} & { assets: Asset[] } & { percentage: AssetsOnWallets["percentage"] }) {
  return prisma.wallet.create({
    data: {
      title,
      description,
      status: calculateStatus({ percentage }),
      assets: {
        create: assets.map((asset1) => ({
          asset: {
            connect: {
              id: assets.find((asset) => asset.id === asset1.id)?.id,
            },
          },
        })),
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
