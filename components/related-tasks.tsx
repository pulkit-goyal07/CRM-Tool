import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import {
  TASK_PRIORITY_COLORS,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
} from "@/lib/labels";
import { setTaskStatusAction, deleteTaskAction } from "@/actions/task";
import { TaskQuickAdd } from "@/components/task-quick-add";

type TaskItem = {
  id: string;
  title: string;
  status: "OPEN" | "IN_PROGRESS" | "DONE";
  priority: string;
  dueDate: Date | null;
  assignee: { name: string };
};

export function RelatedTasks({
  tasks,
  path,
  assignableUsers,
  ...ids
}: {
  tasks: TaskItem[];
  path: string;
  assignableUsers: { id: string; name: string }[];
  accountId?: string;
  contactId?: string;
  leadId?: string;
  opportunityId?: string;
}) {
  return (
    <Card className="p-4">
      <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
        Tasks
      </h2>

      {tasks.length === 0 ? (
        <p className="mb-3 text-sm text-slate-400">No tasks yet.</p>
      ) : (
        <ul className="mb-3 divide-y divide-slate-100 dark:divide-slate-800">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-3 py-2.5">
              <form
                action={setTaskStatusAction.bind(
                  null,
                  task.id,
                  task.status === "DONE" ? "OPEN" : "DONE",
                  path
                )}
              >
                <button
                  type="submit"
                  className={
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs " +
                    (task.status === "DONE"
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-slate-300 dark:border-slate-600")
                  }
                  aria-label="Toggle done"
                >
                  {task.status === "DONE" ? "✓" : ""}
                </button>
              </form>
              <div className="flex-1">
                <p
                  className={
                    "text-sm font-medium " +
                    (task.status === "DONE"
                      ? "text-slate-400 line-through"
                      : "text-slate-800 dark:text-slate-200")
                  }
                >
                  {task.title}
                </p>
                <p className="text-xs text-slate-400">
                  {task.assignee.name} · due {formatDate(task.dueDate)} ·{" "}
                  {TASK_STATUS_LABELS[task.status]}
                </p>
              </div>
              <Badge color={TASK_PRIORITY_COLORS[task.priority] as never}>
                {TASK_PRIORITY_LABELS[task.priority]}
              </Badge>
              <form action={deleteTaskAction.bind(null, task.id, path)}>
                <button
                  type="submit"
                  className="text-xs text-slate-400 hover:text-red-600"
                  aria-label="Delete task"
                >
                  ✕
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <TaskQuickAdd path={path} assignableUsers={assignableUsers} {...ids} />
    </Card>
  );
}
