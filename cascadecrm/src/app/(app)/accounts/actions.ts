"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";

const accountSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  website: z.string().trim().optional().or(z.literal("")),
  industry: z.string().trim().optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  billingAddress: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  ownerId: z.string().min(1, "Owner is required"),
});

export async function createAccountAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  await requireUserId();
  const parsed = accountSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;

  const account = await prisma.account.create({
    data: {
      name: data.name,
      website: data.website || null,
      industry: data.industry || null,
      phone: data.phone || null,
      billingAddress: data.billingAddress || null,
      description: data.description || null,
      ownerId: data.ownerId,
    },
  });

  revalidatePath("/accounts");
  redirect(`/accounts/${account.id}`);
}

export async function updateAccountAction(
  id: string,
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  await requireUserId();
  const parsed = accountSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;

  await prisma.account.update({
    where: { id },
    data: {
      name: data.name,
      website: data.website || null,
      industry: data.industry || null,
      phone: data.phone || null,
      billingAddress: data.billingAddress || null,
      description: data.description || null,
      ownerId: data.ownerId,
    },
  });

  revalidatePath("/accounts");
  revalidatePath(`/accounts/${id}`);
  redirect(`/accounts/${id}`);
}

export async function deleteAccountAction(id: string) {
  await requireUserId();
  await prisma.account.delete({ where: { id } });
  revalidatePath("/accounts");
  redirect("/accounts");
}
