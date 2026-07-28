import { PageHeader } from "@/components/ui/page-header";
import { getAssignableUsers } from "@/lib/users";
import { requireUserId } from "@/lib/session";
import { LeadForm } from "../lead-form";
import { createLeadAction } from "../actions";

export default async function NewLeadPage() {
  const [users, currentUserId] = await Promise.all([
    getAssignableUsers(),
    requireUserId(),
  ]);

  return (
    <div>
      <PageHeader title="New Lead" />
      <LeadForm
        action={createLeadAction}
        users={users}
        defaultValues={{ ownerId: currentUserId }}
        submitLabel="Create Lead"
      />
    </div>
  );
}
