import { PageHeader } from "@/components/ui/page-header";
import { getAssignableUsers } from "@/lib/users";
import { requireUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { OpportunityForm } from "../opportunity-form";
import { createOpportunityAction } from "../actions";

export default async function NewOpportunityPage({
  searchParams,
}: {
  searchParams: Promise<{ accountId?: string; contactId?: string }>;
}) {
  const { accountId, contactId } = await searchParams;
  const [users, currentUserId, accounts, contacts] = await Promise.all([
    getAssignableUsers(),
    requireUserId(),
    prisma.account.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.contact.findMany({
      select: { id: true, firstName: true, lastName: true, accountId: true },
      orderBy: { lastName: "asc" },
    }),
  ]);

  return (
    <div>
      <PageHeader title="New Opportunity" />
      <OpportunityForm
        action={createOpportunityAction}
        users={users}
        accounts={accounts}
        contacts={contacts}
        defaultValues={{ ownerId: currentUserId, accountId, contactId }}
        submitLabel="Create Opportunity"
      />
    </div>
  );
}
