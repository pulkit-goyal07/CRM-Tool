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
import { requireUserId } from "@/lib/session";
import { formatDate } from "@/lib/format";
import {
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_COLORS,
  LEAD_STATUS_LABELS,
} from "@/lib/labels";
import { deleteLeadAction } from "../actions";
import { ConvertForm } from "./convert-form";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [lead, users, accounts, currentUserId] = await Promise.all([
    prisma.lead.findUnique({
      where: { id },
      include: {
        owner: { select: { name: true } },
        convertedContact: {
          select: { id: true, firstName: true, lastName: true, accountId: true },
        },
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
    prisma.account.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    requireUserId(),
  ]);

  if (!lead) notFound();

  const path = `/leads/${id}`;
  const isConverted = lead.status === "CONVERTED";

  return (
    <div>
      <PageHeader
        title={`${lead.firstName} ${lead.lastName}`}
        description={lead.company ?? undefined}
        action={
          <div className="flex gap-2">
            {!isConverted && (
              <LinkButton href={`/leads/${id}/edit`} variant="secondary">
                Edit
              </LinkButton>
            )}
            <DeleteButton action={deleteLeadAction.bind(null, id)} />
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
                <dt className="text-slate-500 dark:text-slate-400">Status</dt>
                <dd>
                  <Badge color={LEAD_STATUS_COLORS[lead.status] as never}>
                    {LEAD_STATUS_LABELS[lead.status]}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Source</dt>
                <dd className="text-slate-800 dark:text-slate-200">
                  {LEAD_SOURCE_LABELS[lead.source]}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Email</dt>
                <dd className="text-slate-800 dark:text-slate-200">
                  {lead.email ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Phone</dt>
                <dd className="text-slate-800 dark:text-slate-200">
                  {lead.phone ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Owner</dt>
                <dd className="text-slate-800 dark:text-slate-200">
                  {lead.owner.name}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Created</dt>
                <dd className="text-slate-800 dark:text-slate-200">
                  {formatDate(lead.createdAt)}
                </dd>
              </div>
            </dl>
            {lead.notes && (
              <p className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
                {lead.notes}
              </p>
            )}
          </Card>

          <Card className="p-4">
            <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              Conversion
            </h2>
            {isConverted && lead.convertedContact ? (
              <div className="text-sm text-slate-600 dark:text-slate-300">
                <p className="mb-2">This lead has been converted.</p>
                <Link
                  href={`/contacts/${lead.convertedContact.id}`}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View {lead.convertedContact.firstName}{" "}
                  {lead.convertedContact.lastName}
                </Link>
                {lead.convertedContact.accountId && (
                  <>
                    {" · "}
                    <Link
                      href={`/accounts/${lead.convertedContact.accountId}`}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View Account
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <ConvertForm
                leadId={id}
                leadCompany={lead.company}
                accounts={accounts}
                users={users}
                currentUserId={currentUserId}
              />
            )}
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <RelatedTasks
            tasks={lead.tasks}
            path={path}
            assignableUsers={users}
            leadId={id}
          />
          <ActivityTimeline activities={lead.activities} path={path} leadId={id} />
        </div>
      </div>
    </div>
  );
}
