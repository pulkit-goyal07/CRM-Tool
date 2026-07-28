import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { getAssignableUsers } from "@/lib/users";
import { OpportunityForm } from "../../opportunity-form";
import { updateOpportunityAction } from "../../actions";

export default async function EditOpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [opportunity, users, accounts, contacts] = await Promise.all([
    prisma.opportunity.findUnique({ where: { id } }),
    getAssignableUsers(),
    prisma.account.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.contact.findMany({
      select: { id: true, firstName: true, lastName: true, accountId: true },
      orderBy: { lastName: "asc" },
    }),
  ]);

  if (!opportunity) notFound();

  return (
    <div>
      <PageHeader title={`Edit ${opportunity.name}`} />
      <OpportunityForm
        action={updateOpportunityAction.bind(null, id)}
        users={users}
        accounts={accounts}
        contacts={contacts}
        defaultValues={{ ...opportunity, amount: Number(opportunity.amount) }}
        submitLabel="Save Changes"
      />
    </div>
  );
}
