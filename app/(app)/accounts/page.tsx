import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { formatDate } from "@/lib/format";

export default async function AccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const accounts = await prisma.account.findMany({
    where: q ? { name: { contains: q, mode: "insensitive" } } : undefined,
    include: {
      owner: { select: { name: true } },
      _count: { select: { contacts: true, opportunities: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Accounts"
        description="Companies you do business with."
        action={<LinkButton href="/accounts/new">New Account</LinkButton>}
      />

      <form className="mb-4">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Filter by name..."
          className="w-full max-w-xs rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </form>

      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th className="px-4 py-2.5">Name</th>
              <th className="px-4 py-2.5">Industry</th>
              <th className="px-4 py-2.5">Owner</th>
              <th className="px-4 py-2.5">Contacts</th>
              <th className="px-4 py-2.5">Opportunities</th>
              <th className="px-4 py-2.5">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {accounts.map((account) => (
              <tr key={account.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-3">
                  <Link
                    href={`/accounts/${account.id}`}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {account.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {account.industry ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {account.owner.name}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {account._count.contacts}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {account._count.opportunities}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {formatDate(account.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {accounts.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-400">
            No accounts found.
          </p>
        )}
      </Card>
    </div>
  );
}
