import Link from "next/link";
import clsx from "clsx";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import {
  TASK_PRIORITY_COLORS,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
} from "@/lib/labels";
import { setTaskStatusAction, deleteTaskAction } from "@/actions/task";

const STATUS_FILTERS = ["ALL", "OPEN", "IN_PROGRESS", "DONE"];

function relatedRecord(task: {
  account: { id: string; name: string } | null;
  contact: { id: string; firstName: string; lastName: string } | null;
  lead: { id: string; firstName: string; lastName: string } | null;
  opportunity: { id: string; name: string } | null;
}) {
  if (task.account) return { href: `/accounts/${task.account.id}`, label: task.account.name };
  if (task.contact)
    return {
      href: `/contacts/${task.contact.id}`,
      label: `${task.contact.firstName} ${task.contact.lastName}`,
    };
  if (task.lead)
    return {
      href: `/leads/${task.lead.id}`,
      label: `${task.lead.firstName} ${task.lead.lastName}`,
    };
  if (task.opportunity)
    return { href: `/opportunities/${task.opportunity.id}`, label: task.opportunity.name };
  return null;
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = status && STATUS_FILTERS.includes(status) ? status : "ALL";

  const tasks = await prisma.task.findMany({
    where: activeStatus === "ALL" ? undefined : { status: activeStatus as never },
    include: {
      assignee: { select: { name: true } },
      account: { select: { id: true, name: true } },
      contact: { select: { id: true, firstName: true, lastName: true } },
      lead: { select: { id: true, firstName: true, lastName: true } },
      opportunity: { select: { id: true, name: true } },
    },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }],
  });

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Everything on your plate, across every record."
        action={<LinkButton href="/tasks/new">New Task</LinkButton>}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <Link
            key={s}
            href={s === "ALL" ? "/tasks" : `/tasks?status=${s}`}
            className={clsx(
              "rounded-full px-3 py-1 text-xs font-medium transition",
              activeStatus === s
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            )}
          >
            {s === "ALL" ? "All" : TASK_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th className="w-10 px-4 py-2.5"></th>
              <th className="px-4 py-2.5">Title</th>
              <th className="px-4 py-2.5">Related to</th>
              <th className="px-4 py-2.5">Assignee</th>
              <th className="px-4 py-2.5">Due</th>
              <th className="px-4 py-2.5">Priority</th>
              <th className="w-10 px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {tasks.map((task) => {
              const related = relatedRecord(task);
              return (
                <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3">
                    <form
                      action={setTaskStatusAction.bind(
                        null,
                        task.id,
                        task.status === "DONE" ? "OPEN" : "DONE",
                        "/tasks"
                      )}
                    >
                      <button
                        type="submit"
                        className={clsx(
                          "flex h-5 w-5 items-center justify-center rounded border text-xs",
                          task.status === "DONE"
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-slate-300 dark:border-slate-600"
                        )}
                        aria-label="Toggle done"
                      >
                        {task.status === "DONE" ? "✓" : ""}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        task.status === "DONE"
                          ? "text-slate-400 line-through"
                          : "font-medium text-slate-800 dark:text-slate-200"
                      }
                    >
                      {task.title}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {related ? (
                      <Link href={related.href} className="hover:text-indigo-600">
                        {related.label}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {task.assignee.name}
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {formatDate(task.dueDate)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={TASK_PRIORITY_COLORS[task.priority] as never}>
                      {TASK_PRIORITY_LABELS[task.priority]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <form action={deleteTaskAction.bind(null, task.id, "/tasks")}>
                      <button
                        type="submit"
                        className="text-xs text-slate-400 hover:text-red-600"
                        aria-label="Delete task"
                      >
                        ✕
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {tasks.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-400">No tasks found.</p>
        )}
      </Card>
    </div>
  );
}
