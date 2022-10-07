import type { User, Wallet } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Wallet } from "@prisma/client";

export function getWallet({
  id,
  userId,
}: Pick<Wallet, "id"> & {
  userId: User["id"];
}) {
  return prisma.wallet.findFirst({
    select: { id: true, title: true, status: true },
    where: { id, userId },
  });
}

export function getAllAsset() {
  return prisma.asset.findMany();
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
