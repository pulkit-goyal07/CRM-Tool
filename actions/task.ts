"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";

const taskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional().or(z.literal("")),
  dueDate: z.string().optional().or(z.literal("")),
  priority: z.enum(["LOW", "NORMAL", "HIGH"]),
  assigneeId: z.string().min(1, "Assignee is required"),
  accountId: z.string().optional().or(z.literal("")),
  contactId: z.string().optional().or(z.literal("")),
  leadId: z.string().optional().or(z.literal("")),
  opportunityId: z.string().optional().or(z.literal("")),
  path: z.string().min(1),
  redirectTo: z.string().optional().or(z.literal("")),
});

export async function createTaskAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  await requireUserId();
  const parsed = taskSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;

  await prisma.task.create({
    data: {
      title: data.title,
      description: data.description || null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      priority: data.priority,
      assigneeId: data.assigneeId,
      accountId: data.accountId || null,
      contactId: data.contactId || null,
      leadId: data.leadId || null,
      opportunityId: data.opportunityId || null,
    },
  });

  revalidatePath(data.path);
  revalidatePath("/tasks");
  if (data.redirectTo) redirect(data.redirectTo);
  return {};
}

export async function setTaskStatusAction(
  id: string,
  status: "OPEN" | "IN_PROGRESS" | "DONE",
  path: string
) {
  await requireUserId();
  await prisma.task.update({ where: { id }, data: { status } });
  revalidatePath(path);
  revalidatePath("/tasks");
}

export async function deleteTaskAction(id: string, path: string) {
  await requireUserId();
  await prisma.task.delete({ where: { id } });
  revalidatePath(path);
  revalidatePath("/tasks");
}
