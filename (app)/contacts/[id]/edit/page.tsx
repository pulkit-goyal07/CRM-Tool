import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { getAssignableUsers } from "@/lib/users";
import { ContactForm } from "../../contact-form";
import { updateContactAction } from "../../actions";

export default async function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [contact, users, accounts] = await Promise.all([
    prisma.contact.findUnique({ where: { id } }),
    getAssignableUsers(),
    prisma.account.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!contact) notFound();

  return (
    <div>
      <PageHeader title={`Edit ${contact.firstName} ${contact.lastName}`} />
      <ContactForm
        action={updateContactAction.bind(null, id)}
        users={users}
        accounts={accounts}
        defaultValues={contact}
        submitLabel="Save Changes"
      />
    </div>
  );
}
