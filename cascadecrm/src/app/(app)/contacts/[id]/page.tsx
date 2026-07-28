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
import { deleteContactAction } from "../actions";

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [contact, users] = await Promise.all([
    prisma.contact.findUnique({
      where: { id },
      include: {
        owner: { select: { name: true } },
        account: { select: { id: true, name: true } },
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

  if (!contact) notFound();

  const path = `/contacts/${id}`;

  return (
    <div>
      <PageHeader
        title={`${contact.firstName} ${contact.lastName}`}
        description={contact.title ?? undefined}
        action={
          <div className="flex gap-2">
            <LinkButton href={`/contacts/${id}/edit`} variant="secondary">
              Edit
            </LinkButton>
            <DeleteButton action={deleteContactAction.bind(null, id)} />
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
                <dt className="text-slate-500 dark:text-slate-400">Account</dt>
                <dd className="text-slate-800 dark:text-slate-200">
                  {contact.account ? (
                    <Link
                      href={`/accounts/${contact.account.id}`}
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      {contact.account.name}
                    </Link>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Email</dt>
                <dd className="text-slate-800 dark:text-slate-200">
                  {contact.email ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Phone</dt>
                <dd className="text-slate-800 dark:text-slate-200">
                  {contact.phone ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Owner</dt>
                <dd className="text-slate-800 dark:text-slate-200">
                  {contact.owner.name}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Created</dt>
                <dd className="text-slate-800 dark:text-slate-200">
                  {formatDate(contact.createdAt)}
                </dd>
              </div>
            </dl>
          </Card>

          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Opportunities
              </h2>
              <Link
                href={`/opportunities/new?contactId=${id}${
                  contact.account ? `&accountId=${contact.account.id}` : ""
                }`}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
              >
                + Add
              </Link>
            </div>
            {contact.opportunities.length === 0 ? (
              <p className="text-sm text-slate-400">No opportunities yet.</p>
            ) : (
              <ul className="space-y-2">
                {contact.opportunities.map((opp) => (
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
            tasks={contact.tasks}
            path={path}
            assignableUsers={users}
            contactId={id}
          />
          <ActivityTimeline
            activities={contact.activities}
            path={path}
            contactId={id}
          />
        </div>
      </div>
    </div>
  );
}
