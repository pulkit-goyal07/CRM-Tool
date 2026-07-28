import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { getAssignableUsers } from "@/lib/users";
import { LeadForm } from "../../lead-form";
import { updateLeadAction } from "../../actions";

export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [lead, users] = await Promise.all([
    prisma.lead.findUnique({ where: { id } }),
    getAssignableUsers(),
  ]);

  if (!lead) notFound();

  return (
    <div>
      <PageHeader title={`Edit ${lead.firstName} ${lead.lastName}`} />
      <LeadForm
        action={updateLeadAction.bind(null, id)}
        users={users}
        defaultValues={lead}
        submitLabel="Save Changes"
      />
    </div>
  );
}
