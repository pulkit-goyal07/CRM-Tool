import { PageHeader } from "@/components/ui/page-header";
import { getAssignableUsers } from "@/lib/users";
import { requireUserId } from "@/lib/session";
import { AccountForm } from "../account-form";
import { createAccountAction } from "../actions";

export default async function NewAccountPage() {
  const [users, currentUserId] = await Promise.all([
    getAssignableUsers(),
    requireUserId(),
  ]);

  return (
    <div>
      <PageHeader title="New Account" />
      <AccountForm
        action={createAccountAction}
        users={users}
        defaultValues={{ ownerId: currentUserId }}
        submitLabel="Create Account"
      />
    </div>
  );
}
