"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { OPPORTUNITY_STAGES } from "@/lib/labels";

const stageEnum = z.enum(
  OPPORTUNITY_STAGES as unknown as [string, ...string[]]
);

const opportunitySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  amount: z.string().min(1, "Amount is required"),
  stage: stageEnum,
  probability: z.string().optional().or(z.literal("")),
  closeDate: z.string().optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  accountId: z.string().min(1, "Account is required"),
  contactId: z.string().optional().or(z.literal("")),
  ownerId: z.string().min(1, "Owner is required"),
});

export async function createOpportunityAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  await requireUserId();
  const parsed = opportunitySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;

  const opportunity = await prisma.opportunity.create({
    data: {
      name: data.name,
      amount: Number(data.amount),
      stage: data.stage as never,
      probability: data.probability ? Number(data.probability) : 10,
      closeDate: data.closeDate ? new Date(data.closeDate) : null,
      description: data.description || null,
      accountId: data.accountId,
      contactId: data.contactId || null,
      ownerId: data.ownerId,
    },
  });

  revalidatePath("/opportunities");
  revalidatePath(`/accounts/${data.accountId}`);
  redirect(`/opportunities/${opportunity.id}`);
}

export async function updateOpportunityAction(
  id: string,
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  await requireUserId();
  const parsed = opportunitySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;

  await prisma.opportunity.update({
    where: { id },
    data: {
      name: data.name,
      amount: Number(data.amount),
      stage: data.stage as never,
      probability: data.probability ? Number(data.probability) : 10,
      closeDate: data.closeDate ? new Date(data.closeDate) : null,
      description: data.description || null,
      accountId: data.accountId,
      contactId: data.contactId || null,
      ownerId: data.ownerId,
    },
  });

  revalidatePath("/opportunities");
  revalidatePath(`/opportunities/${id}`);
  revalidatePath(`/accounts/${data.accountId}`);
  redirect(`/opportunities/${id}`);
}

export async function deleteOpportunityAction(id: string) {
  await requireUserId();
  await prisma.opportunity.delete({ where: { id } });
  revalidatePath("/opportunities");
  redirect("/opportunities");
}

const PROBABILITY_BY_STAGE: Record<string, number> = {
  QUALIFICATION: 10,
  NEEDS_ANALYSIS: 30,
  PROPOSAL: 60,
  NEGOTIATION: 80,
  CLOSED_WON: 100,
  CLOSED_LOST: 0,
};

export async function setOpportunityStageAction(id: string, stage: string) {
  const userId = await requireUserId();
  const opportunity = await prisma.opportunity.update({
    where: { id },
    data: {
      stage: stage as never,
      probability: PROBABILITY_BY_STAGE[stage] ?? 10,
    },
  });

  await prisma.activity.create({
    data: {
      type: "STAGE_CHANGE",
      body: `Moved to ${stage.replaceAll("_", " ")}.`,
      authorId: userId,
      opportunityId: id,
      accountId: opportunity.accountId,
    },
  });

  revalidatePath("/opportunities");
  revalidatePath(`/opportunities/${id}`);
}
