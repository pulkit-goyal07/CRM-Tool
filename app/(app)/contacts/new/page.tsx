import { PageHeader } from "@/components/ui/page-header";
import { getAssignableUsers } from "@/lib/users";
import { requireUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ContactForm } from "../contact-form";
import { createContactAction } from "../actions";

export default async function NewContactPage({
  searchParams,
}: {
  searchParams: Promise<{ accountId?: string }>;
}) {
  const { accountId } = await searchParams;
  const [users, currentUserId, accounts] = await Promise.all([
    getAssignableUsers(),
    requireUserId(),
    prisma.account.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div>
      <PageHeader title="New Contact" />
      <ContactForm
        action={createContactAction}
        users={users}
        accounts={accounts}
        defaultValues={{ ownerId: currentUserId, accountId }}
        submitLabel="Create Contact"
      />
    </div>
  );
}
