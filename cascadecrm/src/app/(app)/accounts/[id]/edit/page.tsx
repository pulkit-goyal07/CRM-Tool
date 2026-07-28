import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { getAssignableUsers } from "@/lib/users";
import { AccountForm } from "../../account-form";
import { updateAccountAction } from "../../actions";

export default async function EditAccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [account, users] = await Promise.all([
    prisma.account.findUnique({ where: { id } }),
    getAssignableUsers(),
  ]);

  if (!account) notFound();

  return (
    <div>
      <PageHeader title={`Edit ${account.name}`} />
      <AccountForm
        action={updateAccountAction.bind(null, id)}
        users={users}
        defaultValues={account}
        submitLabel="Save Changes"
      />
    </div>
  );
}
