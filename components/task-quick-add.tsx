"use client";

import { useActionState } from "react";
import { createTaskAction } from "@/actions/task";
import { Button } from "@/components/ui/button";

export function TaskQuickAdd({
  path,
  assignableUsers,
  ...ids
}: {
  path: string;
  assignableUsers: { id: string; name: string }[];
  accountId?: string;
  contactId?: string;
  leadId?: string;
  opportunityId?: string;
}) {
  const [state, formAction, pending] = useActionState(
    createTaskAction,
    undefined
  );

  return (
    <form action={formAction} className="space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
      <input type="hidden" name="path" value={path} />
      <input type="hidden" name="priority" value="NORMAL" />
      {ids.accountId && <input type="hidden" name="accountId" value={ids.accountId} />}
      {ids.contactId && <input type="hidden" name="contactId" value={ids.contactId} />}
      {ids.leadId && <input type="hidden" name="leadId" value={ids.leadId} />}
      {ids.opportunityId && (
        <input type="hidden" name="opportunityId" value={ids.opportunityId} />
      )}
      <div className="flex flex-wrap gap-2">
        <input
          name="title"
          required
          placeholder="New task..."
          className="min-w-[10rem] flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        <input
          name="dueDate"
          type="date"
          className="rounded-md border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        <select
          name="assigneeId"
          required
          defaultValue=""
          className="rounded-md border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          <option value="" disabled>
            Assignee
          </option>
          {assignableUsers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        <Button type="submit" variant="secondary" disabled={pending} className="text-xs">
          {pending ? "Adding..." : "Add task"}
        </Button>
      </div>
      {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
    </form>
  );
}
