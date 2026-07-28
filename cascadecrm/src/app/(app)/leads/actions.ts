"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";

const leadSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  company: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "DISQUALIFIED", "CONVERTED"]),
  source: z.enum(["WEB", "REFERRAL", "OUTBOUND", "EVENT", "PARTNER", "OTHER"]),
  notes: z.string().trim().optional().or(z.literal("")),
  ownerId: z.string().min(1, "Owner is required"),
});

export async function createLeadAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  await requireUserId();
  const parsed = leadSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;

  const lead = await prisma.lead.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company || null,
      email: data.email || null,
      phone: data.phone || null,
      status: data.status,
      source: data.source,
      notes: data.notes || null,
      ownerId: data.ownerId,
    },
  });

  revalidatePath("/leads");
  redirect(`/leads/${lead.id}`);
}

export async function updateLeadAction(
  id: string,
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  await requireUserId();
  const parsed = leadSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;

  await prisma.lead.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company || null,
      email: data.email || null,
      phone: data.phone || null,
      status: data.status,
      source: data.source,
      notes: data.notes || null,
      ownerId: data.ownerId,
    },
  });

  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
  redirect(`/leads/${id}`);
}

export async function deleteLeadAction(id: string) {
  await requireUserId();
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/leads");
  redirect("/leads");
}

const convertSchema = z.object({
  leadId: z.string().min(1),
  accountId: z.string().optional().or(z.literal("")),
  newAccountName: z.string().trim().optional().or(z.literal("")),
  ownerId: z.string().min(1, "Owner is required"),
  createOpportunity: z.string().optional(),
  opportunityName: z.string().trim().optional().or(z.literal("")),
  opportunityAmount: z.string().optional().or(z.literal("")),
});

export async function convertLeadAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  await requireUserId();
  const parsed = convertSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;

  const lead = await prisma.lead.findUnique({ where: { id: data.leadId } });
  if (!lead) return { error: "Lead not found." };

  let accountId = data.accountId || null;
  if (!accountId) {
    const accountName =
      data.newAccountName || lead.company || `${lead.firstName} ${lead.lastName}`;
    const account = await prisma.account.create({
      data: { name: accountName, ownerId: data.ownerId },
    });
    accountId = account.id;
  }

  const contact = await prisma.contact.create({
    data: {
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      accountId,
      ownerId: data.ownerId,
    },
  });

  let opportunityId: string | null = null;
  if (data.createOpportunity === "on") {
    const opportunity = await prisma.opportunity.create({
      data: {
        name:
          data.opportunityName ||
          `${lead.company ?? lead.lastName} - New Business`,
        amount: data.opportunityAmount ? Number(data.opportunityAmount) : 0,
        accountId,
        contactId: contact.id,
        ownerId: data.ownerId,
      },
    });
    opportunityId = opportunity.id;
  }

  await prisma.lead.update({
    where: { id: lead.id },
    data: {
      status: "CONVERTED",
      convertedContactId: contact.id,
      convertedAccountId: accountId,
      convertedOpportunityId: opportunityId,
    },
  });

  await prisma.activity.create({
    data: {
      type: "CONVERSION",
      body: `Converted from lead ${lead.firstName} ${lead.lastName}${
        lead.company ? ` (${lead.company})` : ""
      }.`,
      authorId: data.ownerId,
      contactId: contact.id,
      accountId,
      opportunityId: opportunityId ?? undefined,
    },
  });

  revalidatePath("/leads");
  revalidatePath(`/leads/${lead.id}`);
  revalidatePath("/accounts");
  revalidatePath("/contacts");
  revalidatePath("/opportunities");
  redirect(`/contacts/${contact.id}`);
}
