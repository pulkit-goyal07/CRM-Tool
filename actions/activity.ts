"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import type { ActivityType } from "@/generated/prisma/enums";

export async function addActivityAction(formData: FormData) {
  const authorId = await requireUserId();
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;

  const type = String(formData.get("type") ?? "NOTE") as ActivityType;
  const accountId = (formData.get("accountId") as string) || undefined;
  const contactId = (formData.get("contactId") as string) || undefined;
  const leadId = (formData.get("leadId") as string) || undefined;
  const opportunityId = (formData.get("opportunityId") as string) || undefined;
  const path = String(formData.get("path") ?? "/");

  await prisma.activity.create({
    data: { type, body, authorId, accountId, contactId, leadId, opportunityId },
  });

  revalidatePath(path);
}
