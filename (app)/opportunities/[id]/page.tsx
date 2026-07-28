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
import { OPPORTUNITY_STAGE_COLORS, OPPORTUNITY_STAGE_LABELS } from "@/lib/labels";
import { deleteOpportunityAction } from "../actions";

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [opportunity, users] = await Promise.all([
    prisma.opportunity.findUnique({
      where: { id },
      include: {
        owner: { select: { name: true } },
        account: { select: { id: true, name: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
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

  if (!opportunity) notFound();

  const path = `/opportunities/${id}`;

  return (
    <div>
      <PageHeader
        title={opportunity.name}
        description={opportunity.account.name}
        action={
          <div className="flex gap-2">
            <LinkButton href={`/opportunities/${id}/edit`} variant="secondary">
              Edit
            </LinkButton>
            <DeleteButton action={deleteOpportunityAction.bind(null, id)} />
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
                <dt className="text-slate-500 dark:text-slate-400">Amount</dt>
                <dd className="font-medium text-slate-800 dark:text-slate-200">
                  {formatCurrency(Number(opportunity.amount))}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Stage</dt>
                <dd>
                  <Badge color={OPPORTUNITY_STAGE_COLORS[opportunity.stage] as never}>
                    {OPPORTUNITY_STAGE_LABELS[opportunity.stage]}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Probability</dt>
                <dd className="text-slate-800 dark:text-slate-200">
                  {opportunity.probability}%
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Close date</dt>
                <dd className="text-slate-800 dark:text-slate-200">
                  {formatDate(opportunity.closeDate)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Account</dt>
                <dd>
                  <Link
                    href={`/accounts/${opportunity.account.id}`}
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    {opportunity.account.name}
                  </Link>
                </dd>
              </div>
              {opportunity.contact && (
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Contact</dt>
                  <dd>
                    <Link
                      href={`/contacts/${opportunity.contact.id}`}
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      {opportunity.contact.firstName} {opportunity.contact.lastName}
                    </Link>
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Owner</dt>
                <dd className="text-slate-800 dark:text-slate-200">
                  {opportunity.owner.name}
                </dd>
              </div>
            </dl>
            {opportunity.description && (
              <p className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
                {opportunity.description}
              </p>
            )}
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <RelatedTasks
            tasks={opportunity.tasks}
            path={path}
            assignableUsers={users}
            opportunityId={id}
          />
          <ActivityTimeline
            activities={opportunity.activities}
            path={path}
            opportunityId={id}
          />
        </div>
      </div>
    </div>
  );
}
