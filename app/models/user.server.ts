import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User["email"]) {
  const upsertUser = await prisma.user.upsert({
    where: {
      email,
    },
    update: {},
    create: {
      email,
    },
  });

  return upsertUser;
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(email: User["email"]) {
  const upsertUser = await prisma.user.upsert({
    where: {
      email,
    },
    update: {},
    create: {
      email,
    },
  });

  return upsertUser;
}
