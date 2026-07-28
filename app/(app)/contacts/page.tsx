import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const contacts = await prisma.contact.findMany({
    where: q
      ? {
          OR: [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      account: { select: { id: true, name: true } },
      owner: { select: { name: true } },
    },
    orderBy: { lastName: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Contacts"
        description="People you work with at your accounts."
        action={<LinkButton href="/contacts/new">New Contact</LinkButton>}
      />

      <form className="mb-4">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Filter by name or email..."
          className="w-full max-w-xs rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </form>

      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th className="px-4 py-2.5">Name</th>
              <th className="px-4 py-2.5">Title</th>
              <th className="px-4 py-2.5">Account</th>
              <th className="px-4 py-2.5">Email</th>
              <th className="px-4 py-2.5">Owner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-3">
                  <Link
                    href={`/contacts/${contact.id}`}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {contact.firstName} {contact.lastName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {contact.title ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {contact.account ? (
                    <Link
                      href={`/accounts/${contact.account.id}`}
                      className="hover:text-indigo-600"
                    >
                      {contact.account.name}
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {contact.email ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {contact.owner.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {contacts.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-400">
            No contacts found.
          </p>
        )}
      </Card>
    </div>
  );
}
