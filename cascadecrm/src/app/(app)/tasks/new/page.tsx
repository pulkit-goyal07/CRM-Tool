import { PageHeader } from "@/components/ui/page-header";
import { getAssignableUsers } from "@/lib/users";
import { prisma } from "@/lib/prisma";
import { TaskNewForm } from "./task-new-form";

export default async function NewTaskPage() {
  const [users, accounts, contacts, leads, opportunities] = await Promise.all([
    getAssignableUsers(),
    prisma.account.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.contact.findMany({
      select: { id: true, firstName: true, lastName: true },
      orderBy: { lastName: "asc" },
    }),
    prisma.lead.findMany({
      select: { id: true, firstName: true, lastName: true },
      orderBy: { lastName: "asc" },
    }),
    prisma.opportunity.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader title="New Task" />
      <TaskNewForm
        users={users.map((u) => ({ id: u.id, label: u.name }))}
        accounts={accounts.map((a) => ({ id: a.id, label: a.name }))}
        contacts={contacts.map((c) => ({
          id: c.id,
          label: `${c.firstName} ${c.lastName}`,
        }))}
        leads={leads.map((l) => ({ id: l.id, label: `${l.firstName} ${l.lastName}` }))}
        opportunities={opportunities.map((o) => ({ id: o.id, label: o.name }))}
      />
    </div>
  );
}
