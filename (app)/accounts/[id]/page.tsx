import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { DeleteButton } from "@/components/delete-button";
import { ActivityTimeline } from "@/components/activity-timeline";
import { RelatedTasks } from "@/components/related-tasks";
import { getAssignableUsers } from "@/lib/users";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  OPPORTUNITY_STAGE_COLORS,
  OPPORTUNITY_STAGE_LABELS,
} from "@/lib/labels";
import { deleteAccountAction } from "../actions";

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [account, users] = await Promise.all([
    prisma.account.findUnique({
      where: { id },
      include: {
        owner: { select: { name: true } },
        contacts: { orderBy: { lastName: "asc" } },
        opportunities: { orderBy: { createdAt: "desc" } },
        tasks: {
          orderBy: { dueDate: "asc" },
          include: { assignee: { select: { name: true } } },
        },
        activities: {
          orderBy: { createdAt: "desc" },
          include: { author: { select: { name: true } } },
        },
      },
    }),
    getAssignableUsers(),
  ]);

  if (!account) notFound();

  const path = `/accounts/${id}`;

  return (
    <div>
      <PageHeader
        title={account.name}
        description={account.industry ?? undefined}
        action={
          <div className="flex gap-2">
            <LinkButton href={`/accounts/${id}/edit`} variant="secondary">
              Edit
            </LinkButton>
            <DeleteButton action={deleteAccountAction.bind(null, id)} />
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <Card className="p-4">
            <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              Details
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Owner</dt>
                <dd className="text-slate-800 dark:text-slate-200">
                  {account.owner.name}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Website</dt>
                <dd className="text-slate-800 dark:text-slate-200">
                  {account.website ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Phone</dt>
                <dd className="text-slate-800 dark:text-slate-200">
                  {account.phone ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Address</dt>
                <dd className="text-right text-slate-800 dark:text-slate-200">
                  {account.billingAddress ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Created</dt>
                <dd className="text-slate-800 dark:text-slate-200">
                  {formatDate(account.createdAt)}
                </dd>
              </div>
            </dl>
            {account.description && (
              <p className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
                {account.description}
              </p>
            )}
          </Card>

          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Contacts
              </h2>
              <Link
                href={`/contacts/new?accountId=${id}`}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
              >
                + Add
              </Link>
            </div>
            {account.contacts.length === 0 ? (
              <p className="text-sm text-slate-400">No contacts yet.</p>
            ) : (
              <ul className="space-y-2">
                {account.contacts.map((contact) => (
                  <li key={contact.id}>
                    <Link
                      href={`/contacts/${contact.id}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      {contact.firstName} {contact.lastName}
                    </Link>
                    {contact.title && (
                      <span className="ml-1 text-xs text-slate-400">
                        · {contact.title}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Opportunities
              </h2>
              <Link
                href={`/opportunities/new?accountId=${id}`}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
              >
                + Add
              </Link>
            </div>
            {account.opportunities.length === 0 ? (
              <p className="text-sm text-slate-400">No opportunities yet.</p>
            ) : (
              <ul className="space-y-2">
                {account.opportunities.map((opp) => (
                  <li key={opp.id} className="flex items-center justify-between gap-2">
                    <Link
                      href={`/opportunities/${opp.id}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      {opp.name}
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">
                        {formatCurrency(Number(opp.amount))}
                      </span>
                      <Badge color={OPPORTUNITY_STAGE_COLORS[opp.stage] as never}>
                        {OPPORTUNITY_STAGE_LABELS[opp.stage]}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <RelatedTasks
            tasks={account.tasks}
            path={path}
            assignableUsers={users}
            accountId={id}
          />
          <ActivityTimeline
            activities={account.activities}
            path={path}
            accountId={id}
          />
        </div>
      </div>
    </div>
  );
}
