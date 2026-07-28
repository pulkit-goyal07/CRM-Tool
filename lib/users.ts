import { prisma } from "@/lib/prisma";

export function getAssignableUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
}
