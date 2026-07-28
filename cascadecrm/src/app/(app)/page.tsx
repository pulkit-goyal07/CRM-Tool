import Link from "next/link";
import { getDashboardData } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { PipelineChart } from "@/components/pipeline-chart";
import { LeadsChart } from "@/components/leads-chart";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  ACTIVITY_TYPE_LABELS,
  TASK_PRIORITY_COLORS,
  TASK_PRIORITY_LABELS,
} from "@/lib/labels";

function activitySubject(activity: {
  account: { name: string } | null;
  contact: { firstName: string; lastName: string } | null;
  lead: { firstName: string; lastName: string } | null;
  opportunity: { name: string } | null;
}) {
  if (activity.opportunity) return activity.opportunity.name;
  if (activity.account) return activity.account.name;
  if (activity.contact)
    return `${activity.contact.firstName} ${activity.contact.lastName}`;
  if (activity.lead) return `${activity.lead.firstName} ${activity.lead.lastName}`;
  return "";
}

function KpiTile({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <Card className="p-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
        {value}
      </p>
      {sublabel && (
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          {sublabel}
        </p>
      )}
    </Card>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your pipeline and activity at a glance."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiTile label="Open Pipeline" value={formatCurrency(data.pipelineValue)} />
        <KpiTile
          label="Win Rate"
          value={`${data.winRate.toFixed(0)}%`}
          sublabel="closed won vs. lost"
        />
        <KpiTile label="Open Leads" value={String(data.openLeadCount)} />
        <KpiTile label="Accounts" value={String(data.accountCount)} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
            Pipeline by Stage
          </h2>
          {data.stageBreakdown.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">
              No opportunities yet.
            </p>
          ) : (
            <PipelineChart data={data.stageBreakdown} />
          )}
        </Card>
        <Card className="p-4">
          <h2 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
            Leads by Status
          </h2>
          {data.leadBreakdown.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">
              No leads yet.
            </p>
          ) : (
            <LeadsChart data={data.leadBreakdown} />
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Upcoming Tasks
            </h2>
            <Link
              href="/tasks"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all
            </Link>
          </div>
          {data.upcomingTasks.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              Nothing due. Nice work.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.upcomingTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between py-2.5 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {task.assignee.name} · due {formatDate(task.dueDate)}
                    </p>
                  </div>
                  <Badge
                    color={
                      TASK_PRIORITY_COLORS[task.priority] as never
                    }
                  >
                    {TASK_PRIORITY_LABELS[task.priority]}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-4">
          <h2 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
            Recent Activity
          </h2>
          {data.recentActivity.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              No activity logged yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.recentActivity.map((activity) => (
                <li key={activity.id} className="py-2.5 text-sm">
                  <p className="text-slate-800 dark:text-slate-200">
                    <span className="font-medium">{activity.author.name}</span>{" "}
                    logged a{" "}
                    <span className="text-slate-500">
                      {ACTIVITY_TYPE_LABELS[activity.type].toLowerCase()}
                    </span>{" "}
                    on <span className="font-medium">{activitySubject(activity)}</span>
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatDate(activity.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
