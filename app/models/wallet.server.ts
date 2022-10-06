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
    select: { id: true, title: true },
    where: { id, userId },
  });
}

export function getWalletListItems({ userId }: { userId: User["id"] }) {
  return prisma.wallet.findMany({
    where: { userId },
    select: { id: true, title: true },
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
