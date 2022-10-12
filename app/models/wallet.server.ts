import type { AssetsOnWallets, User, Wallet } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Wallet } from "@prisma/client";

export interface IAssetWithAllocation {
  assetId: string;
  percentage: number;
}

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
}: Pick<Wallet, "description" | "title"> & {
  userId: User["id"];
} & { assets: IAssetWithAllocation[] }) {
  return prisma.wallet.create({
    data: {
      title,
      description,
      status: "completo",

      assets: {
        create: assets.map((asset) => ({
          percentage: asset.percentage,
          asset: {
            connect: {
              id: asset.assetId,
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
