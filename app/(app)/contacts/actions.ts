"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";

const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  title: z.string().trim().optional().or(z.literal("")),
  accountId: z.string().optional().or(z.literal("")),
  ownerId: z.string().min(1, "Owner is required"),
});

export async function createContactAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  await requireUserId();
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;

  const contact = await prisma.contact.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || null,
      phone: data.phone || null,
      title: data.title || null,
      accountId: data.accountId || null,
      ownerId: data.ownerId,
    },
  });

  revalidatePath("/contacts");
  if (data.accountId) revalidatePath(`/accounts/${data.accountId}`);
  redirect(`/contacts/${contact.id}`);
}

export async function updateContactAction(
  id: string,
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  await requireUserId();
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;

  await prisma.contact.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || null,
      phone: data.phone || null,
      title: data.title || null,
      accountId: data.accountId || null,
      ownerId: data.ownerId,
    },
  });

  revalidatePath("/contacts");
  revalidatePath(`/contacts/${id}`);
  if (data.accountId) revalidatePath(`/accounts/${data.accountId}`);
  redirect(`/contacts/${id}`);
}

export async function deleteContactAction(id: string) {
  await requireUserId();
  await prisma.contact.delete({ where: { id } });
  revalidatePath("/contacts");
  redirect("/contacts");
}
